<p align="center">
  <img src="icon.svg" alt="Bitcoin Explorer Logo" width="21%">
</p>

# Bitcoin Explorer on StartOS

> Everything not listed in this document should behave the same as upstream
> BTC RPC Explorer. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[BTC RPC Explorer](https://github.com/janoside/btc-rpc-explorer) is a self-hosted Bitcoin blockchain explorer that reads everything from your own node over RPC. This package builds it from source, wires it to the Bitcoin on the same server automatically, and bundles a Redis-compatible cache.

- **Upstream repo:** <https://github.com/janoside/btc-rpc-explorer>
- **Wrapper repo:** <https://github.com/Start9-Community/bitcoin-explorer-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Two images: the explorer built here from source, and an unmodified Valkey for caching.

| Property      | Value                                                |
| ------------- | ---------------------------------------------------- |
| Images        | Built from this repo's `Dockerfile`; `valkey/valkey` |
| Architectures | x86_64, aarch64                                      |
| Command       | `npm start`, from `/workspace`                       |

| Subcontainer | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `explorer`   | The explorer itself — the one to `attach` to         |
| `valkey`     | The cache — **present only when caching is enabled** |

Upstream publishes no image, so this one is built from the vendored source. **The `valkey` subcontainer does not merely idle when caching is off — it is not created at all**, because `main` builds a different daemon set depending on the setting. An agent looking for it on a service with caching disabled will not find it.

## Volume and Data Layout

One volume, and almost nothing in it.

| Volume                | Mount Point                                       | Purpose                        |
| --------------------- | ------------------------------------------------- | ------------------------------ |
| `main`                | `/root/.config/btc-rpc-explorer.env` (file mount) | The `.env` file, and only that |
| Bitcoin's `main` (ro) | `/btcd`                                           | The RPC cookie                 |

**The volume is mounted as a single file, not a directory.** The `.env` on the volume appears at the path upstream reads its configuration from; nothing else on the volume is visible inside the container.

The explorer keeps no local state at all — every block, transaction, and address it displays is fetched from Bitcoin on request. What the cache holds is transient and lives in the Valkey container, not on disk.

## File Models

One model, and it is the whole of this package's configuration.

| File   | Format | Modelled               | Written by                                |
| ------ | ------ | ---------------------- | ----------------------------------------- |
| `.env` | env    | Yes — `FileHelper.env` | Install, `main`, and the Configure action |

Its fields fall into three groups, and which group a key is in decides what happens to a hand edit:

- **Pinned by the package.** `BTCEXP_BITCOIND_COOKIE`, `BTCEXP_HOST`, and `BTCEXP_PORT` are `z.literal(...).catch(...)` — a changed value is not merely overwritten on the next write, it is **repaired on read**. They can only ever be the cookie's mount path, all interfaces, and the port the interface is bound to.
- **Resolved at start.** `BTCEXP_BITCOIND_HOST` and `BTCEXP_BITCOIND_PORT` are written by `main` from Bitcoin's live RPC address over the internal bridge, and rewritten whenever that address changes.
- **User-owned via the action.** `BTCEXP_SLOW_DEVICE_MODE`, `BTCEXP_PRIVACY_MODE`, `BTCEXP_NO_RATES`, and `BTCEXP_REDIS_URL`.

**When Bitcoin is absent, the address keys are left out rather than filled in.** The explorer's health check then stays red until Bitcoin appears, at which point `main` heals it with a single restart. Writing a placeholder would instead produce a service that looks healthy and fetches nothing.

The address is resolved with SSL explicitly off, because Bitcoin's RPC binding publishes both a plaintext and a TLS bridge address and the explorer speaks the former.

Every other `BTCEXP_*` variable upstream supports is unset, and setting one by hand survives — the model does not strip unknown keys — but nothing in the package will manage it.

## Dependencies

One, and it is required.

| Dependency | Required | Health checks required | Mounted                      | Why                             |
| ---------- | -------- | ---------------------- | ---------------------------- | ------------------------------- |
| Bitcoin    | Yes      | `bitcoind`             | `main`, read-only at `/btcd` | Every piece of data it displays |

Authentication is by **cookie**, read from Bitcoin's own data volume, so there is no credential to configure and none to rotate. The dependency is `kind: 'running'`, so the explorer will not start until Bitcoin is up and healthy.

Refer to the dependency as **Bitcoin**: either Bitcoin Core or Bitcoin Knots satisfies it.

**What Bitcoin's own configuration decides:** a node with the transaction index enabled and no pruning gives the explorer its full feature set. A pruned node works, but blocks that have been pruned cannot be shown in detail — which presents as an explorer that displays recent history correctly and older blocks incompletely.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description       |
| --------- | ---- | ---- | ---- | ----------------- |
| Web UI    | `ui` | ui   | 3002 | The web interface |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

**There is no authentication.** Upstream's basic-auth and SSO options are not exposed by this package, so anyone who can reach the address can use the explorer. StartOS's per-address controls are the access boundary — which matters more here than for most read-only services, because the explorer will happily answer address queries about anything.

## Installation and First-Run Flow

Install seeds the `.env` with defaults and nothing else. There is no task, no credential, and no wizard.

The defaults are chosen for modest hardware: slow-device mode on, exchange rates off, privacy mode off, caching on. Those first two mean a fresh install does less work and makes no outbound requests for price data.

**Bitcoin must be installed first**, and the explorer will not start until it is running and healthy. If Bitcoin is added afterwards, the explorer heals on its own with one restart rather than needing to be reconfigured.

## Actions

One action.

### Configure

Four toggles. Run it to trade resource use against features, or to stop the explorer making outbound requests.

- **What it changes:** four keys in `.env`.
- **Cost:** the service restarts, and enabling or disabling caching changes the daemon set — the Valkey container is created or destroyed accordingly.
- **Repeat safety:** idempotent.

| Toggle                      | Default | What it does                                                                  |
| --------------------------- | ------- | ----------------------------------------------------------------------------- |
| Resource intensive features | Off     | Enables the UTXO set summary and similar heavy queries                        |
| Privacy mode                | Off     | Stops outbound exchange-rate and IP-geolocation requests                      |
| Exchange rates              | Off     | Shows fiat prices, which requires an outbound request                         |
| Key-value store for caching | On      | Runs the Valkey cache; turning it off slows repeated lookups but frees memory |

**Privacy mode and Exchange rates interact.** Privacy mode suppresses the outbound requests that exchange rates need, so enabling both leaves rates unavailable — the more restrictive setting wins, which is the safe direction but not an obvious one.

**Resource intensive features is off for a reason.** A UTXO set summary asks Bitcoin to walk its entire UTXO set, which on modest hardware takes minutes and loads the node, not the explorer.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

One check, on the explorer.

| Check     | Displayed as    | Method                 |
| --------- | --------------- | ---------------------- |
| `primary` | "Web Interface" | Port 3002 is listening |

The cache has a readiness check of its own but it is not displayed — it pings Valkey and, on failure, restarts the service rather than reporting anything to the user. So a service that restarts repeatedly with no failing check shown is the cache; the service logs name it.

**A failing "Web Interface" check most often means Bitcoin, not the explorer.** With no RPC address in the `.env` the explorer starts and cannot serve, which surfaces here rather than as a dependency error.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. In practice that is one file, the `.env`.

**There is nothing else to back up.** The explorer stores no blockchain data locally and the cache is transient, so a restored instance is immediately equivalent to the original once Bitcoin is present. The Bitcoin address in the restored `.env` is re-resolved on the new box, so it does not matter that it travelled with the backup.

## Limitations and Differences

1. **No authentication.** Upstream's basic auth and SSO are not exposed; reachability is the only access control.
2. **No Electrum integration.** The address-API and Electrum-server settings are not exposed, so address-history features that depend on an Electrum server are unavailable.
3. **No geolocation or mapping.** The API-key settings for those are not exposed.
4. **The Bitcoin node is fixed** to the StartOS dependency; an external node cannot be used.
5. **Valkey stands in for Redis.** It is protocol-compatible, and the setting is still named for Redis in upstream's configuration.
6. **Built from source**, because upstream publishes no image.
7. **A pruned Bitcoin node limits what can be displayed** for pruned blocks.

---

## Quick Reference for AI Consumers

```yaml
package_id: bitcoin-explorer
image: built from ./Dockerfile # plus valkey/valkey
architectures:
  - x86_64
  - aarch64
subcontainers:
  - explorer
  - valkey # created only when caching is enabled
volumes:
  main: /root/.config/btc-rpc-explorer.env # file mount of .env
file_models:
  - .env
startos_managed_env_vars: # all written into .env, not passed to the process
  - BTCEXP_BITCOIND_HOST # resolved from bitcoind
  - BTCEXP_BITCOIND_PORT # resolved from bitcoind
  - BTCEXP_BITCOIND_COOKIE # pinned
  - BTCEXP_HOST # pinned
  - BTCEXP_PORT # pinned
  - BTCEXP_SLOW_DEVICE_MODE
  - BTCEXP_PRIVACY_MODE
  - BTCEXP_NO_RATES
  - BTCEXP_REDIS_URL
dependencies:
  - bitcoind # required, kind: running, cookie auth via a read-only mount
interfaces:
  ui: { type: ui, port: 3002 }
actions:
  - configure
tasks: []
health_checks:
  - primary # displayed "Web Interface"
  - valkey # internal, not displayed; only when caching is enabled
```

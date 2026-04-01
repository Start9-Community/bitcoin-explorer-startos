<p align="center">
  <img src="icon.svg" alt="Bitcoin Explorer Logo" width="21%">
</p>

# Bitcoin Explorer on StartOS

> **Upstream docs:** <https://github.com/janoside/btc-rpc-explorer>
>
> Everything not listed in this document should behave the same as upstream
> BTC RPC Explorer. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[BTC RPC Explorer](https://github.com/janoside/btc-rpc-explorer) is a self-hosted Bitcoin blockchain explorer that connects directly to your Bitcoin Core node via RPC.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property         | Value                                           |
| ---------------- | ----------------------------------------------- |
| Image            | Custom `dockerBuild` (built from source)        |
| Additional Image | `valkey/valkey:alpine` (Redis-compatible cache) |
| Architectures    | x86_64, aarch64                                 |
| Entrypoint       | `npm start`                                     |

**Note:** Unlike upstream Docker deployment, this package builds the explorer from source rather than using a pre-built image.

---

## Volume and Data Layout

| Volume                | Mount Point                          | Purpose                                               |
| --------------------- | ------------------------------------ | ----------------------------------------------------- |
| `main`                | `/root/.config/btc-rpc-explorer.env` | Configuration file (mounted as single file)           |
| `main`                | `/store.json`                        | StartOS settings storage                              |
| (bitcoind dependency) | `/btcd`                              | Read-only access to Bitcoin Core data for cookie auth |

**StartOS-specific files:**

- `.env` — environment configuration file managed by StartOS
- `store.json` — stores user preferences for the configure action

---

## Installation and First-Run Flow

| Step               | Upstream                      | StartOS                                   |
| ------------------ | ----------------------------- | ----------------------------------------- |
| Bitcoin connection | Manual RPC configuration      | Auto-configured via dependency            |
| Redis/caching      | Separate Redis setup required | Valkey included and managed automatically |
| Configuration      | Edit `.env` file or CLI args  | Configure action in StartOS UI            |

On first install, StartOS seeds the `.env` configuration file with default values (slow device mode on, privacy mode off, exchange rates off, Valkey caching enabled).

**Key difference:** On StartOS, the Bitcoin Core connection is fully automatic — the explorer connects to `bitcoind.startos:8332` using cookie authentication from the mounted dependency volume.

---

## Configuration Management

| Setting                   | Upstream Method        | StartOS Method                                  |
| ------------------------- | ---------------------- | ----------------------------------------------- |
| `BTCEXP_BITCOIND_HOST`    | Env var                | Fixed: `bitcoind.startos`                       |
| `BTCEXP_BITCOIND_PORT`    | Env var                | Fixed: `8332`                                   |
| `BTCEXP_BITCOIND_COOKIE`  | Env var                | Fixed: `/btcd/.cookie`                          |
| `BTCEXP_HOST`             | Env var                | Fixed: `0.0.0.0`                                |
| `BTCEXP_PORT`             | Env var (default 3002) | Fixed: `3002`                                   |
| `BTCEXP_SLOW_DEVICE_MODE` | Env var                | Configure action: "Resource intensive features" |
| `BTCEXP_PRIVACY_MODE`     | Env var                | Configure action: "Privacy mode"                |
| `BTCEXP_NO_RATES`         | Env var                | Configure action: "Exchange rates"              |
| `BTCEXP_REDIS_URL`        | Env var                | Configure action: "Enable key-value store"      |

**Environment variables NOT configurable on StartOS:**

- `BTCEXP_ADDRESS_API` — address lookup backend selection
- `BTCEXP_ELECTRUM_SERVERS` — electrum server configuration
- `BTCEXP_BASIC_AUTH_PASSWORD` — HTTP basic authentication
- `BTCEXP_SSO_TOKEN_FILE` — SSO authentication
- `BTCEXP_IPSTACK_APIKEY` — peer IP geolocation
- `BTCEXP_MAPBOX_APIKEY` — peer location mapping
- `BTCEXP_DEMO` — demo mode
- `BTCEXP_BITCOIND_RPC_TIMEOUT` — RPC timeout

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                       |
| --------- | ---- | -------- | ----------------------------- |
| Web UI    | 3002 | HTTP     | Blockchain explorer interface |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

---

## Actions (StartOS UI)

### Configure

| Property     | Value                    |
| ------------ | ------------------------ |
| ID           | `configure`              |
| Name         | Configure                |
| Visibility   | Enabled (always visible) |
| Availability | Any status               |
| Purpose      | Adjust explorer settings |

**Options:**

| Setting                     | Default | Description                                                |
| --------------------------- | ------- | ---------------------------------------------------------- |
| Resource intensive features | Off     | Enables UTXO set queries and 24hr volume stats             |
| Privacy mode                | Off     | Disables exchange-rate and IP-geolocation queries          |
| Exchange rates              | Off     | Enables fiat exchange rate display                         |
| Enable key-value store      | On      | Uses Valkey for transaction caching (improves performance) |

---

## Dependencies

| Dependency   | Required | Version   | Purpose                          |
| ------------ | -------- | --------- | -------------------------------- |
| Bitcoin Core | **Yes**  | >= 28.3   | Provides blockchain data via RPC |

The explorer requires Bitcoin Core with `server=1` enabled. StartOS automatically:

- Connects to `bitcoind.startos:8332`
- Uses cookie authentication from the mounted volume
- Requires no manual RPC credential configuration

**Bitcoin Core configuration notes (from upstream):**

- Best experience with `txindex=1` and no pruning
- Works with pruned nodes but with reduced functionality (no full transaction details for pruned blocks)

---

## Backups and Restore

**Included in backup:**

- `main` volume — configuration and settings

**Restore behavior:**

- Configuration preferences are restored
- No blockchain data is stored locally (all from Bitcoin Core)

---

## Health Checks

| Check         | Method              | Grace Period |
| ------------- | ------------------- | ------------ |
| Web Interface | Port 3002 listening | Default      |

**Messages:**

- Success: "The web interface is ready"

---

## Limitations and Differences

1. **No Electrum server integration** — `BTCEXP_ADDRESS_API` and `BTCEXP_ELECTRUM_SERVERS` are not configurable; address history features requiring Electrum are unavailable
2. **No authentication options** — HTTP basic auth and SSO are not exposed
3. **No geolocation features** — IP geolocation and mapping APIs are not configurable
4. **Fixed Bitcoin connection** — must use the StartOS Bitcoin Core dependency; cannot connect to external Bitcoin nodes
5. **Valkey instead of Redis** — uses Valkey (Redis-compatible) for caching; functionally identical but different implementation
6. **Custom-built image** — built from source rather than using upstream Docker image

---

## What Is Unchanged from Upstream

- Full blockchain explorer functionality
- Block and transaction viewing
- Address lookup (without Electrum-dependent features)
- Mempool visualization
- Network statistics dashboard
- JSON REST API
- RPC command browser
- Search functionality
- Mining/block analysis tools

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: bitcoin-explorer
image: dockerBuild (custom)
additional_images:
  - valkey/valkey:alpine
architectures: [x86_64, aarch64]
volumes:
  main: /root/.config/btc-rpc-explorer.env (file mount)
ports:
  ui: 3002
dependencies:
  - bitcoind (required)
startos_managed_env_vars:
  - BTCEXP_SLOW_DEVICE_MODE
  - BTCEXP_PRIVACY_MODE
  - BTCEXP_NO_RATES
  - BTCEXP_REDIS_URL
fixed_env_vars:
  - BTCEXP_BITCOIND_HOST: bitcoind.startos
  - BTCEXP_BITCOIND_PORT: 8332
  - BTCEXP_BITCOIND_COOKIE: /btcd/.cookie
  - BTCEXP_HOST: 0.0.0.0
  - BTCEXP_PORT: 3002
upstream_env_vars_not_exposed:
  - BTCEXP_ADDRESS_API
  - BTCEXP_ELECTRUM_SERVERS
  - BTCEXP_BASIC_AUTH_PASSWORD
  - BTCEXP_SSO_TOKEN_FILE
  - BTCEXP_IPSTACK_APIKEY
  - BTCEXP_MAPBOX_APIKEY
actions:
  - configure (enabled, any)
health_checks:
  - port_listening: 3002
backup_volumes:
  - main
```

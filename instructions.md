# Bitcoin Explorer

## Documentation

- [BTC RPC Explorer upstream repository](https://github.com/janoside/btc-rpc-explorer) — the upstream project README and configuration reference.

## What you get on StartOS

- **A blockchain explorer web UI** that talks to your own Bitcoin node — no third-party explorer, no leaking your address lookups.
- **Automatic wiring to Bitcoin Core.** The explorer connects to `bitcoind.startos:8332` using cookie authentication; you do not configure RPC credentials by hand.
- **A managed key-value cache.** A Valkey (Redis-compatible) sidecar is bundled and managed for you; transaction lookups stay fast without setting up Redis yourself.

## Getting set up

1. Install **Bitcoin Core** first if you have not already — Bitcoin Explorer depends on it. For the best experience the Bitcoin node should be running with `txindex=1` and no pruning; pruned nodes work but cannot show full details for pruned blocks.
2. Start Bitcoin Explorer. On first launch it seeds its environment with sensible defaults (slow-device mode on, privacy mode off, exchange rates off, key-value caching on).
3. Open the **Dashboard** tab and click the **Web UI** interface to open the explorer in your browser.
4. If you want to change any of the defaults, run the **Configure** action.

## Using Bitcoin Explorer

### Web interface

The **Web UI** lands you on the explorer home page — current block height, recent blocks, mempool summary, search box. From there you can look up blocks, transactions, and addresses, browse mining and network statistics, and exercise the JSON REST API and RPC command browser. All lookups go through your own Bitcoin node.

### Actions

- **Configure** — tune four toggles that map to the `BTCEXP_*` environment variables exposed by upstream:
  - *Resource intensive features* (default off) — enable the UTXO set summary and 24-hour volume stats. Leave off on slower hardware.
  - *Privacy mode* (default off) — disable outbound exchange-rate and IP-geolocation queries.
  - *Exchange rates* (default off) — show fiat exchange rates in the UI.
  - *Enable key-value store for tx caching* (default on) — use the bundled Valkey cache for transaction lookups; turning it off makes repeated lookups slower but reduces memory use.

## Limitations

- **No Electrum integration.** `BTCEXP_ADDRESS_API` and `BTCEXP_ELECTRUM_SERVERS` are not exposed, so address-history features that rely on an Electrum server are unavailable.
- **No HTTP basic auth or SSO.** The explorer is reachable to anyone who can reach its interface; treat the LAN/Tor/custom-domain controls in StartOS as the access boundary.
- **Bitcoin connection is fixed to the StartOS Bitcoin dependency.** You cannot point this package at an external Bitcoin node.

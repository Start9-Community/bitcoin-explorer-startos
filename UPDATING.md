# Updating the upstream version

This package has two upstream sources: BTC RPC Explorer (vendored as a git submodule at `explorer/`) and Valkey (pulled as a Docker image).

## Determining the upstream version

- **BTC RPC Explorer** ([janoside/btc-rpc-explorer](https://github.com/janoside/btc-rpc-explorer)) — latest release tag:

  ```bash
  gh release view -R janoside/btc-rpc-explorer --json tagName -q .tagName
  ```

  Pin lives in the `explorer/` git submodule (commit SHA in the parent repo's tree; corresponds to a tag like `v3.5.1`). `.gitmodules` points at `https://github.com/janoside/btc-rpc-explorer.git`.

- **Valkey** ([valkey/valkey on Docker Hub](https://hub.docker.com/r/valkey/valkey)) — newest exact `9.<minor>.<patch>-alpine` tag:
  ```bash
  curl -fsSL "https://hub.docker.com/v2/repositories/valkey/valkey/tags?page_size=50&name=9.&ordering=last_updated" \
    | jq -r '.results[].name' | grep -E '^9\.[0-9]+\.[0-9]+-alpine$' | head
  ```
  Pin lives in `startos/manifest/index.ts` as `images.valkey.source.dockerTag`.

## Applying the bump

- **BTC RPC Explorer** — bump the submodule to the new upstream tag and stage the parent-repo pointer:

  ```bash
  cd explorer && git fetch --tags && git checkout v<new version>
  cd .. && git add explorer
  ```

  The image installs with `npm ci` from upstream's `npm-shrinkwrap.json`, so the new tag's
  shrinkwrap must still match its `package.json` — `npm ci` fails the build if it does not.
  Upstream's `pnpm-lock.yaml` is stale and unused.

- **Valkey** — set `images.valkey.source.dockerTag` in `startos/manifest/index.ts` to `valkey/valkey:<tag>`.

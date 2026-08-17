# Updating the upstream version

This package has two upstream sources: BTC RPC Explorer (vendored as a git submodule at `explorer/`) and Valkey (pulled as a Docker image).

## Determining the upstream version

- **BTC RPC Explorer** ([janoside/btc-rpc-explorer](https://github.com/janoside/btc-rpc-explorer)) — latest release tag:

  ```bash
  gh release view -R janoside/btc-rpc-explorer --json tagName -q .tagName
  ```

  Pin lives in the `explorer/` git submodule (commit SHA in the parent repo's tree; corresponds to a tag like `v3.5.1`). `.gitmodules` points at `https://github.com/janoside/btc-rpc-explorer.git`.

- **Valkey** ([valkey/valkey on Docker Hub](https://hub.docker.com/r/valkey/valkey)) — the package tracks the `alpine` floating tag, so there is no version to bump; to confirm what's currently published:
  ```bash
  curl -fsSL "https://hub.docker.com/v2/repositories/valkey/valkey/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```
  Pin lives in `startos/manifest/index.ts` as `images.valkey.source.dockerTag: 'valkey/valkey:alpine'`. No file change is needed when Valkey publishes a new image — rebuilding the package pulls the latest `alpine` tag.

## Applying the bump

- **BTC RPC Explorer** — bump the submodule to the new upstream tag and stage the parent-repo pointer:

  ```bash
  cd explorer && git fetch --tags && git checkout v<new version>
  cd .. && git add explorer
  ```

  Then re-check the `Dockerfile`'s rewrite of upstream's pinned `app-utils` dependency to
  `master` — it is a deliberate patch of upstream's `package.json`, not leftover debugging,
  and a bump can make it unnecessary or wrong.

- **Valkey** — no file edit; a fresh build resolves `valkey/valkey:alpine` to the current image. Only edit `startos/manifest/index.ts` if you need to pin to a specific tag instead of `alpine`.

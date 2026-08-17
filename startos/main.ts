import { manifest as bitcoinManifest } from 'bitcoin-core-startos/startos/manifest'
import { rpcHostId, rpcPort } from 'bitcoin-core-startos/startos/utils'
import { sdk } from './sdk'
import { i18n } from './i18n'
import { btcPath, redisUrl, uiPort } from './fileModels/_env'
import { envFile } from './fileModels/_env'
import { ExecCommandOptions } from '@start9labs/start-sdk/lib/mainFn/Daemons'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Bitcoin Explorer'))

  const workdir = '/workspace'

  const env = await envFile.read().const(effects)

  // Resolve bitcoind's RPC endpoint over the LXC bridge and persist it into the
  // .env the explorer reads. The bridge address only changes when bitcoind's
  // binding does, so this .const() never restarts the explorer on
  // bitcoind updates — it fires exactly on bitcoind install/uninstall/
  // port-change. When bitcoind is absent the helper resolves null; we leave the
  // address out of the .env so the explorer's health check stays red until
  // bitcoind appears, at which point the .const() heals it with one restart.
  const bridge = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: rpcHostId,
      // ssl: false is load-bearing -- the RPC binding publishes both a plaintext
      // and a TLS bridge address, and without the pin the explorer can be handed
      // the one it does not speak.
      internalPort: rpcPort,
      ssl: false,
    })
    .const()

  // Only written when the bridge resolves: a placeholder host would leave the
  // explorer looking healthy while fetching nothing, where an absent one keeps
  // the health check red and the .const() heals it with one restart.
  if (bridge) {
    const [bitcoindHost, bitcoindPort] = bridge.split(':')
    await envFile.merge(
      effects,
      {
        BTCEXP_BITCOIND_HOST: bitcoindHost,
        BTCEXP_BITCOIND_PORT: bitcoindPort,
      },
      { allowWriteAfterConst: true },
    )
  }

  const explorer = sdk.SubContainer.of(
    effects,
    { imageId: 'explorer' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        mountpoint: '/root/.config/btc-rpc-explorer.env',
        subpath: '.env',
        type: 'file',
        readonly: false,
      })
      .mountDependency<typeof bitcoinManifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: btcPath,
        readonly: true,
      }),
    'explorer',
  )

  const primaryDaemonOptions = {
    subcontainer: explorer,
    exec: {
      command: ['npm', 'start'],
    } as ExecCommandOptions,
    cwd: workdir,
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: '',
        }),
    },
  }

  if (env?.BTCEXP_REDIS_URL == redisUrl) {
    // Caching on returns a different daemon set, so the `valkey` subcontainer
    // does not exist at all when it is off — anything reasoning about
    // subcontainer names has to account for both shapes.
    const valkey = sdk.SubContainer.of(
      effects,
      { imageId: 'valkey' },
      sdk.Mounts.of(),
      'valkey',
    )

    return sdk.Daemons.of(effects)
      .addDaemon('valkey', {
        subcontainer: valkey,
        exec: { command: 'valkey-server' },
        ready: {
          display: null,
          fn: async () => {
            const res = await valkey.exec(['valkey-cli', 'ping'])
            return res.stdout.toString().trim() === 'PONG'
              ? { message: '', result: 'success' }
              : { message: res.stdout.toString().trim(), result: 'failure' }
          },
        },
        requires: [],
      })
      .addDaemon('primary', {
        ...primaryDaemonOptions,
        requires: ['valkey'],
      })
  } else {
    return sdk.Daemons.of(effects).addDaemon('primary', {
      ...primaryDaemonOptions,
      requires: [],
    })
  }
})

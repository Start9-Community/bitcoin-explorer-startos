import { sdk } from './sdk'
import { btcPath, redisUrl, uiPort } from './utils'
import { envFile } from './fileModels/_env'
import { ExecCommandOptions } from '@start9labs/start-sdk/package/lib/mainFn/Daemons'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting BTC RPC Explorer')

  const workdir = '/workspace'

  const env = await envFile.read().const(effects)

  const explorer = await sdk.SubContainer.of(
    effects,
    { imageId: 'explorer' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        mountpoint: '/root/.config/btc-rpc-explorer.env',
        subpath: ".env",
        type: 'file',
        readonly: false,
      }).mountDependency({
        dependencyId: "bitcoind",
        volumeId: "main",
        subpath: null,
        mountpoint: btcPath,
        readonly: true
      })
    ,
    'explorer',
  )

  const primaryDaemonOptions = {
    subcontainer: explorer,
    exec: {
      command: ['npm', 'start'],
    } as ExecCommandOptions,
    cwd: workdir,
    ready: {
      display: 'Web Interface',
      fn: () => sdk.healthCheck.checkPortListening(effects, uiPort, {
        successMessage: 'The web interface is ready',
        errorMessage: '',
      }),
    },
  }

  if (env?.BTCEXP_REDIS_URL == redisUrl) {
    const valkey = await sdk.SubContainer.of(effects,
      { imageId: "valkey" },
      sdk.Mounts.of(),
      "valkey",
    )

    return sdk.Daemons.of(effects)
      .addDaemon('valkey', {
        subcontainer: valkey,
        exec: { command: 'valkey-server' },
        ready: {
          display: null,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, 6379, {
              successMessage: 'KV store is ready',
              errorMessage: ''
            }),
        },
        requires: [],
      }).addDaemon('primary', {
        ...primaryDaemonOptions,
        requires: ['valkey'],
      })
  } else {
    return sdk.Daemons.of(effects).addDaemon(
      'primary', {
      ...primaryDaemonOptions,
      requires: [],
    })
  }

})

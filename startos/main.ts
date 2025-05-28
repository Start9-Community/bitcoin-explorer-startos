import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'
import { envFile } from './fileModels/_env'
import { CommandType } from '@start9labs/start-sdk/base/lib/types'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting BTC RPC Explorer')

  const additionalChecks: T.HealthCheck[] = []

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
        subpath: ".cookie",
        type: 'file',
        mountpoint: `/btcd/.cookie`,
        readonly: true
      })
    ,
    'explorer',
  )

  const primaryDaemonOptions = {
    subcontainer: explorer,
    command: ['npm', 'start'] as CommandType,
    cwd: workdir,
    ready: {
      display: 'Web Interface',
      fn: () => sdk.healthCheck.checkPortListening(effects, uiPort, {
        successMessage: 'The web interface is ready',
        errorMessage: '',
      }),
    },
  }

  if (env && env.BTCEXP_REDIS_URL) {
    const valkey = await sdk.SubContainer.of(effects,
      { imageId: "valkey" },
      sdk.Mounts.of(),
      "valkey",
    )

    return sdk.Daemons.of(effects,
      started, additionalChecks
    ).addDaemon('valkey', {
      subcontainer: valkey,
      command: 'valkey-server',
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
    return sdk.Daemons.of(effects,
      started, additionalChecks
    ).addDaemon('primary', {
      ...primaryDaemonOptions,
      requires: [],
    })
  }

})

import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting BTC RPC Explorer')

  const additionalChecks: T.HealthCheck[] = []

  const workdir = '/workspace'

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

  return sdk.Daemons.of(effects,
    started, additionalChecks
  ).addDaemon('primary', {
    subcontainer: explorer,
    command: ['npm', 'start'],
    cwd: workdir,
    env: {
      BTCEXP_BITCOIND_HOST: 'bitcoind.startos',
      BTCEXP_BITCOIND_PORT: '8332',
      BTCEXP_BITCOIND_COOKIE: '/btcd/.cookie',
      BTCEXP_HOST: '0.0.0.0',
      BTCEXP_PORT: `${uiPort}`,
    },
    ready: {
      display: 'Web Interface',
      fn: () => sdk.healthCheck.checkPortListening(effects, uiPort, {
        successMessage: 'The web interface is ready',
        errorMessage: '',
      }),
    },
    requires: [],
  })

})

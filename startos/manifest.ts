import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'btc-rpc-explorer',
  title: 'BTC Explorer',
  license: 'mit',
  wrapperRepo: 'https://github.com/aldum/btc-rpc-explorer-startos',
  upstreamRepo: 'https://github.com/janoside/btc-rpc-explorer',
  supportSite: 'https://github.com/janoside/btc-rpc-explorer/issues',
  marketingSite: 'https://bitcoinexplorer.org/',
  donationUrl: null,
  description: {
    short: 'Self-Hosted Bitcoin explorer for everyone',
    long: 'Self-Hosted Bitcoin explorer for everyone',
  },
  volumes: ['main'],
  images: {
    'explorer': {
      source: {
        dockerBuild: {}
      },
    },
    'valkey': {
      source: {
        dockerTag: 'valkey/valkey:alpine',
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: "Communicate with the Bitcoin Network",
      optional: false,
      s9pk:
        "https://github.com/aldum/bitcoind-startos/releases/download/knots-28.1.3-alpha.1/bitcoind.s9pk",
    },
  },
})

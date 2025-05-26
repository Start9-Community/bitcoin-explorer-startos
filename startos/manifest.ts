import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'btc-rpc-explorer',
  title: 'BTC Explorer',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/hello-world-wrapper',
  upstreamRepo: 'https://github.com/Start9Labs/hello-world',
  supportSite: 'https://docs.start9.com/',
  marketingSite: 'https://start9.com/',
  donationUrl: 'https://donate.start9.com/',
  description: {
    short: 'Bare bones example of a StartOS service',
    long: 'Hello World is a template service that provides examples of basic StartOS features.',
  },
  volumes: ['main'],
  images: {
    'explorer': {
      source: {
        dockerBuild: {}
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: 'Optional alert to display before installing the service',
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
      s9pk: "https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.3-alpha.0/bitcoind.s9pk",
    },
  },
})

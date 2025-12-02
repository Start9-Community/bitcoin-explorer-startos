import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures = (() => {
  if (BUILD === 'x86_64' || BUILD === 'x86' || BUILD === 'x64') {
    return ['x86_64']
  } else if (BUILD === 'aarch64' || BUILD === 'arm' || BUILD === 'arm64') {
    return ['aarch64']
  } else {
    return ['x86_64', 'aarch64']
  }
})()

export const manifest = setupManifest({
  id: 'btc-rpc-explorer',
  title: 'Bitcoin Explorer',
  license: 'mit',
  wrapperRepo: 'https://github.com/aldum/btc-rpc-explorer-startos',
  upstreamRepo: 'https://github.com/janoside/btc-rpc-explorer',
  supportSite: 'https://github.com/janoside/btc-rpc-explorer/issues',
  marketingSite: 'https://bitcoinexplorer.org/',
  donationUrl: 'https://donate.bitcoinexplorer.org',
  docsUrl:
    'https://github.com/aldum/btc-rpc-explorer-startos/blob/update/040/docs/instructions.md',
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
      arch: architectures,
    } as SDKImageInputSpec,
    'valkey': {
      source: {
        dockerTag: 'valkey/valkey:alpine',
      },
      arch: architectures,
    } as SDKImageInputSpec,
  }
  ,
  hardwareRequirements: {
    arch: architectures,
  },
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
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})

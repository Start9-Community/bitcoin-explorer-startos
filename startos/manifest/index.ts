import { setupManifest } from '@start9labs/start-sdk'
import { bitcoindDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'bitcoin-explorer',
  title: 'Bitcoin Explorer',
  license: 'MIT',
  packageRepo:
    'https://github.com/Start9Labs/bitcoin-explorer-startos',
  upstreamRepo: 'https://github.com/janoside/btc-rpc-explorer',
  marketingUrl: 'https://bitcoinexplorer.org/',
  donationUrl: 'https://donate.bitcoinexplorer.org',
  docsUrls: ['https://github.com/janoside/btc-rpc-explorer'],
  description: { short, long },
  volumes: ['main'],
  images: {
    explorer: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
    valkey: {
      source: {
        dockerTag: 'valkey/valkey:alpine',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
      },
    },
  },
})

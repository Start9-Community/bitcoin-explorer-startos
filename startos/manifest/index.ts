import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'bitcoin-explorer',
  title: 'Bitcoin Explorer',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/bitcoin-explorer-startos',
  upstreamRepo: 'https://github.com/janoside/btc-rpc-explorer',
  marketingUrl: 'https://bitcoinexplorer.org/',
  donationUrl: 'https://donate.bitcoinexplorer.org',
  description: { short, long },
  volumes: ['main'],
  images: {
    explorer: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
    valkey: {
      source: {
        dockerTag: 'valkey/valkey:alpine',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})

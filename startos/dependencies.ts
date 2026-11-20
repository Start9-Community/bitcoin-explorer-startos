import { bitcoindDescription } from './manifest/i18n'
import { sdk } from './sdk'

const bitcoind = sdk.Dependency.required('bitcoind', {
  description: bitcoindDescription,
  metadata: {
    title: 'Bitcoin',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
  },
  kind: 'running',
  versionRange:
    '(>=28.4:42 && <29) || (>=29.5:4 && <30) || (>=30.4:4 && <31) || >=31.2:4 || >=#knotsprerdts:29.3:33',
  healthChecks: ['bitcoind'],
})

export const dependencies = sdk.Dependencies.of().addDependency(bitcoind)

import { sdk } from '../sdk'
import { store } from '../fileModels/store.json'
import { env } from 'process'
import { envFile } from '../fileModels/_env'
import { boolToString, redisUrl } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  intensive: Value.toggle({
    name: 'Resource intensive features',
    description:
      'Enable resource-intensive features, including: UTXO set summary querying',
    default: false,
  }),
  privacy: Value.toggle({
    name: 'Privacy mode',
    description:
      'Disable: Exchange-rate queries, IP-geolocation queries',
    default: false,
  }),
  rates: Value.toggle({
    name: 'Exchange rates',
    description:
      'Enable exchange-rate queries',
    default: false,
  }),
  redis: Value.toggle({
    name: 'Enable key-value store for tx caching',
    description: null,
    default: false,
  }),
})

export const configure = sdk.Action.withInput(
  // id
  'configure',
  // metadata
  async ({ effects }) => ({
    name: 'Configure',
    description: '',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  // form input specification
  inputSpec,
  // optionally pre-fill the input form
  async ({ effects }) => store.read().const(effects),
  // the execution function
  async ({ effects, input }) => {
    let conf: Record<string, string | undefined> = {
      BTCEXP_SLOW_DEVICE_MODE:
        boolToString(!input.intensive),
      BTCEXP_PRIVACY_MODE:
        boolToString(input.privacy),
      BTCEXP_NO_RATES:
        boolToString(!input.rates),
      BTCEXP_REDIS_URL:
        input.redis ? redisUrl : undefined
    }

    await Promise.all([
      store.merge(effects, {
        intensive: input.intensive,
        privacy: input.privacy,
        rates: input.rates,
        redis: input.redis,
      }),
      envFile.merge(effects, conf)
    ])
  },
)

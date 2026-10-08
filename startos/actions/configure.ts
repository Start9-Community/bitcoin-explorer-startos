import { envFile, redisUrl } from '../fileModels/_env'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  intensive: Value.toggle({
    name: i18n('Resource intensive features'),
    description: i18n(
      'Turns on difficulty history, the UTXO set summary and 24-hour transaction volume, and shows more items per page. These put extra load on Bitcoin, so leave this off on slower hardware.',
    ),
    default: false,
  }),
  privacy: Value.toggle({
    name: i18n('Privacy mode'),
    description: i18n(
      'Blocks exchange-rate requests to outside services, even when Exchange rates is on.',
    ),
    default: false,
  }),
  rates: Value.toggle({
    name: i18n('Exchange rates'),
    description: i18n(
      'Shows fiat prices, fetched from an outside exchange-rate service. Has no effect while Privacy mode is on.',
    ),
    default: false,
  }),
  redis: Value.toggle({
    name: i18n('Enable key-value store for tx caching'),
    description: i18n(
      'Caches Bitcoin RPC results in a bundled Valkey store, so repeated lookups are faster. Turn it off to free the memory it uses.',
    ),
    default: true,
    immutable: false,
  }),
})

export const configure = sdk.Action.withInput(
  // id
  'configure',
  // metadata
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n(
      'Trade resource use against features, or stop the explorer making outbound requests.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  // form input specification
  inputSpec,
  // pre-fill from .env
  async ({ effects }) => {
    const env = await envFile.read().const(effects)
    if (!env) return null
    return {
      intensive: env.BTCEXP_SLOW_DEVICE_MODE === 'false',
      privacy: env.BTCEXP_PRIVACY_MODE === 'true',
      rates: env.BTCEXP_NO_RATES === 'false',
      redis: env.BTCEXP_REDIS_URL === redisUrl,
    }
  },
  // write to .env
  async ({ effects, input }) => {
    await envFile.merge(effects, {
      BTCEXP_SLOW_DEVICE_MODE: input.intensive ? 'false' : 'true',
      BTCEXP_PRIVACY_MODE: input.privacy ? 'true' : 'false',
      BTCEXP_NO_RATES: input.rates ? 'false' : 'true',
      BTCEXP_REDIS_URL: input.redis ? redisUrl : undefined,
    })
  },
)

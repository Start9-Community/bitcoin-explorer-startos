import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const btcPath = '/btcd'
const cookiePath = `${btcPath}/.cookie`

export { btcPath }

export const uiPort = 3002
export const redisUrl = 'redis://localhost:6379'

const shape = z.object({
  BTCEXP_BITCOIND_HOST: z.string().catch('127.0.0.1'),
  BTCEXP_BITCOIND_PORT: z.string().catch('8332'),
  BTCEXP_BITCOIND_COOKIE: z.literal(cookiePath).catch(cookiePath),
  BTCEXP_HOST: z.literal('0.0.0.0').catch('0.0.0.0'),
  BTCEXP_PORT: z.literal(`${uiPort}`).catch(`${uiPort}`),
  BTCEXP_SLOW_DEVICE_MODE: z.enum(['true', 'false']).optional().catch('true'),
  BTCEXP_PRIVACY_MODE: z.enum(['true', 'false']).optional().catch('false'),
  BTCEXP_NO_RATES: z.enum(['true', 'false']).optional().catch('true'),
  BTCEXP_REDIS_URL: z.literal(redisUrl).optional().catch(redisUrl),
})

export const envFile = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '.env',
  },
  shape,
)

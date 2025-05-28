import { FileHelper, matches } from "@start9labs/start-sdk"
import { defaultEnv, redisUrl } from "../utils"

const { object, literal, oneOf } = matches

const {
  BTCEXP_BITCOIND_HOST,
  BTCEXP_BITCOIND_PORT,
  BTCEXP_BITCOIND_COOKIE,
  BTCEXP_HOST,
  BTCEXP_PORT,
} = defaultEnv

const shape = object({
  BTCEXP_BITCOIND_HOST:
    literal(BTCEXP_BITCOIND_HOST)
      .onMismatch(BTCEXP_BITCOIND_HOST),
  BTCEXP_BITCOIND_PORT:
    literal(BTCEXP_BITCOIND_PORT)
      .onMismatch(BTCEXP_BITCOIND_PORT),
  BTCEXP_BITCOIND_COOKIE:
    literal(BTCEXP_BITCOIND_COOKIE)
      .onMismatch(BTCEXP_BITCOIND_COOKIE),
  BTCEXP_HOST:
    literal(BTCEXP_HOST).onMismatch(BTCEXP_HOST),
  BTCEXP_PORT:
    literal(BTCEXP_PORT).onMismatch(BTCEXP_PORT),

  // (default value is true, i.e.resource - intensive features are disabled)
  BTCEXP_SLOW_DEVICE_MODE: oneOf(literal('true'), literal('false')).optional(),
  // Default: false
  BTCEXP_PRIVACY_MODE:
    oneOf(literal('true'), literal('false')).optional(),
  // Default: true(i.e.no exchange - rate queries made)
  BTCEXP_NO_RATES:
    oneOf(literal('true'), literal('false')).optional(),

  BTCEXP_REDIS_URL:
    literal(redisUrl).optional().onMismatch(redisUrl)
  // BTCEXP_BITCOIND_RPC_TIMEOUT=5000
})

export const envFile = FileHelper.env(
  "/media/startos/volumes/main/.env",
  shape
)

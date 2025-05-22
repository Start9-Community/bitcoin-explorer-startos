import { FileHelper, matches } from "@start9labs/start-sdk"
import { uiPort } from "../utils"

const { object, literal, boolean, oneOf } = matches

const shape = object({
  BTCEXP_BITCOIND_HOST: literal("http://bitcoind.startos"),
  BTCEXP_BITCOIND_PORT: literal("8332"),
  BTCEXP_BITCOIND_COOKIE: literal("/btcd/.cookie"),
  BTCEXP_HOST: literal("0.0.0.0"),
  BTCEXP_PORT: literal(`${uiPort}`),
  // (default value is true, i.e.resource - intensive features are disabled)
  BTCEXP_SLOW_DEVICE_MODE: oneOf(literal('true'), literal('false')),
  // Default: false
  BTCEXP_PRIVACY_MODE: oneOf(literal('true'), literal('false')),
  // Default: true(i.e.no exchange - rate queries made)
  BTCEXP_NO_RATES: oneOf(literal('true'), literal('false')),


  // BTCEXP_BITCOIND_RPC_TIMEOUT=5000
  // TODO: valkey subc
  // BTCEXP_REDIS_URL=redis://localhost:6379
})

export const envFile = FileHelper.env(
  "/workspace/.env",
  shape
)

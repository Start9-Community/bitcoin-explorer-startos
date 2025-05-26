
export const uiPort = 3002

const cookiePath = "/btcd/.cookie"

export const defaultEnv = {
  BTCEXP_BITCOIND_HOST: "bitcoind.startos",
  BTCEXP_BITCOIND_PORT: "8332",
  BTCEXP_BITCOIND_COOKIE: cookiePath,
  BTCEXP_HOST: "0.0.0.0",
  BTCEXP_PORT: `${uiPort}`
}

export const boolToString =
  (b: boolean) => b ? 'true' : 'false'

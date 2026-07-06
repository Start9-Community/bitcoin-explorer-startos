export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bitcoin Explorer': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'KV store is ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The web interface': 5,

  // actions/configure.ts
  Configure: 6,
  'Resource intensive features': 7,
  'Enable resource-intensive features, including: UTXO set summary querying': 8,
  'Privacy mode': 9,
  'Disable: Exchange-rate queries, IP-geolocation queries': 10,
  'Exchange rates': 11,
  'Enable exchange-rate queries': 12,
  'Enable key-value store for tx caching': 13,

  // manifest dependencies
  'Communicate with the Bitcoin Network': 14,
  'A Bitcoin Full Node': 15,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict

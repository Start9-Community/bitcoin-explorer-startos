export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Bitcoin Explorer': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 16,

  // interfaces.ts
  'Web UI': 4,
  'The web interface': 5,

  // actions/configure.ts
  Configure: 6,
  'Resource intensive features': 7,
  'Turns on difficulty history, the UTXO set summary and 24-hour transaction volume, and shows more items per page. These put extra load on Bitcoin, so leave this off on slower hardware.': 8,
  'Privacy mode': 9,
  'Blocks exchange-rate requests to outside services, even when Exchange rates is on.': 10,
  'Exchange rates': 11,
  'Shows fiat prices, fetched from an outside exchange-rate service. Has no effect while Privacy mode is on.': 12,
  'Enable key-value store for tx caching': 13,
  'Caches Bitcoin RPC results in a bundled Valkey store, so repeated lookups are faster. Turn it off to free the memory it uses.': 14,
  'Trade resource use against features, or stop the explorer making outbound requests.': 15,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict

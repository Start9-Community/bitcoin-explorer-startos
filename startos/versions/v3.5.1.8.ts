import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_3_5_1_8 = VersionInfo.of({
  version: '3.5.1:8',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.2.0)',
    es_ES: 'Actualizaciones internas (start-sdk 1.2.0)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.2.0)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.2.0)',
    fr_FR: 'Mises à jour internes (start-sdk 1.2.0)',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

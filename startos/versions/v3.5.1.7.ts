import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_3_5_1_7 = VersionInfo.of({
  version: '3.5.1:7',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.65',
    es_ES: 'Actualización a StartOS SDK beta.65',
    de_DE: 'Update auf StartOS SDK beta.65',
    pl_PL: 'Aktualizacja do StartOS SDK beta.65',
    fr_FR: 'Mise à jour vers StartOS SDK beta.65',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

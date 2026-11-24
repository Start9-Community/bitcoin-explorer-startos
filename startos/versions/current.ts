import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.1:20',
  releaseNotes: {
    en_US:
      'The bundled Valkey cache accepts connections from Bitcoin Explorer alone.',
    es_ES:
      'La caché Valkey incluida solo acepta conexiones de Bitcoin Explorer.',
    de_DE:
      'Der mitgelieferte Valkey-Cache nimmt nur Verbindungen von Bitcoin Explorer an.',
    pl_PL:
      'Dołączona pamięć podręczna Valkey przyjmuje połączenia wyłącznie od Bitcoin Explorer.',
    fr_FR:
      "Le cache Valkey intégré n'accepte les connexions que de Bitcoin Explorer.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

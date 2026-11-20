import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.1:19',
  releaseNotes: {
    en_US:
      'While waiting for you to update Bitcoin, Bitcoin Explorer writes that to its logs once instead of repeating it every second.',
    es_ES:
      'Mientras espera a que actualice Bitcoin, Bitcoin Explorer lo indica una sola vez en sus registros en lugar de repetirlo cada segundo.',
    de_DE:
      'Während Bitcoin Explorer darauf wartet, dass Sie Bitcoin aktualisieren, vermerkt er das einmal in seinen Protokollen, statt es jede Sekunde zu wiederholen.',
    pl_PL:
      'Czekając na aktualizację Bitcoina, Bitcoin Explorer zapisuje to w logach raz, zamiast powtarzać co sekundę.',
    fr_FR:
      "En attendant que vous mettiez Bitcoin à jour, Bitcoin Explorer l'indique une seule fois dans ses journaux au lieu de le répéter chaque seconde.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

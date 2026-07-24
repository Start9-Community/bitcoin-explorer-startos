import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.1:12',
  releaseNotes: {
    en_US:
      'Internal updates (start-sdk 2.0.x). Bitcoin Explorer now reaches Bitcoin at a fixed internal bridge address and no longer restarts when Bitcoin is installed, updated, or removed.',
    es_ES:
      'Actualizaciones internas (start-sdk 2.0.x). Bitcoin Explorer ahora accede a Bitcoin en una dirección de puente interna fija y ya no se reinicia cuando Bitcoin se instala, actualiza o elimina.',
    de_DE:
      'Interne Aktualisierungen (start-sdk 2.0.x). Bitcoin Explorer erreicht Bitcoin jetzt unter einer festen internen Bridge-Adresse und startet nicht mehr neu, wenn Bitcoin installiert, aktualisiert oder entfernt wird.',
    pl_PL:
      'Aktualizacje wewnętrzne (start-sdk 2.0.x). Bitcoin Explorer łączy się teraz z Bitcoin pod stałym wewnętrznym adresem mostka i nie uruchamia się ponownie, gdy Bitcoin jest instalowany, aktualizowany lub usuwany.',
    fr_FR:
      'Mises à jour internes (start-sdk 2.0.x). Bitcoin Explorer atteint désormais Bitcoin à une adresse de pont interne fixe et ne redémarre plus lorsque Bitcoin est installé, mis à jour ou supprimé.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.1:17',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.2 or later. Bitcoin Explorer now reads only the RPC cookie Bitcoin publishes for connected services, instead of having read access to Bitcoin's whole data folder, so it needs a recent Bitcoin update. If StartOS reports the Bitcoin dependency unmet after this update, update Bitcoin.",
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Bitcoin Explorer ahora lee solo la cookie RPC que Bitcoin publica para los servicios conectados, en lugar de tener acceso de lectura a toda la carpeta de datos de Bitcoin, por lo que necesita una actualización reciente de Bitcoin. Si StartOS indica que la dependencia de Bitcoin no se cumple tras esta actualización, actualice Bitcoin.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. Bitcoin Explorer liest jetzt nur noch das RPC-Cookie, das Bitcoin für verbundene Dienste bereitstellt, statt Lesezugriff auf den gesamten Datenordner von Bitcoin zu haben, und benötigt daher ein aktuelles Bitcoin-Update. Meldet StartOS nach diesem Update die Bitcoin-Abhängigkeit als nicht erfüllt, aktualisieren Sie Bitcoin.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Bitcoin Explorer odczytuje teraz tylko plik cookie RPC, który Bitcoin udostępnia połączonym usługom, zamiast mieć dostęp do odczytu całego folderu danych Bitcoin, dlatego wymaga aktualnej wersji Bitcoin. Jeśli po tej aktualizacji StartOS zgłosi niespełnioną zależność Bitcoin, zaktualizuj Bitcoin.',
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Bitcoin Explorer ne lit plus que le cookie RPC que Bitcoin publie pour les services connectés, au lieu d'avoir accès en lecture à tout le dossier de données de Bitcoin ; il nécessite donc une mise à jour récente de Bitcoin. Si StartOS signale la dépendance Bitcoin comme non satisfaite après cette mise à jour, mettez Bitcoin à jour.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

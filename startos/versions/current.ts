import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.1:18',
  releaseNotes: {
    en_US:
      'With a Bitcoin too old to publish the RPC cookie Bitcoin Explorer reads, the explorer no longer fails to start: it waits and tells you to update Bitcoin.',
    es_ES:
      'Con un Bitcoin demasiado antiguo para publicar la cookie RPC que Bitcoin Explorer lee, el explorador ya no falla al iniciarse: espera y le indica que actualice Bitcoin.',
    de_DE:
      'Mit einem Bitcoin, das zu alt ist, um das von Bitcoin Explorer gelesene RPC-Cookie bereitzustellen, startet der Explorer nicht mehr fehlerhaft: Er wartet und fordert Sie auf, Bitcoin zu aktualisieren.',
    pl_PL:
      'Gdy Bitcoin jest zbyt stary, by udostępniać plik cookie RPC odczytywany przez Bitcoin Explorer, eksplorator nie kończy już uruchamiania błędem: czeka i prosi o aktualizację Bitcoina.',
    fr_FR:
      "Avec un Bitcoin trop ancien pour publier le cookie RPC que Bitcoin Explorer lit, l'explorateur n'échoue plus au démarrage : il attend et vous invite à mettre Bitcoin à jour.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

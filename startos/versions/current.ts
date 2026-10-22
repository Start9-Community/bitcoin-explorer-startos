import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.1:16',
  releaseNotes: {
    en_US:
      'Updates Node.js to 24.22.1 with security fixes and the StartOS SDK to 3.1.0. Node.js security notes: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases',
    es_ES:
      'Actualiza Node.js a 24.22.1 con correcciones de seguridad y el SDK de StartOS a 3.1.0. Notas de seguridad de Node.js: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases',
    de_DE:
      'Aktualisiert Node.js auf 24.22.1 mit Sicherheitskorrekturen und das StartOS-SDK auf 3.1.0. Sicherheitshinweise zu Node.js: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases',
    pl_PL:
      'Aktualizuje Node.js do wersji 24.22.1 z poprawkami bezpieczeństwa oraz SDK StartOS do wersji 3.1.0. Informacje o bezpieczeństwie Node.js: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases',
    fr_FR:
      'Met à jour Node.js vers 24.22.1 avec des correctifs de sécurité et le SDK StartOS vers 3.1.0. Notes de sécurité de Node.js : https://nodejs.org/en/blog/vulnerability/october-2026-security-releases',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})

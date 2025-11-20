import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v3_5_1_4 = VersionInfo.of({
  version: '3.5.1:4',
  releaseNotes: 'Version 3.5.1 repacked for alpha.14+',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})

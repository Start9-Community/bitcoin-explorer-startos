import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v3_5_1_5 = VersionInfo.of({
  version: '3.5.1:5',
  releaseNotes: 'Explorer version 3.5.1 rebrand',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})

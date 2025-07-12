import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v3_5_1_0 = VersionInfo.of({
  version: '3.5.1:0',
  releaseNotes: 'Version 3.5.1',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})

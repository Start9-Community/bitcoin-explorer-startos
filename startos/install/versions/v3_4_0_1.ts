import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v3_4_0_1 = VersionInfo.of({
  version: '3.4.0:1',
  releaseNotes: 'Initial release for StartOS 0.4.0',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})

import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_3_4_0_0 = VersionInfo.of({
  version: '3.4.0:0',
  releaseNotes: '',
  migrations: {
    up: async ({ effects }) => { },
    down: IMPOSSIBLE,
  },
})

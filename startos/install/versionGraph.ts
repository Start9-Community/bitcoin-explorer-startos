import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { envFile } from '../fileModels/_env'
import { defaultEnv } from '../utils'
import { store } from '../fileModels/store.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await Promise.all([
      envFile.write(effects, defaultEnv),
      store.write(effects, {
        intensive: false,
        privacy: false,
        rates: false,
        redis: false,
      })
    ])
  },
})

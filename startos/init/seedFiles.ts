import { envFile } from '../fileModels/_env'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await envFile.merge(effects, {})
})

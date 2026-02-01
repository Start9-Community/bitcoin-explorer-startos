import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, boolean } = matches

const shape = object({
  intensive: boolean,
  privacy: boolean,
  rates: boolean,
  redis: boolean,
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)

import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, boolean } = matches

const shape = object({
  intensive: boolean.optional(),
  privacy: boolean.optional(),
  rates: boolean.optional()
})

export const store = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/store.json',
  },
  shape,
)

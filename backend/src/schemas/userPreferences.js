import { z } from 'zod'

const isMinLessThanOrEqualToMax = {
  function: (data) => data.minimumLightIntensityThreshold <= data.maximumLightIntensityThreshold,
  options: {
    message: 'Minimum light intensity threshold must be less than maximum light intensity threshold.',
    path: ['minimumLightIntensityThreshold']
  }
}

const isMaxGreaterThanOrEqualToMin = {
  function: (data) => data.maximumLightIntensityThreshold >= data.minimumLightIntensityThreshold,
  options: {
    message: 'The maximum threshold cannot be lower than the minimum threshold.',
    path: ['maximumLightIntensityThreshold']
  }
}

export const userPreferencesSchema = z.object({
  minimumLightIntensityThreshold: z.number().int().min(0),
  maximumLightIntensityThreshold: z.number().int().min(0),
  lightsEnabled: z.boolean()
})
  .refine(isMinLessThanOrEqualToMax.function, isMinLessThanOrEqualToMax.options)
  .refine(isMaxGreaterThanOrEqualToMin.function, isMaxGreaterThanOrEqualToMin.options)

export function validateUserPreferences (data) {
  return userPreferencesSchema.safeParse(data)
}

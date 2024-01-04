export function adjustLighting (sensorData, userPreferences) {
  const { lightLevel, motionDetected } = sensorData
  const { lightLevelThreshold } = userPreferences
  if (lightLevel < lightLevelThreshold && motionDetected) {
    return 'Increase lighting'
  } else {
    return 'Decrease lighting'
  }
}

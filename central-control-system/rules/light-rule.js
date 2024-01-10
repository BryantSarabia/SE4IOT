import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Rule } from './rule.js'

export class LightRule extends Rule {
  constructor () {
    super({ type: SENSOR_TYPES.LIGHT })
  }

  evaluate ({ sensorData, userPreferences, room }) {
    let action = null
    if (!room.getValue('isLightOn')) {
      console.log(`Lights are OFF on room ${room.name}, no need to evaluate light rule.`)
      return action
    }
    const { value, type } = sensorData
    const lightIntensityThreshold = Number(userPreferences.lightIntensityThreshold)
    const [sensor] = room.getSensorsByType(SENSOR_TYPES.MOTION)
    if (!sensor) return null
    const actuatorType = ACTUATOR_TYPES[type]
    // Get motion sensor data of the room
    const { value: motionDetected } = sensor.getData()

    if (value < lightIntensityThreshold && motionDetected) {
      action = {
        topic: `actuators/${room.name}/${actuatorType}/increase`,
        message: {
          value: lightIntensityThreshold// Increase the light level to the threshold
        }
      }
    } else if (value > lightIntensityThreshold && motionDetected) {
      action = {
        topic: `actuators/${room.name}/${actuatorType}/decrease`,
        message: {
          value: lightIntensityThreshold // Decrease the light level to the threshold
        }
      }
    }
    return action
  }
}

import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { ROOM_VALUES_KEYS } from '../consts/roomValues.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Rule } from './rule.js'

export class LightRule extends Rule {
  constructor () {
    super({ type: SENSOR_TYPES.LIGHT })
  }

  evaluate ({ sensorData, userPreferences, room }) {
    let action = null
    if (!room.getValue(ROOM_VALUES_KEYS.IS_LIGHT_ON)) {
      console.log(`Lights are OFF on room ${room.name}, no need to evaluate light rule.`)
      return action
    }
    const lightIntensityThreshold = Number(userPreferences.lightIntensityThreshold)
    const isMotionDetected = room.getValue(ROOM_VALUES_KEYS.IS_MOTION_DETECTED)
    if (isMotionDetected === undefined || isMotionDetected === null) return action
    const { value, type } = sensorData
    const actuatorType = ACTUATOR_TYPES[type]
    if (value < lightIntensityThreshold && isMotionDetected) {
      action = {
        topic: `actuators/${room.name}/${actuatorType}/increase`,
        message: {
          value: lightIntensityThreshold// Increase the light level to the threshold
        }
      }
    }
    return action
    //  else if (value > lightIntensityThreshold && isMotionDetected) {
    //   action = {
    //     topic: `actuators/${room.name}/${actuatorType}/decrease`,
    //     message: {
    //       value: lightIntensityThreshold // Decrease the light level to the threshold
    //     }
    //   }
    // }
  }
}

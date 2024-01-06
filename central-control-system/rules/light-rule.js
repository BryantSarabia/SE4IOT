import { SENSOR_TYPES } from '../consts/sensorType'
import { Rule } from './rule'

export class LightRule extends Rule {
  constructor () {
    super({ type: SENSOR_TYPES.LIGHT })
  }

  evaluate ({ sensorData, userPreferences, room }) {
    const { value, type } = sensorData
    const { lightLevelThreshold } = userPreferences
    const [sensor] = room.getSensorByType(SENSOR_TYPES.MOTION)
    // Get motion sensor data of the room
    const { value: motionDetected } = sensor.getData()
    let action = null
    if (value < lightLevelThreshold && motionDetected) {
      action = {
        topic: `actuators/${room.name}/${type}/increase`,
        message: {
          value: lightLevelThreshold
        }
      }
    } else if (value > lightLevelThreshold && motionDetected) {
      action = {
        topic: `actuators/${room.name}/${type}/decrease`,
        message: {
          value: lightLevelThreshold
        }
      }
    }
    return action
  }
}

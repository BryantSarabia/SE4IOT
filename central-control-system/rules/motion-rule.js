import { SENSOR_TYPES } from '../consts/sensorType'
import { Rule } from './rule'

export class MotionRule extends Rule {
  constructor () {
    super({ type: SENSOR_TYPES.LIGHT })
  }

  evaluate ({ sensorData, userPreferences, room }) {
    const { value, type } = sensorData
    if (value) {
      return {
        topic: `actuators/${room.name}/${type}`,
        message: {
          value
        }
      }
    }
    return null
  }
}

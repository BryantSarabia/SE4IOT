import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Rule } from './rule.js'

export class MotionRule extends Rule {
  constructor () {
    super({ type: SENSOR_TYPES.LIGHT })
  }

  evaluate ({ sensorData, userPreferences, room }) {
    let action = null
    const { value } = sensorData
    console.log(`Lights are ${value ? '"ON"' : '"OFF"'} on room ${room.name}`)
    console.log(`Motion value: ${value}`)
    if (room.getValue('isLightOn') === value) {
      console.log(`Lights are already ${value ? '"ON"' : '"OFF"'} on room ${room.name}`)
      return action
    }
    if (value !== null && value !== undefined) {
      const turn = value ? 'on' : 'off'
      const topic = `actuators/${room.name}/${SENSOR_TYPES.LIGHT}/${turn}`
      action = {
        topic,
        message: {
          value
        }
      }
      room.updateValue('isLightOn', value)
    }
    return action
  }
}

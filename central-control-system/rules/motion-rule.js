import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { ROOM_VALUES_KEYS } from '../consts/roomValues.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Rule } from './rule.js'

export class MotionRule extends Rule {
  constructor () {
    super({ type: SENSOR_TYPES.LIGHT })
  }

  evaluate ({ sensorData, userPreferences, room }) {
    let action = null
    const isLightOn = room.getValue(ROOM_VALUES_KEYS.IS_LIGHT_ON)
    const { value, type } = sensorData
    console.log(`Lights are ${isLightOn ? '"ON"' : '"OFF"'} on room ${room.name}`)
    console.log(`Motion value: ${value}`)
    if (isLightOn === value) {
      console.log(`Lights are already ${value ? '"ON"' : '"OFF"'} on room ${room.name}`)
      return action
    }
    if (value !== null && value !== undefined) {
      const actuatorType = ACTUATOR_TYPES[type]
      const turn = value ? 'on' : 'off'
      const topic = `actuators/${room.name}/${actuatorType}/${turn}`
      action = {
        topic,
        message: {
          value
        }
      }
      room.updateValue(ROOM_VALUES_KEYS.IS_LIGHT_ON, value)
    }
    return action
  }
}

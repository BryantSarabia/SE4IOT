import { SENSOR_TO_ACTUATOR } from '../consts/mappings.js'
import { ROOM_VALUES_KEYS } from '../consts/roomValues.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Rule } from './rule.js'

export class MotionRule extends Rule {
  constructor ({ logger }) {
    super({ type: SENSOR_TYPES.LIGHT })
    this.logger = logger
  }

  evaluate ({ sensorData, userPreferences, room }) {
    let action = null
    const { lightsEnabled } = userPreferences
    if (!lightsEnabled) {
      console.log('Lights are disabled, no need to evaluate motion rule.')
      return action
    }
    const { value, type } = sensorData
    if (value === null || value === undefined) return
    const isLightOn = room.getValue(ROOM_VALUES_KEYS.IS_LIGHT_ON)
    if (isLightOn === value) {
      console.log(`Lights are already ${isLightOn ? '"ON"' : '"OFF"'} on room ${room.name}`)
      return action
    }
    console.log(`Turning lights ON in room ${room.name}`)
    const actuatorType = SENSOR_TO_ACTUATOR[type]
    if (!actuatorType) {
      console.log(`No actuator type found for sensor type ${type}`)
      return action
    }
    const turn = value ? 'on' : 'off'
    const topic = `actuators/${room.name}/${actuatorType}/${turn}`
    action = {
      topic,
      message: {
        value
      }
    }
    room.updateValue(ROOM_VALUES_KEYS.IS_LIGHT_ON, value)
    room.updateValue(ROOM_VALUES_KEYS.IS_MOTION_DETECTED, value)
    return action
  }
}

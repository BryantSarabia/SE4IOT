import { SENSOR_TYPES } from '../consts/sensorType.js'
import { LightSensor } from '../models/lightSensor.js'
import { MotionSensor } from '../models/motionSensor.js'

export class SensorFactory {
  static sensors = {
    [SENSOR_TYPES.LIGHT]: LightSensor,
    [SENSOR_TYPES.MOTION]: MotionSensor
  }

  static create ({ type, room, id }) {
    if (!SensorFactory.sensors[type]) {
      throw new Error(`Sensor type ${type} is not supported.`)
    }
    return new SensorFactory.sensors[type]({ room, id })
  }
}

import { SENSOR_TYPES } from '../consts/sensorType.js'
import { LightSensor } from '../models/lightSensor.js'
import { MotionSensor } from '../models/motionSensor.js'

export class SensorFactory {
  sensors = {
    [SENSOR_TYPES.LIGHT]: LightSensor,
    [SENSOR_TYPES.MOTION]: MotionSensor
  }

  create (type, room, id) {
    if (!this.sensors[type]) {
      throw new Error(`Sensor type ${type} is not supported.`)
    }
    return new this.sensors[type]({ room, id })
  }
}

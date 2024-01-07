import { MEASURE_UNITS } from '../consts/measureUnits.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Sensor } from './sensor.js'
export class MotionSensor extends Sensor {
  constructor ({ room, id, value = null }) {
    const type = SENSOR_TYPES.LIGHT
    const measureUnit = MEASURE_UNITS[type]
    super({ type: SENSOR_TYPES.MOTION, room, id, value, measureUnit })
  }
}

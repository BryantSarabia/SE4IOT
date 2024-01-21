import { MEASURE_UNITS } from '../consts/measureUnits.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Sensor } from './sensor.js'

export class MotionSensor extends Sensor {
  constructor ({ room, id, value = false }) {
    const type = SENSOR_TYPES.MOTION
    const measureUnit = MEASURE_UNITS[type]
    super({ type: SENSOR_TYPES.MOTION, room, id, value, measureUnit })
  }

  generateData () {
    const randomProbability = Math.random() * 100
    const probability = 50
    if (randomProbability > probability) {
      return !this.value
    }
    return this.value
  }
}

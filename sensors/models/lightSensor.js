import { MEASURE_UNITS } from '../consts/measureUnits.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { Sensor } from './sensor.js'

export class LightSensor extends Sensor {
  constructor ({ room, id, value = null }) {
    const type = SENSOR_TYPES.LIGHT
    const measureUnit = MEASURE_UNITS[type]
    super({ type: SENSOR_TYPES.LIGHT, room, id, value, measureUnit })
  }

  generateData () {
    const probability = 50
    const randomProbability = Math.random() * 100
    if (randomProbability > probability) {
      const by = Math.floor(Math.random() * 20)
      const shouldIncrease = (Math.random() * 100) >= 50
      if (!shouldIncrease && this.value - by <= 0) return 0
      return shouldIncrease ? this.value + by : this.value - by
    }
    return this.value
  }
}

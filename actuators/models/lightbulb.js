import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { Actuator } from './actuator.js'
export class Lightbulb extends Actuator {
  constructor ({ id, room, maxLux, consumptionPerLux, increaseBy = 5 }) {
    const type = ACTUATOR_TYPES.LIGHTBULB
    super({ type, room, id })
    this.currentLux = 0
    this.isOn = false
    this.maxLux = maxLux
    this.consumptionPerLux = consumptionPerLux
    this.increaseBy = increaseBy
  }

  increase () {
    if (this.currentLux === this.maxLux) {
      console.log(`${ACTUATOR_TYPES.LIGHTBULB} in ${this.room} reached max value.`)
      return
    }
    let payload = null
    let increaseBy = null
    if (this.currentLux + this.increaseBy > this.maxLux) {
      console.log(`${ACTUATOR_TYPES.LIGHTBULB} in ${this.room} reached max value.`)
      this.currentLux = this.maxLux
      increaseBy = this.maxLux - this.currentLux
    } else {
      this.currentLux += this.increaseBy
      increaseBy = this.increaseBy
    }
    payload = JSON.stringify({ value: increaseBy })
    this.mqttClient.publish(`${this.publishTopic}`, payload)
  }

  decrease () {
    if (this.currentLux === 0) {
      console.log(`${ACTUATOR_TYPES.LIGHTBULB} in ${this.room} reached min value.`)
      return
    }
    let payload = null
    let decreaseBy = null
    if (this.currentLux - this.increaseBy <= 0) {
      console.log(`${ACTUATOR_TYPES.LIGHTBULB} in ${this.room} reached min value.`)
      decreaseBy = this.currentLux * -1
      this.currentLux = 0
    } else {
      this.currentLux -= this.increaseBy
      decreaseBy = this.increaseBy * -1
    }
    payload = JSON.stringify({ value: decreaseBy })
    this.mqttClient.publish(`${this.publishTopic}`, payload)
  }

  on () {
    this.isOn = true
    this.consumptionInterval = setInterval(() => this.updateConsumption(), 1000)
    const payload = JSON.stringify({ value: this.currentLux })
    this.mqttClient.publish(`${this.publishTopic}/on`, payload)
  }

  off () {
    clearInterval(this.consumptionInterval)
    this.isOn = false
    const payload = JSON.stringify({ value: this.currentLux * -1 })
    this.currentLux = 0
    this.mqttClient.publish(`${this.publishTopic}/off`, payload)
  }

  updateConsumption () {
    if (!this.isOn) return
    this.totalConsumption += this.currentLux * this.consumptionPerLux
    const payload = JSON.stringify({
      totalConsumption: this.totalConsumption,
      consumptionPerSecond: this.currentLux * this.consumptionPerLux,
      currentLux: this.currentLux
    })
    this.mqttClient.publish(`${this.consumptionTopic}`, payload)
  }
}

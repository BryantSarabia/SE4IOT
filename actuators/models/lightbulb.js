import { mqttClient } from '../services/mqtt-client'
import { Actuator } from './actuator'

export class Lightbulb extends Actuator {
  constructor ({ type, room, value }) {
    super({ type, room, value })
    this.topic = `actuators/${room.name}/${type}`
    this.initialize()
  }

  initialize () {
    mqttClient.subscribe(`${this.topic}/+`, this.onMessage.bind(this))
  }

  onMessage (topic, message) {
    const [action] = topic.split('/').slice(3)
    if (!this[action]) return
    this[action](message)
  }

  increase (message) {
    mqttClient.publish(`${this.topic}/increase`, message)
  }

  decrease (message) {
    mqttClient.publish(`${this.topic}/decrease`, message)
  }

  on () {
    mqttClient.publish(`${this.topic}/on`)
  }

  off () {
    mqttClient.publish(`${this.topic}/on`)
  }
}

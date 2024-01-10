import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { mqttClient } from '../services/mqtt-client.js'
import { Actuator } from './actuator.js'
export class Lightbulb extends Actuator {
  constructor ({ room }) {
    const type = ACTUATOR_TYPES.LIGHTBULB
    super({ type, room })
    this.topic = `actuators/${room.name}/${type}`
  }

  initialize () {
    mqttClient.subscribe(`${this.topic}/+`, this.onMessage.bind(this))
  }

  onMessage (topic, message) {
    // topic: actuators/<room>/<type>/<action>
    if (!topic) return
    const [action] = topic.split('/').slice(3)
    if (!this[action]) return
    this[action]({ message })
  }

  increase ({ message }) {
    // mqttClient.publish(`${this.topic}/increase`, message)
  }

  decrease ({ message }) {
    // message.value *= -1
    // mqttClient.publish(`${this.topic}/decrease`, message)
  }

  on () {
    // mqttClient.publish(`${this.topic}/on`)
  }

  off () {
    // mqttClient.publish(`${this.topic}/off`)
  }
}

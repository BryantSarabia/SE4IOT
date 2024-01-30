import { MQTT_CONFIG } from '../config.js'
import { ACTIVATE_TOPIC, ACTUATORS_TOPIC, CONSUMPTION_TOPIC, PUBLISH_TOPIC } from '../consts/topics.js'
import { createMqttClient } from '../services/mqtt-client.js'
export class Actuator {
  mqttClient = createMqttClient({ brokerUrl: MQTT_CONFIG.brokerUrl })

  constructor ({ type, room, id }) {
    if (this.constructor === Actuator) {
      throw new Error('Abstract class "Actuator" cannot be instantiated directly.')
    }
    this.type = type
    this.id = id
    this.room = room
    this.totalConsumption = 0
    this.consumptionInterval = null
    // actuators/<room>/<type>
    this.topic = `${ACTUATORS_TOPIC}/${room}/${type}`
    // sensors/update/<room>/<type>/<id>
    this.publishTopic = `${PUBLISH_TOPIC}/${room}/${type}/${id}`
    this.consumptionTopic = `${CONSUMPTION_TOPIC}/${room}/${type}/${id}`
    this.activateTopic = `${ACTIVATE_TOPIC}/${room}/${type}/${id}`
  }

  async initialize () {
    this.mqttClient.publish(this.activateTopic)
    this.mqttClient.subscribe(`${this.topic}/+`)
    this.mqttClient.on('connect', () => { console.log(`Actuator ${this.type}-${this.id} in room:${this.room} connected to MQTT broker succesfully`) })
    this.mqttClient.on('error', (e) => { console.log(`Actuator ${this.type}-${this.id} in room:${this.room} could not connect to the MQTT broker. Reason: ${e}`) })
    this.mqttClient.on('message', this.onMessage.bind(this))
  }

  onMessage (topic, message) {
    // topic: actuators/<room>/<type>/<action>
    if (!topic) return
    const [, room, type, action] = topic.split('/')
    if (room !== this.room) return
    if (type !== this.type) return
    if (!this[action]) {
      console.log(`Action ${action} not implemented for ${this.type}-${this.id} in room:${this.room}`)
      return
    }
    let payload = null
    try {
      if (message) payload = JSON.parse(message.toString())
    } catch (error) {

    } finally {
      this[action]({ message: payload })
    }
  }

  increase ({ message }) {
    throw new Error('Method "increase" must be implemented.')
  }

  decrease ({ message }) {
    throw new Error('Method "decrease" must be implemented.')
  }

  on () {
    throw new Error('Method "on" must be implemented.')
  }

  off () {
    throw new Error('Method "off" must be implemented.')
  }

  updateComsuption () {
    throw new Error('Method "updateComsuption" must be implemented.')
  }
}

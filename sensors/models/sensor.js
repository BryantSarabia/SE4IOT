import { ACTIVATE_TOPIC, DEACTIVATE_TOPIC, PUBLISH_TOPIC } from '../consts/topics.js'
import { mqttClient } from '../services/mqtt-client.js'

export class Sensor {
  mqttClient = mqttClient
  interval = null
  intervalTime = 5000

  constructor ({ type, room, id, value, measureUnit }) {
    if (this.constructor === Sensor) {
      throw new Error('Abstract class "Sensor" cannot be instantiated directly.')
    }
    this.type = type
    this.room = room
    this.id = id
    this.value = value || 0
    this.measureUnit = measureUnit
    this.topic = `${this.room}/${this.type}/${this.id}`
    this.deactivateTopic = `${DEACTIVATE_TOPIC}/${this.topic}`
    this.activateTopic = `${ACTIVATE_TOPIC}/${this.topic}`
    this.publishTopic = `${PUBLISH_TOPIC}/${this.topic}`
  }

  initialize () {
    this.mqttClient.subscribe(this.deactivateTopic, this.destroy.bind(this)) // sensors/deactivate/<room>/<type>/<id>
    this.mqttClient.publish(this.activateTopic) // sensors/activate/<room>/<type>/<id>
    console.log(`Published data to topic ${this.activateTopic}`)
    this.interval = setInterval(() => {
      const value = this.generateData()
      this.updateValue({ value })
      const dataToPublish = JSON.stringify(this.getData())
      this.mqttClient.publish(this.publishTopic, dataToPublish) // sensors/data/<room>/<type>/<id>
    }, this.intervalTime)
  }

  getData () {
    return {
      type: this.type,
      room: this.room,
      id: this.id,
      value: this.value,
      measureUnit: this.measureUnit
    }
  }

  generateData () {
    throw new Error('Method "generateData" must be implemented.')
  }

  updateValue ({ value }) {
    if (value === null || value === undefined) return
    this.value = value
  }

  destroy () {
    return (topic, message) => {
      if (!topic) return
      clearInterval(this.interval)
      this.mqttClient.unsubscribe(this.deactivateTopic)
    }
  }
}

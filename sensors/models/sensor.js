import { MQTT_CONFIG } from '../config.js'
import { ACTUATOR_TO_SENSOR } from '../consts/mappings.js'
import { ACTIVATE_TOPIC, ACTUATORS_DATA_TOPIC, DEACTIVATE_TOPIC, PUBLISH_TOPIC } from '../consts/topics.js'
import { createMqttClient } from '../services/mqtt-client.js'
export class Sensor {
  interval = null
  intervalTime = 5000
  mqttClient = createMqttClient(MQTT_CONFIG.brokerUrl)

  constructor ({ type, room, id, value, measureUnit }) {
    if (this.constructor === Sensor) {
      throw new Error('Abstract class "Sensor" cannot be instantiated directly.')
    }
    this.type = type
    this.room = room
    this.id = id
    this.value = value
    this.measureUnit = measureUnit
    this.topic = `${this.room}/${this.type}/${this.id}`
    this.deactivateTopic = `${DEACTIVATE_TOPIC}/${this.topic}`
    this.activateTopic = `${ACTIVATE_TOPIC}/${this.topic}`
    this.publishTopic = `${PUBLISH_TOPIC}/${this.topic}`
    this.actuatorsDataTopic = `${ACTUATORS_DATA_TOPIC}`
  }

  initialize () {
    this.mqttClient.subscribe(this.actuatorsDataTopic) // sensors/update/<room>/<type>/<id>
    this.mqttClient.subscribe(this.deactivateTopic) // sensors/deactivate/<room>/<type>/<id>
    this.mqttClient.on('message', this.onActuatorMessage.bind(this))
    this.mqttClient.on('message', this.destroy.bind(this))
    this.mqttClient.publish(this.activateTopic) // sensors/activate/<room>/<type>/<id>
    this.interval = setInterval(() => {
      const value = this.generateData()
      this.updateValue({ value })
      this.publishData()
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

  publishData () {
    const dataToPublish = JSON.stringify(this.getData())
    this.mqttClient.publish(this.publishTopic, dataToPublish) // sensors/data/<room>/<type>/<id>
  }

  updateValue ({ value }) {
    if (value === null || value === undefined) return
    this.value = value
  }

  onActuatorMessage (topic, message) {
    let shouldProceed = false
    const topicToCheck = this.actuatorsDataTopic.replace('/#', '')
    if (!topic || !topic.includes(topicToCheck)) return shouldProceed
    const spliceBy = topicToCheck.split('/').length
    const [room, type] = topic.split('/').slice(spliceBy)
    if (room !== this.room) return shouldProceed
    if (ACTUATOR_TO_SENSOR[type] !== this.type) return shouldProceed
    shouldProceed = true
    return shouldProceed
  }

  destroy () {
    return (topic, message) => {
      if (!topic || !topic === this.deactivateTopic) return
      clearInterval(this.interval)
      this.mqttClient.unsubscribe(this.deactivateTopic)
    }
  }
}

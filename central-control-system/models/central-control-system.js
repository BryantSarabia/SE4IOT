import { SENSOR_TYPES } from '../consts/sensorType.js'
import { LightRule } from '../rules/light-rule.js'
import { MotionRule } from '../rules/motion-rule.js'
import { mqttClient } from '../services/mqtt-client.js'
import { getUserPreferencesService } from '../services/user-preferences-service.js'
import { Room } from './room.js'

export class CentralControlSystem {
  constructor ({ SensorFactory }) {
    // Initialize the Central Control System
    this.rooms = new Map()
    this.sensorFactory = new SensorFactory()
    this.rules = {
      [SENSOR_TYPES.LIGHT]: new LightRule({ centralControlSystem: this }),
      [SENSOR_TYPES.MOTION]: new MotionRule({ centralControlSystem: this })
    }
    this.userPreferences = null
    this.initialize()
  }

  async initialize () {
    try {
      this.userPreferences = await this.getUserPreferences()
      // Subscribe to sensors MQTT topics
      this.subscribeSensorActivation()
      this.subscribeSensorData()
      // Subscribe to user preferences updates
      this.subscribeUserPreferencesUpdates()
      console.log('Central Control System initialized.')
    } catch (error) {
      console.log(error.message)
    }
  }

  subscribeUserPreferencesUpdates () {
    const topic = 'user-preferences'
    mqttClient.subscribe(topic)
    mqttClient.on('message', this.handleUserPreferencesUpdate(topic).bind(this))
  }

  handleUserPreferencesUpdate (subscribedTopic) {
    return (topic, message) => {
      if (!topic || topic !== subscribedTopic) return
      try {
        this.userPreferences = JSON.parse(message.toString())
        console.log('Updated user preferences.')
      } catch (error) {
        console.log(error)
      }
    }
  }

  subscribeSensorActivation () {
    const topic = 'sensors/activate/#'
    mqttClient.subscribe(topic)
    mqttClient.on('message', this.handleSensorActivation(topic).bind(this))
  }

  handleSensorActivation (topic) {
    const subscribedTopic = topic.replace('/#', '')

    return (topic, message) => {
    // topic: sensors/activate/<room>/<type>/<id>
      if (!topic || !topic.includes(subscribedTopic)) return
      const [room, type, id] = topic.split('/').slice(2)
      if (type && room && id) {
        this.activateSensor({ type, room, id })
      }
    }
  }

  activateSensor ({ type, room, id }) {
    try {
      const sensor = this.sensorFactory.create(type, room, id)
      // If the room doesn't exist in the map, create it
      if (!this.rooms.has(room)) {
        this.rooms.set(room, new Room(room))
      }
      // Add the sensor to the room
      this.rooms.get(room).addSensor(sensor)
      console.log(`Activated ${type} sensor in ${room}.`)
    } catch (error) {
      console.log(error.message)
    }
  }

  subscribeSensorData () {
    const topic = 'sensors/data/#'
    mqttClient.subscribe(topic)
    mqttClient.on('message', this.handleSensorData(topic).bind(this))
  }

  handleSensorData (topic) {
    const subscribedTopic = topic.replace('/#', '')
    return (topic, message) => {
      // topic: sensors/data/<room>/<type>/<id>
      if (!topic || !topic.includes(subscribedTopic)) return
      const [room, type, id] = topic.split('/').slice(2)
      if (type && room && id && message) {
        try {
          const payload = JSON.parse(message.toString())
          // console.log(payload)
          this.updateSensorData({ type, roomName: room, id, message: payload })
        } catch (error) {
          console.log(error.message)
        }
      }
    }
  }

  updateSensorData ({ type, roomName, id, message }) {
    const room = this.rooms.get(roomName)
    if (!room) {
      console.log(`Room ${roomName} not found.`)
      return
    }
    try {
      const sensor = room.getSensorById(id)
      if (!sensor) {
        throw new Error(`Sensor ${id} not found in room ${room.name}.`)
      }
      if (!message) {
        throw new Error(`No body received for sensor ${id} in room ${room.name}.`)
      }
      sensor.updateValue(message)
      console.log(`Updated sensor ${sensor.id} - ${sensor.type} in ${room.name}.`)
      const rule = this.getRule(type)
      const action = rule.evaluate({ sensorData: sensor.getData(), userPreferences: this.userPreferences, room })
      if (!action) return
      console.log('Action to perform', action)
      mqttClient.publish(action.topic, JSON.stringify(action.message))
    } catch (error) {
      console.log(error.message)
    }
  }

  getRule (ruleType) {
    const rule = this.rules[ruleType]
    if (!rule) {
      throw new Error(`Rule ${ruleType} not found.`)
    }
    return this.rules[ruleType]
  }

  async getUserPreferences () {
    return getUserPreferencesService()
  }
}

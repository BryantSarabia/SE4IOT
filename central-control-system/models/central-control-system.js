import { ROOM_VALUES } from '../consts/roomValues.js'
import { SENSOR_TYPES } from '../consts/sensorType.js'
import { LightRule } from '../rules/light-rule.js'
import { MotionRule } from '../rules/motion-rule.js'
import { addSensorToRoomDashboard, createRoomDashboard } from '../services/grafana-service.js'
import { mqttClient } from '../services/mqtt-client.js'
import { getUserPreferencesService } from '../services/user-preferences-service.js'
import { Room } from './room.js'
export class CentralControlSystem {
  constructor () {
    // Initialize the Central Control System
    this.rooms = new Map()
    this.rules = {
      [SENSOR_TYPES.LIGHT]: new LightRule(),
      [SENSOR_TYPES.MOTION]: new MotionRule()
    }
    this.userPreferences = null
    this.initialize()
  }

  async initialize () {
    try {
      this.userPreferences = await this.getUserPreferences()
      if (this.userPreferences) console.log('User preferences loaded.')
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

    return async (topic, message) => {
    // topic: sensors/activate/<room>/<type>/<id>
      if (!topic || !topic.includes(subscribedTopic)) return
      const [room, type, id] = topic.split('/').slice(2)
      if (type && room && id) {
        await this.activateSensor({ type, roomName: room, id })
      }
    }
  }

  async activateSensor ({ type, roomName, id }) {
    try {
      // If the room doesn't exist in the map, create it
      if (!this.rooms.has(roomName)) {
        this.rooms.set(roomName, new Room({ name: roomName }))
        await createRoomDashboard({ room: roomName })
      }
      const roomAttribute = ROOM_VALUES[type]
      if (!roomAttribute) {
        throw new Error(`Room attribute ${type} not found.`)
      }
      const room = this.rooms.get(roomName)
      // Add the room attribute to the room
      if (!room.hasValue(roomAttribute)) {
        room.addValue(roomAttribute)
      }
      const sensor = { type, room: roomName, id }
      room.addSensor(sensor)
      console.log(`Activated ${type} sensor in ${roomName}.`)
      await addSensorToRoomDashboard({ sensor })
      console.log(`Added ${type} sensor to room ${roomName}.`)
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
          this.evaluateData({ type, roomName: room, id, message: payload })
        } catch (error) {
          console.log(error.message)
        }
      }
    }
  }

  evaluateData ({ type, roomName, id, message }) {
    const room = this.rooms.get(roomName)
    if (!room) {
      console.log(`Room ${roomName} not found.`)
      return
    }
    try {
      const sensor = room.getSensorById(id)
      if (!sensor) {
        throw new Error(`Sensor ${type} with ID:${id} not found in room ${room.name}.`)
      }
      if (!message) {
        throw new Error(`No body received for sensor ${id} in room ${room.name}.`)
      }
      const rule = this.getRule(type)
      const action = rule.evaluate({ sensorData: message, userPreferences: this.userPreferences, room })
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
    try {
      return await getUserPreferencesService()
    } catch (error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('Error connecting to the server. Please make sure the server is running.')
      }
    }
  }
}

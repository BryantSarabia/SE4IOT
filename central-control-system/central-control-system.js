// central-control/central-control-system.js
import { SENSOR_TYPES } from './consts/sensorType'
import { Room } from './models'
import { LightRule, MotionRule } from './rules'
import { mqttClient } from './services/mqtt-client'
import { getUserPreferencesService } from './services/user-preferences-service'
export class CentralControlSystem {
  constructor (sensorFactory) {
    // Initialize the Central Control System
    this.rooms = new Map()
    this.sensorFactory = sensorFactory
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
      this.subscribeToSensorData()
      // Subscribe to user preferences updates
      this.subscribeUserPreferencesUpdates()
    } catch (error) {
      console.log(error.message)
    }
  }

  subscribeUserPreferencesUpdates () {
    mqttClient.subscribe('user-preferences', this.handleUserPreferencesUpdate.bind(this))
  }

  handleUserPreferencesUpdate (topic, message) {
    try {
      this.userPreferences = JSON.parse(message)
      console.log('Updated user preferences.')
    } catch (error) {
      console.log(error)
    }
  }

  subscribeSensorActivation () {
    mqttClient.subscribe('sensors/activate/#', this.handleSensorActivation.bind(this))
  }

  handleSensorActivation (topic, { sensorKeyValue }) {
    // topic: sensors/activate/<room>/<type>/<id>
    const [room, type, id] = topic.split('/').slice(2)
    if (type && room && id) {
      this.activateSensor({ type, room, id, sensorKeyValue })
    }
  }

  activateSensor ({ type, room, id, sensorKeyValue }) {
    try {
      const sensor = this.sensorFactory.createSensor(type, room, id)
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
    mqttClient.subscribe('sensors/data/#', this.handleSensorData.bind(this))
  }

  handleSensorData (topic, message) {
    // topic: sensors/data/<room>/<type>/<id>
    const [room, type, id] = topic.split('/').slice(2)
    if (type && room && id && message) {
      this.updateSensorData({ type, room, id, message })
    }
  }

  updateSensorData ({ type, roomName, id, message }) {
    const room = this.rooms.get(roomName)
    const sensor = room.getSensorById(id)
    if (!sensor) {
      console.log(`Sensor ${id} not found in room ${room.name}.`)
      return
    }
    sensor.updateValue(message)
    console.log(`Updated ${type} sensor ${id} in ${room.name}.`)
    const rule = this.getRule(type)
    const action = rule.evaluate({ sensorData: sensor.getData(), userPreferences: this.userPreferences, room })
    if (!action) return
    mqttClient.publish(action.topic, JSON.stringify(action.message))
  }

  getRule (ruleType) {
    const rule = this.rules[ruleType]
    if (!rule) {
      throw new Error(`Rule ${ruleType} not found.`)
    }
    return this.rules[ruleType]
  }

  async getUserPreferences () {
    return await getUserPreferencesService()
  }
}

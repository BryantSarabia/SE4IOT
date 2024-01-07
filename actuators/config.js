import { ACTUATOR_TYPES } from './consts/actuatorTypes.js'

export const SERVER_CONFIG = {
  url: process.env.url ?? 'http://localhost',
  port: process.env.port ?? 3000
}

export const MQTT_CONFIG = {
  brokerUrl: process.env.mqttBrokerURL ?? 'mqtt://localhost',
  topics: {
    lightIntensity: 'light/intensity',
    lightIntensityThreshold: 'light/intensity/threshold'
  }
}

export const ROOMS = [
  {
    roomName: 'living-room',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  },
  {
    roomName: 'kitchen',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  },
  {
    roomName: 'bathroom',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  },
  {
    roomName: 'bedroom',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  },
  {
    roomName: 'office',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  },
  {
    roomName: 'garage',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  },
  {
    roomName: 'garden',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB
    }]
  }
]

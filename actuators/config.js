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
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 1500,
      consumptionPerLux: 0.00015
    }]
  },
  {
    roomName: 'kitchen',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 1000,
      consumptionPerLux: 0.0001
    }]
  },
  {
    roomName: 'bathroom',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 800,
      consumptionPerLux: 0.00008
    }]
  },
  {
    roomName: 'bedroom',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 1000,
      consumptionPerLux: 0.0001
    }]
  },
  {
    roomName: 'office',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 1000,
      consumptionPerLux: 0.0001
    }]
  },
  {
    roomName: 'garage',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 1000,
      consumptionPerLux: 0.0001
    }]
  },
  {
    roomName: 'garden',
    actuators: [{
      type: ACTUATOR_TYPES.LIGHTBULB,
      maxLux: 2000,
      consumptionPerLux: 0.0002
    }]
  }
]

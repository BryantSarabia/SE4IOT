import { ROOMS } from './config.js'
import { ActuatorFactory } from './factory/actuatorFactory.js'

function initializeActuators () {
  const actuatorFactory = new ActuatorFactory()
  for (const room of ROOMS) {
    const { roomName, actuators } = room
    for (const actuator of actuators) {
      const { type } = actuator
      try {
        const actuatorInstance = actuatorFactory.create({ type, room: roomName })
        actuatorInstance.initialize()
        console.log(`Initialized ${type} in ${roomName}.`)
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}

function initialize () {
  initializeActuators()
}

initialize()

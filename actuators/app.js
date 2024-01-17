import { ROOMS as rooms } from './config.js'
import { ActuatorFactory } from './factory/actuatorFactory.js'

function initializeActuators () {
  for (const room of rooms) {
    const { roomName, actuators } = room
    for (const actuator of actuators) {
      const { type } = actuator
      try {
        const actuatorInstance = ActuatorFactory.create({ type, room: roomName })
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

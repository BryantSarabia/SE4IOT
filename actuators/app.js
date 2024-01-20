import { ROOMS as rooms } from './config.js'
import { ActuatorFactory } from './factory/actuatorFactory.js'

function initializeActuators () {
  let id = 0
  for (const room of rooms) {
    const { roomName, actuators } = room
    for (const actuator of actuators) {
      const { type } = actuator
      try {
        const actuatorInstance = ActuatorFactory.create({ room: roomName, type, id, ...actuator })
        actuatorInstance.initialize()
        console.log(`Initialized ${type} in ${roomName}.`)
        id++
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

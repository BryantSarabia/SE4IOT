import { ROOMS as rooms } from './config.js'
import { ActuatorFactory } from './factory/actuatorFactory.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function initializeActuators () {
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
        await delay(100) // Wait 300ms between each actuator initialization to avoid Grafana errors
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}

async function initialize () {
  await delay(10000) // Wait 5 seconds for the central control system to be initialized
  initializeActuators()
}

initialize()

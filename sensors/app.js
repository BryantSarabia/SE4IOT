import { ROOMS as rooms } from './consts/rooms.js'
import { SensorFactory } from './factory/sensorFactory.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function initSensors () {
  let id = 1
  for (const room of rooms) {
    const { roomName, sensors } = room
    for (const sensor of sensors) {
      const sensorModel = SensorFactory.create({ room: roomName, id, ...sensor })
      sensorModel.initialize()
      console.log(`Initialized ${sensor.type} in ${roomName} with id ${id}.`)
      id++
      await delay(300) // Wait 300ms between each sensor initialization to avoid Grafana errors
    }
  }
}

/**
 * TODO: Remove this timeout and wait for the central control system to be initialized and listen to the sensors/activate topic
 *
 * */
async function initialize () {
  await delay(5000) // Wait 5 seconds for the central control system to be initialized
  initSensors()
}

initialize()

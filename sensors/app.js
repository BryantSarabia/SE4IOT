import { ROOMS as rooms } from './consts/rooms.js'
import { SensorFactory } from './factory/sensorFactory.js'

function initSensors () {
  let id = 0
  for (const room of rooms) {
    const { roomName, sensors } = room
    for (const sensor of sensors) {
      const sensorModel = SensorFactory.create({ type: sensor.type, room: roomName, id })
      sensorModel.initialize()
      console.log(`Initialized ${sensor.type} in ${roomName} with id ${id}.`)
      id++
    }
  }
}

function initialize () {
  initSensors()
}
/**
 * TODO: Remove this timeout and wait for the central control system to be initialized and listen to the sensors/activate topic
 *
 * */
setTimeout(() => initialize(), 5000)
// initialize()

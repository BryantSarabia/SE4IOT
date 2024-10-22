import { ROOMS as rooms } from "./consts/rooms.js";
import { SensorFactory } from "./factory/sensorFactory.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function initSensors() {
  let id = 1;
  for (const room of rooms) {
    const { roomName, sensors } = room;
    for (const sensor of sensors) {
      const sensorModel = SensorFactory.create({
        room: roomName,
        id,
        ...sensor,
      });
      sensorModel.initialize();
      console.log(`Initialized ${sensor.type} in ${roomName} with id ${id}.`);
      id++;
    }
  }
}

async function initialize() {
  initSensors();
}

await initialize();

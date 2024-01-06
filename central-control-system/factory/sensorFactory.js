import { SENSOR_TYPES } from "../consts/sensorType";
import { LightSensor, MotionSensor } from "../models";

export class SensorFactory {
  sensors = {
    [SENSOR_TYPES.LIGHT]: LightSensor,
    [SENSOR_TYPES.MOTION]: MotionSensor
  }
  createSensor(type, room, id){
    if(!this.sensors[type]){
      throw new Error('Invalid sensor type')
    }
    return new this.sensors[type]({room, id})
  }
}
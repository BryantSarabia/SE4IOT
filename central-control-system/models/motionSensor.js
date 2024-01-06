import { SENSOR_TYPES } from "../consts/sensorType";
import { Sensor } from "./sensor";

export class MotionSensor extends Sensor {
  constructor({room, id, value = null}){
    super({type: SENSOR_TYPES.LIGHT, room, id, value})
  }
}
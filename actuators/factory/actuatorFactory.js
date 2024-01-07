import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { Lightbulb } from '../models/lightbulb.js'

export class ActuatorFactory {
  constructor () {
    this.actuators = {
      [ACTUATOR_TYPES.LIGHTBULB]: Lightbulb
    }
  }

  create ({ type, room }) {
    if (!this.actuators[type]) {
      throw new Error(`Actuator type "${type}" is not supported.`)
    }
    return new this.actuators[type]({ room })
  }
}

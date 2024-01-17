import { ACTUATOR_TYPES } from '../consts/actuatorTypes.js'
import { Lightbulb } from '../models/lightbulb.js'

export class ActuatorFactory {
  static actuators = {
    [ACTUATOR_TYPES.LIGHTBULB]: Lightbulb
  }

  static create ({ type, room }) {
    if (!ActuatorFactory.actuators[type]) {
      throw new Error(`Actuator type "${type}" is not supported.`)
    }
    return new ActuatorFactory.actuators[type]({ room })
  }
}

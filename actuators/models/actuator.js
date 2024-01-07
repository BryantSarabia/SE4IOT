export class Actuator {
  constructor ({ type, room }) {
    if (this.constructor === Actuator) {
      throw new Error('Abstract class "Actuator" cannot be instantiated directly.')
    }
    this.type = type
    this.room = room
  }

  initialize () {
    throw new Error('Method "initialize" must be implemented.')
  }

  onMessage (topic, message) {
    throw new Error('Method "onMessage" must be implemented.')
  }

  increase (message) {
    throw new Error('Method "increase" must be implemented.')
  }

  decrease (message) {
    throw new Error('Method "decrease" must be implemented.')
  }

  on () {
    throw new Error('Method "on" must be implemented.')
  }

  off () {
    throw new Error('Method "off" must be implemented.')
  }
}

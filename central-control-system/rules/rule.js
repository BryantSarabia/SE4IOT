export class Rule {
  constructor ({ type }) {
    if (this.constructor === Rule) {
      throw new Error('Abstract classes cannot be instantiated.')
    }
    this.type = type
  }

  evaluate ({ sensorData, userPreferences, room }) {
    throw new Error('Method "execute" must be implemented.')
  }
}

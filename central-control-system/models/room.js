export class Room {
  constructor ({ name }) {
    this.name = name
    this.values = {}
    this.sensors = []
    this.actuators = []
  }

  addSensor (sensor) {
    this.sensors.push(sensor)
  }

  addActuator (actuator) {
    this.actuators.push(actuator)
  }

  getSensorById (id) {
    return this.sensors.find(sensor => sensor.id === id)
  }

  getActuatorById (id) {
    return this.actuators.find(actuator => actuator.id === id)
  }

  getSensorsByType (type) {
    return this.sensors.filter(sensor => sensor.type === type)
  }

  getActuatorsByType (type) {
    return this.actuators.filter(actuator => actuator.type === type)
  }

  removeSensorById (id) {
    this.sensors = this.sensors.filter(sensor => sensor.id !== id)
  }

  removeActuatorById (id) {
    this.actuators = this.actuators.filter(actuator => actuator.id !== id)
  }

  addValue (key, value = null) {
    this.values[key] = value
  }

  updateValue (key, value) {
    if (this.values[key] === undefined) throw new Error(`Value ${key} not found in room ${this.name}.`)
    this.values[key] = value
  }

  removeValue (key) {
    delete this.values[key]
  }

  hasValue (key) {
    return this.values[key] !== undefined
  }

  getValue (key) {
    return this.values[key]
  }

  getValues () {
    return this.values
  }
}

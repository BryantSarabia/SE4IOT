export class Room {
  constructor (name) {
    this.name = name
    this.values = {
      isLightOn: false
      // isAirConditionerOn: false,
    }
    this.sensors = []
  }

  addSensor (sensor) {
    this.sensors.push(sensor)
  }

  getSensorById (id) {
    return this.sensors.find(sensor => sensor.id === id)
  }

  getSensorsByType (type) {
    return this.sensors.filter(sensor => sensor.type === type)
  }

  removeSensorById (id) {
    this.sensors = this.sensors.filter(sensor => sensor.id !== id)
  }

  getSensorDataById (id) {
    const sensor = this.getSensorById(id)
    const { value } = sensor.getData()
    return value || null
  }

  updateSensorValueById (id, { value }) {
    const sensor = this.getSensorById(id)
    if (sensor) {
      sensor.updateValue({ value })
    }
  }

  addValue (key) {
    this.values[key] = null
  }

  updateValue (key, value) {
    this.values[key] = value
  }

  removeValue (key) {
    delete this.values[key]
  }

  getValue (key) {
    return this.values[key]
  }

  getValues () {
    return this.values
  }
}

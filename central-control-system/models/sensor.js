export class Sensor {
  constructor ({ type, room, id, value, measureUnit }) {
    if (this.constructor === Sensor) {
      throw new Error('Abstract class "Sensor" cannot be instantiated directly.')
    }
    this.type = type
    this.room = room
    this.id = id
    this.value = value
    this.measureUnit = measureUnit
  }

  getData () {
    return {
      type: this.type,
      room: this.room,
      id: this.id,
      value: this.value,
      measureUnit: this.measureUnit
    }
  }

  updateValue ({ value }) {
    if (value === null || value === undefined) return
    this.value = value
  }
}

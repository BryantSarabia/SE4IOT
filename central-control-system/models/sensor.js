export class Sensor {
  constructor ({ type, room, id, value }) {
    if (this.constructor === Sensor) {
      throw new Error('Abstract class "Sensor" cannot be instantiated directly.')
    }
    this.type = type
    this.room = room
    this.id = id
    this.value = value
  }

  getData () {
    return {
      type: this.type,
      room: this.room,
      id: this.id,
      value: this.value
    }
  }

  updateValue ({ value }) {
    this.value = value
  }
}

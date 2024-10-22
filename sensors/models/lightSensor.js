import { MEASURE_UNITS } from "../consts/measureUnits.js";
import { SENSOR_TYPES } from "../consts/sensorType.js";
import { Sensor } from "./sensor.js";

export class LightSensor extends Sensor {
  constructor({ room, id, value = 0, maxValue }) {
    const type = SENSOR_TYPES.LIGHT;
    const measureUnit = MEASURE_UNITS[type];
    super({ type: SENSOR_TYPES.LIGHT, room, id, value, measureUnit });
    this.maxValue = maxValue;
  }

  generateData() {
    const probability = 50;
    const randomProbability = Math.random() * 100;
    if (randomProbability > probability) {
      const by = Math.floor(Math.random() * 100);
      const shouldIncrease = Math.random() * 100 >= 20;
      this.value = shouldIncrease
        ? Math.min(this.value + by, this.maxValue)
        : Math.max(this.value - by, 0);
    }
    return this.value;
  }

  onActuatorMessage(topic, message) {
    const shouldProceed = super.onActuatorMessage(topic, message);
    if (!shouldProceed) return;
    let payload = null;
    try {
      if (message) payload = JSON.parse(message.toString());
      let { value } = payload;
      value = Number(value);
      this.value += value;
      if (this.value < 0) this.value = 0;
      if (this.value > this.maxValue) this.value = this.maxValue;
      this.publishData();
    } catch (error) {}
  }
}

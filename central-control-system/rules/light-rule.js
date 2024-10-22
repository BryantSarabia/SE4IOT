import { SENSOR_TO_ACTUATOR } from "../consts/mappings.js";
import { ROOM_VALUES_KEYS } from "../consts/roomValues.js";
import { SENSOR_TYPES } from "../consts/sensorType.js";
import { Rule } from "./rule.js";

export class LightRule extends Rule {
  constructor({ logger }) {
    super({ type: SENSOR_TYPES.LIGHT });
    this.logger = logger;
  }

  evaluate({ sensorData, userPreferences, room }) {
    let action = null;
    const { lightsEnabled } = userPreferences;
    if (!lightsEnabled) {
      console.log("Lights are disabled, no need to evaluate light rule.");
      return action;
    }
    const { value, type } = sensorData;
    const actuatorType = SENSOR_TO_ACTUATOR[type];
    if (!actuatorType) {
      console.log(`No actuator type found for sensor type ${type}`);
      return action;
    }
    if (!room.getValue(ROOM_VALUES_KEYS.IS_LIGHT_ON)) {
      console.log(
        `Lights are OFF on room ${room.name}, no need to evaluate light rule.`
      );
      return action;
    }
    const isMotionDetected = room.getValue(ROOM_VALUES_KEYS.IS_MOTION_DETECTED);
    if (
      isMotionDetected === undefined ||
      isMotionDetected === null ||
      isMotionDetected === false
    ) {
      console.log(
        `No motion detected in ${room.name}, no need to evaluate light rule.`
      );
      return action;
    }
    const minimumLightIntensityThreshold = Number(
      userPreferences.minimumLightIntensityThreshold
    );
    const maximumLightIntensityThreshold = Number(
      userPreferences.maximumLightIntensityThreshold
    );
    console.log(
      "minimumLightIntensityThreshold:",
      minimumLightIntensityThreshold
    );
    console.log(
      "maximumLightIntensityThreshold:",
      maximumLightIntensityThreshold
    );
    console.log("value:", value);
    if (value < minimumLightIntensityThreshold) {
      action = {
        topic: `actuators/${room.name}/${actuatorType}/increase`,
      };
    } else if (value > maximumLightIntensityThreshold) {
      action = {
        topic: `actuators/${room.name}/${actuatorType}/decrease`,
      };
    }
    return action;
  }
}

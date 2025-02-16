import { ACTIVATION_TYPE } from "../consts/activationType.js";
import { ACTUATOR_TYPES } from "../consts/actuatorTypes.js";
import { ROOM_VALUES } from "../consts/roomValues.js";
import { SENSOR_TYPES } from "../consts/sensorType.js";
import {
  ACTIVATE_ACTUATOR_TOPIC,
  ACTIVATE_SENSOR_TOPIC,
  SENSOR_DATA_TOPIC,
  USER_PREFERENCES_TOPIC,
} from "../consts/topics.js";
import { LightRule } from "../rules/light-rule.js";
import { MotionRule } from "../rules/motion-rule.js";
import {
  addActuatorToRoomDashboard,
  addSensorToRoomDashboard,
  createRoomDashboard,
} from "../services/grafana-service.js";
import { mqttClient } from "../services/mqtt-client.js";
import { getUserPreferencesService } from "../services/user-preferences-service.js";
import { Room } from "./room.js";

export class CentralControlSystem {
  constructor({ logger }) {
    // Initialize the Central Control System
    this.rooms = new Map();
    this.activationQueue = [];
    this.isProcessingQueue = false;
    this.rules = {
      [SENSOR_TYPES.LIGHT]: new LightRule({ logger }),
      [SENSOR_TYPES.MOTION]: new MotionRule({ logger }),
    };
    this.userPreferences = null;
    this.logger = logger;
  }

  async initialize() {
    try {
      this.userPreferences = await this.getUserPreferences();
      if (this.userPreferences) this.logger.log("User preferences loaded.");
      // Subscribe to sensors MQTT topics
      this.subscribeSensorActivation();
      this.subscribeActuatorActivation();
      this.subscribeSensorData();
      // Subscribe to user preferences updates
      this.subscribeUserPreferencesUpdates();
      this.logger.log("Central Control System initialized.");
    } catch (error) {
      this.logger.log(error.message);
    }
  }

  subscribeUserPreferencesUpdates() {
    const topic = USER_PREFERENCES_TOPIC;
    const listenFn = this.handleUserPreferencesUpdate(topic);
    mqttClient.subscribe(topic);
    mqttClient.on("message", (topic, message) => listenFn(topic, message));
  }

  handleUserPreferencesUpdate(subscribedTopic) {
    return (topic, message) => {
      if (!topic || topic !== subscribedTopic) return;
      try {
        this.userPreferences = JSON.parse(message.toString());
        this.logger.log("Updated user preferences.");
        const { lightsEnabled } = this.userPreferences;
        if (!lightsEnabled) this.turnOffLights();
      } catch (error) {
        this.logger.log(error);
      }
    };
  }

  subscribeSensorActivation() {
    const topic = ACTIVATE_SENSOR_TOPIC;
    const listenFn = this.handleSensorActivation(topic);
    mqttClient.subscribe(topic);
    mqttClient.on("message", async (topic) => await listenFn(topic));
  }

  subscribeActuatorActivation() {
    const topicToListen = ACTIVATE_ACTUATOR_TOPIC;
    const listenFn = this.handleActuatorActivation(topicToListen);
    mqttClient.subscribe(topicToListen);
    mqttClient.on("message", async (topic) => await listenFn(topic));
  }

  handleSensorActivation(topic) {
    const subscribedTopic = topic.replace("/#", "");
    return async (topic) => {
      // topic: sensors/activate/<room>/<type>/<id>
      if (!topic || !topic.includes(subscribedTopic)) return;
      const [room, type, id] = topic.split("/").slice(2);
      if (type && room && id) {
        const sensor = {
          type,
          roomName: room,
          id,
          activationType: ACTIVATION_TYPE.SENSOR,
        };
        await this.queueActivation({ device: sensor });
      }
    };
  }

  handleActuatorActivation(topic) {
    const subscribedTopic = topic.replace("/#", "");
    return async (topic) => {
      // topic: actuators/activate/<room>/<type>/<id>
      if (!topic || !topic.includes(subscribedTopic)) return;
      const [room, type, id] = topic.split("/").slice(2);
      if (type && room && id) {
        const actuator = {
          type,
          roomName: room,
          id,
          activationType: ACTIVATION_TYPE.ACTUATOR,
        };
        await this.queueActivation({ device: actuator });
      }
    };
  }

  async activateSensor({ type, roomName, id }) {
    try {
      // If the room doesn't exist in the map, create it
      if (!this.rooms.has(roomName)) {
        await createRoomDashboard({ room: roomName });
        this.rooms.set(roomName, new Room({ name: roomName }));
      }
      const roomAttribute = ROOM_VALUES[type];
      if (!roomAttribute) {
        throw new Error(`Room attribute ${type} not found.`);
      }
      const room = this.rooms.get(roomName);
      // Add the room attribute to the room
      if (!room.hasValue(roomAttribute)) {
        room.addValue(roomAttribute);
      }
      const sensor = { type, room: roomName, id };
      await addSensorToRoomDashboard({ sensor });
      room.addSensor(sensor);
      this.logger.log(`2) Activated ${type} sensor in ${roomName}.`);
    } catch (error) {
      this.logger.log(error.message);
    } finally {
      await this.processQueue();
    }
  }

  async activateActuator({ type, roomName, id }) {
    try {
      // If the room doesn't exist in the map, create it
      if (!this.rooms.has(roomName)) {
        await createRoomDashboard({ room: roomName });
        this.rooms.set(roomName, new Room({ name: roomName }));
      }
      const room = this.rooms.get(roomName);
      const actuator = { type, room: roomName, id };
      await addActuatorToRoomDashboard({ actuator });
      room.addActuator(actuator);
      this.logger.log(`2) Activated ${type} actuator in ${roomName}.`);
    } catch (error) {
      this.logger.log(error.message);
    } finally {
      await this.processQueue();
    }
  }

  subscribeSensorData() {
    const topicToListen = SENSOR_DATA_TOPIC;
    const listenFn = this.handleSensorData(topicToListen);
    mqttClient.subscribe(topicToListen);
    mqttClient.on("message", (topic, message) => listenFn(topic, message));
  }

  handleSensorData(topic) {
    const subscribedTopic = topic.replace("/#", "");
    return (topic, message) => {
      // topic: sensors/data/<room>/<type>/<id>
      if (!topic || !topic.includes(subscribedTopic)) return;
      const [room, type, id] = topic.split("/").slice(2);
      if (type && room && id && message) {
        try {
          const payload = JSON.parse(message.toString());
          this.evaluateData({ type, roomName: room, id, message: payload });
        } catch (error) {
          this.logger.log(error.message);
        }
      }
    };
  }

  evaluateData({ type, roomName, id, message }) {
    const room = this.rooms.get(roomName);
    if (!room) {
      this.logger.log(`Room ${roomName} not found.`);
      return;
    }
    try {
      const sensor = room.getSensorById(id);
      if (!sensor) {
        throw new Error(
          `Sensor ${type} with ID:${id} not found in room ${room.name}.`
        );
      }
      if (!message) {
        throw new Error(
          `No body received for sensor ${id} in room ${room.name}.`
        );
      }
      const rule = this.getRule(type);
      const action = rule.evaluate({
        sensorData: message,
        userPreferences: this.userPreferences,
        room,
      });
      if (!action) return;
      mqttClient.publish(action.topic, JSON.stringify(action.message));
    } catch (error) {
      this.logger.log(error.message);
    }
  }

  getRule(ruleType) {
    const rule = this.rules[ruleType];
    if (!rule) {
      throw new Error(`Rule ${ruleType} not found.`);
    }
    return this.rules[ruleType];
  }

  async processQueue() {
    if (this.activationQueue.length === 0) {
      this.isProcessingQueue = false;
      console.log("Queue is empty.");
      return;
    }

    this.isProcessingQueue = true;
    const device = this.activationQueue.shift();
    // activateSensor or activateActuator methods
    const key = `activate${device.activationType}`;
    await this[key]({ ...device });
    await this.processQueue();
  }

  async queueActivation({ device }) {
    this.logger.log(
      `1) Queued ${device.activationType} ${device.type} in room ${device.roomName}.`
    );
    this.activationQueue.push(device);
    if (!this.isProcessingQueue) {
      await this.processQueue();
    }
  }

  async getUserPreferences() {
    try {
      return await getUserPreferencesService();
    } catch (error) {
      if (error.message.includes("ECONNREFUSED")) {
        this.logger.log(
          "Error connecting to the server. Please make sure the server is running."
        );
      }
    }
  }

  turnOffLights() {
    this.rooms.forEach((room) => {
      const topic = `actuators/${room.name}/${ACTUATOR_TYPES.LIGHTBULB}/off`;
      mqttClient.publish(topic);
    });
    this.logger.log("Turned off all lights.");
  }
}

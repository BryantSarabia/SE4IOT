import mqtt from 'mqtt'
import { MQTT_CONFIG } from '../config.js'

const mqttBrokerURL = MQTT_CONFIG.brokerUrl
export const mqttClient = mqtt.connect(mqttBrokerURL)

import mqtt from 'mqtt'

export function createMqttClient ({ brokerUrl }) {
  return mqtt.connect(brokerUrl)
}

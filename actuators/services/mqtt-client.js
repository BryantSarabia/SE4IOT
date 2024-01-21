import mqtt from 'mqtt'

export function createMqttClient ({ brokerUrl }) {
  try {
    return mqtt.connect(brokerUrl)
  } catch (error) {
    console.log(`Could not connect to MQTT broker at ${brokerUrl}`)
    console.log(error)
  }
}

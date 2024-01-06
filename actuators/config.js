export const SERVER_CONFIG = {
  url: process.env.url ?? 'http://localhost',
  port: process.env.port ?? 3000
}

export const MQTT_CONFIG = {
  brokerUrl: process.env.mqttBrokerURL ?? 'mqtt://localhost',
  topics: {
    lightIntensity: 'light/intensity',
    lightIntensityThreshold: 'light/intensity/threshold'
  }
}

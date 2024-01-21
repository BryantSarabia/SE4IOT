// export const SERVER_CONFIG = {
//   url: process.env.SERVER_URL ?? 'http://localhost',
//   port: process.env.SERVER_PORT ?? 3000
// }

export const MQTT_CONFIG = {
  brokerUrl: process.env.MQTT_BROKER ?? 'mqtt://localhost',
  topics: {
    lightIntensity: 'light/intensity',
    lightIntensityThreshold: 'light/intensity/threshold'
  }
}

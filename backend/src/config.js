export const MONGODB_CONFIG = {
  dbUrl: process.env.mongodbURL ?? 'mongodb://127.0.0.1:27017',
  dbName: 'smart_home',
  collectionName: 'user_preferences',
  user_preferences: {
    minimumLightIntensityThreshold: 500,
    maximumLightIntensityThreshold: 1500
  }
}

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

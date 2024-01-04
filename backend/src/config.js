export const MONGODB_CONFIG = {
  dbUrl: process.env.mongodbURL ?? 'mongodb://localhost:27017',
  dbName: 'mydb',
  collectionName: 'user_preferences',
  user_preferences: {
    lightIntensityThreshold: 50
  }
}

export const SERVER_CONFIG = {
  port: process.env.port ?? 3000
}

export const MQTT_CONFIG = {
  brokerUrl: process.env.mqttBrokerURL ?? 'mqtt://localhost',
  topics: {
    lightIntensity: 'light/intensity',
    lightIntensityThreshold: 'light/intensity/threshold'
  }
}

export const MONGODB_CONFIG = {
  dbUrl: process.env.MONGODB_URL ?? 'mongodb://127.0.0.1',
  port: process.env.MONGODB_PORT ?? 27017,
  dbName: process.env.MONGODB_DB_NAME ?? 'smart_home',
  collectionName: process.env.MONGODB_COLLECTION_NAME ?? 'user_preferences',
  user_preferences: {
    minimumLightIntensityThreshold: 500,
    maximumLightIntensityThreshold: 1000,
    lightsEnabled: true
  }
}

export const GRAFANA_CONFIG = {
  url: process.env.GF_SERVER_ROOT_URL ?? 'http://localhost',
  port: process.env.GRAFANA_SERVER_PORT ?? 3000,
  token: process.env.GRAFANA_SERVER_TOKEN ?? '',
  influxdb: {
    datasourceUid: process.env.GRAFANA_INFLUXDB_DATASOURCE_UID ?? 'se4iot_influxdb',
    bucket: process.env.DOCKER_INFLUXDB_INIT_BUCKET ?? 'iot'
  }
}

export const SERVER_CONFIG = {
  url: process.env.SERVER_URL ?? 'http://localhost',
  port: process.env.SERVER_PORT ?? 3002
}

export const MQTT_CONFIG = {
  brokerUrl: process.env.MQTT_BROKER ?? 'mqtt://localhost'
}

import { createApp } from '../app.js'
import { mongodbClient } from '../clients/mongodb-client.js'
import { initializeMongoDB } from '../conf/mongodb-config.js'
import { GrafanaModel } from '../models/grafana.js'
import { HealthModel } from '../models/health.js'
import { UserPreferencesModel } from '../models/userPreferences.js'
// Initialize MongoDB connection and start Express app
await initializeMongoDB()

createApp({ userPreferencesModel: UserPreferencesModel, healthModel: HealthModel, grafanaModel: GrafanaModel })

// Gracefully close MongoDB connection on application shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...')
  await mongodbClient.close()
  console.log('MongoDB connection closed.')
  process.exit(0)
})

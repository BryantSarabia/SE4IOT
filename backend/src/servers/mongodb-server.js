import { createApp } from '../app.js'
import { initializeMongoDB } from '../conf/mongodb-config.js'
import { UserPreferencesModel } from '../models/userPreferences.js'
import { mongodbClient } from '../services/mongodb-client.js'

// Initialize MongoDB connection and start Express app
await initializeMongoDB()

createApp({ userPreferencesModel: UserPreferencesModel })

// Gracefully close MongoDB connection on application shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...')
  await mongodbClient.close()
  console.log('MongoDB connection closed.')
  process.exit(0)
})

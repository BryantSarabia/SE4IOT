import { createApp } from '../app'
import { initializeMongoDB } from '../conf/mongodb-config'
import { UserPreferencesModel } from '../models/userPreferences'
import { mongodbClient } from '../services/mongodb-client'
createApp({ userPreferencesModel: UserPreferencesModel })

// Gracefully close MongoDB connection on application shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...')
  await mongodbClient.close()
  console.log('MongoDB connection closed.')
  process.exit(0)
})

// Initialize MongoDB connection and start Express app
initializeMongoDB()

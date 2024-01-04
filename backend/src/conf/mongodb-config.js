import { MONGODB_CONFIG } from '../config.js'
import { mongodbClient } from '../services/mongodb-client.js'

const mongodbUserPreferencesCollection = MONGODB_CONFIG.collectionName
const DefaultUserPreferences = MONGODB_CONFIG.user_preferences

async function insertUserPreferencesIfNotExists () {
  const userPreferences = await mongodbClient.getDB().collection(mongodbUserPreferencesCollection).find({}).toArray()
  if (userPreferences.length === 0) {
    await mongodbClient.insertDocument(mongodbUserPreferencesCollection, DefaultUserPreferences)
    console.log(`User preferences inserted in collection '${mongodbUserPreferencesCollection}'`)
  } else {
    console.log(`User preferences already exist in collection '${mongodbUserPreferencesCollection}'`)
  }
}

// Initialize MongoDB connection
export async function initializeMongoDB () {
  try {
    await mongodbClient.connect()
    console.log('Connected to MongoDB')
    await mongodbClient.createCollection(mongodbUserPreferencesCollection)
    console.log(`Collection '${mongodbUserPreferencesCollection}' created`)
    insertUserPreferencesIfNotExists()
  } catch (error) {
    console.error('Error MongoDB:', error)
    process.exit(1) // Exit the application if MongoDB connection fails
  }
}

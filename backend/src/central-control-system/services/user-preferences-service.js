// backend/src/central-control/services/user-preferences-service.js

import { mongodbClient } from '../../services/mongodb-client'

export async function getUserPreferences () {
  try {
    const db = mongodbClient.getDB()
    const collection = db.collection('user_preferences')
    const userPreferences = await collection.findOne({})
    return userPreferences
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    throw error
  }
}

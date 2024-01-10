// backend/src/central-control/services/user-preferences-service.js

import { SERVER_CONFIG } from '../config.js'
export async function getUserPreferencesService () {
  try {
    const response = await fetch(`${SERVER_CONFIG.url}:${SERVER_CONFIG.port}/user-preferences`)
    const userPreferences = await response.json()
    return userPreferences
  } catch (error) {
    console.error('Error fetching user preferences')
    throw error
  }
}

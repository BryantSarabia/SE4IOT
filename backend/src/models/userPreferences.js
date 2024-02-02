import { mongodbClient } from '../clients/mongodb-client.js'
import { MONGODB_CONFIG } from '../config.js'

export class UserPreferencesModel {
  static async getUserPreferences () {
    const document = await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).findOne({})
    return document
  }

  static async insertUserPreferences (userPreferences) {
    const document = await mongodbClient.insertDocument(MONGODB_CONFIG.collectionName, userPreferences ?? MONGODB_CONFIG.defaultUserPreferences)
    return {
      _id: document.insertedId,
      ...userPreferences
    }
  }

  static async updateUserPreferences (userPreferences) {
    const { _id } = userPreferences
    await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).updateOne({ _id }, { $set: userPreferences })
    return userPreferences
  }

  static async deleteUserPreferences (userPreferences) {
    const { _id } = userPreferences
    await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).deleteOne({ _id })
  }
}

import { mongodbClient } from '../clients/mongodb-client.js'
import { MONGODB_CONFIG } from '../config.js'
import { HttpError } from '../error-handling/httpError.js'

export class UserPreferencesModel {
  static async getUserPreferences () {
    const document = await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).findOne({})
    if (!document) throw new HttpError('User preferences not found.', 404)
    return document
  }

  static async insertUserPreferences (userPreferences) {
    const userSettings = await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).findOne({})
    if (userSettings) throw new HttpError('User preferences already exist.', 400)
    const document = await mongodbClient.insertDocument(MONGODB_CONFIG.collectionName, userPreferences ?? MONGODB_CONFIG.defaultUserPreferences)
    return {
      _id: document.insertedId,
      ...userPreferences
    }
  }

  static async updateUserPreferences (userPreferences) {
    const document = await this.getUserPreferences()
    if (!document) throw new HttpError('User preferences not found.', 404)
    await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).updateOne({ _id: document._id }, { $set: userPreferences })
    return {
      _id: document._id,
      ...userPreferences
    }
  }

  static async deleteUserPreferences () {
    const document = await this.getUserPreferences()
    if (!document) throw new HttpError('User preferences not found.', 404)
    await mongodbClient.getDB().collection(MONGODB_CONFIG.collectionName).deleteOne({ _id: document._id })
  }
}

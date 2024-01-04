import { MONGODB_CONFIG } from '../config'
import { HttpError } from '../error-handling/httpError'
import { mongodbClient } from '../services/mongodb-client'

export class UserPreferencesModel {
  collectionName = MONGODB_CONFIG.collectionName

  static async getUserPreferences () {
    const document = await mongodbClient.getDB().collection(this.collectionName).findOne({})
    if (!document) throw new HttpError('User preferences not found.', 404)
    return document
  }

  static async insertUserPreferences (userPreferences) {
    const userSettings = this.getUserPreferences()
    if (userSettings) throw new HttpError('User preferences already exist.', 400)
    const document = await mongodbClient.insertDocument(this.collectionName, userPreferences)
    return document
  }

  static async updateUserPreferences (id, userPreferences) {
    const document = this.getUserPreferences()
    await mongodbClient.getDB().collection(this.collectionName).updateOne({ _id: document._id }, { $set: userPreferences })
  }

  static async deleteUserPreferences () {
    const document = this.getUserPreferences()
    if (!document) throw new HttpError('User preferences not found.', 404)
    await mongodbClient.getDB().collection(this.collectionName).deleteOne({ _id: document._id })
  }
}

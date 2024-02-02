import { mqttClient } from '../clients/mqtt-client.js'
import { HttpError, ValidationError } from '../error-handling/httpError.js'
import { validateUserPreferences } from '../schemas/userPreferences.js'

export class UserPreferencesController {
  constructor ({ userPreferencesModel }) {
    this.userPreferencesModel = userPreferencesModel
  }

  get = async (req, res, next) => {
    try {
      const userPreferences = await this.userPreferencesModel.getUserPreferences()
      if (!userPreferences) {
        throw new HttpError('User preferences not found.', 404)
      }
      return res.status(200).json(userPreferences)
    } catch (error) {
      next(error)
    }
  }

  insert = async (req, res, next) => {
    try {
      const validationResult = validateUserPreferences(req.body)
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message, 400)
      }
      const userPreferences = await this.userPreferencesModel.getUserPreferences()
      if (userPreferences) {
        throw new HttpError('User preferences already exist.', 400)
      }
      const document = await this.userPreferencesModel.insertUserPreferences(req.body)
      return res.status(201).json({ message: 'User preferences inserted successfully.', document })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      const userPreferences = await this.userPreferencesModel.getUserPreferences()
      if (!userPreferences) {
        throw new HttpError('User preferences not found.', 404)
      }
      await this.userPreferencesModel.deleteUserPreferences(userPreferences)
      return res.status(200).json({ message: 'User preferences deleted successfully.' })
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const validationResult = validateUserPreferences(req.body)
      if (!validationResult.success) {
        throw new ValidationError(validationResult.error.message, 400)
      }
      let userPreferences = await this.userPreferencesModel.getUserPreferences()
      if (!userPreferences) {
        throw new HttpError('User preferences not found.', 404)
      }
      userPreferences = { ...userPreferences, ...req.body }
      const document = await this.userPreferencesModel.updateUserPreferences(userPreferences)
      mqttClient.publish('user-preferences', JSON.stringify(userPreferences))
      return res.status(200).json({ message: 'User preferences updated successfully.', userPreferences: document })
    } catch (error) {
      next(error)
    }
  }
}

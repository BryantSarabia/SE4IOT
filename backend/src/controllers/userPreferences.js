export class UserPreferencesController {
  constructor ({ userPreferencesModel }) {
    this.userPreferencesModel = userPreferencesModel
  }

  get = async (req, res, next) => {
    try {
      const userPreferences = await this.userPreferencesModel.getUserPreferences()
      return res.status(200).json(userPreferences)
    } catch (error) {
      next(error)
    }
  }

  insert = async (req, res, next) => {
    try {
      const userPreferences = req.body
      const document = await this.userPreferencesModel.insertUserPreferences(userPreferences)
      return res.status(201).json({ message: 'User preferences inserted successfully.', document })
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const userPreferences = req.body
      const document = await this.userPreferencesModel.updateUserPreferences(userPreferences)
      return res.status(200).json({ message: 'User preferences updated successfully.', userPreferences: document })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      await this.userPreferencesModel.deleteUserPreferences()
      return res.status(200).json({ message: 'User preferences deleted successfully.' })
    } catch (error) {
      next(error)
    }
  }
}

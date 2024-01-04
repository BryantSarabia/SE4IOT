export class UserPreferencesController {
  constructor ({ userPreferencesModel }) {
    this.userPreferencesModel = userPreferencesModel
  }

  get = async (req, res) => {
    const userPreferences = await this.userPreferencesModel.getUserPreferences()
    return res.status(200).json({ message: 'User preferences retrieved successfully.', userPreferences })
  }

  insert = async (req, res) => {
    const { userPreferences } = req.body
    const document = await this.userPreferencesModel.insertUserPreferences(userPreferences)
    return res.status(201).json({ message: 'User preferences inserted successfully.', document })
  }

  update = async (req, res) => {
    const { userPreferences } = req

    const document = await this.userPreferencesModel.updateUserPreferences(userPreferences)
    return res.status(200).json({ message: 'User preferences updated successfully.', document })
  }

  delete = async (req, res) => {
    await this.userPreferencesModel.deleteUserPreferences()
    return res.status(200).json({ message: 'User preferences deleted successfully.' })
  }
}

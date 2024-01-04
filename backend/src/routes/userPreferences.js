import { Router } from 'express'
import { UserPreferencesController } from '../controllers/userPreferences'
export const createUserPreferencesRouter = ({ userPreferencesModel }) => {
  const userPreferencesController = new UserPreferencesController({ userPreferencesModel })
  const router = Router()
  router.get('/', userPreferencesController.get)
  router.post('/', userPreferencesController.insert)
  router.put('/', userPreferencesController.update)
  router.delete('/', userPreferencesController.delete)
  return router
}

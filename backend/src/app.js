import express, { json } from 'express'
import { SERVER_CONFIG } from './config'
import { errorHandler } from './middlewares/error-handler'
import { createUserPreferencesRouter } from './routes/userPreferences'
// const CentralControlSystem = require('./central-control/central-control-system');

export const createApp = ({ userPreferencesModel }) => {
  const app = express()
  app.use(json())
  app.use(errorHandler)
  app.use('/user-preferences', createUserPreferencesRouter({ userPreferencesModel }))
  // Initialize the Central Control System
  // const centralControlSystem = new CentralControlSystem()

  // Start Express app
  const port = SERVER_CONFIG.port
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

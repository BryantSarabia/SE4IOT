import express, { json } from 'express'
import { SERVER_CONFIG } from './config.js'
import { errorHandler } from './middlewares/error-handler.js'
import { createUserPreferencesRouter } from './routes/userPreferences.js'
// const CentralControlSystem = require('./central-control/central-control-system');

export const createApp = ({ userPreferencesModel }) => {
  const app = express()
  app.use(json())
  app.use('/user-preferences', createUserPreferencesRouter({ userPreferencesModel }))
  // Initialize the Central Control System
  // const centralControlSystem = new CentralControlSystem()
  app.use(errorHandler)

  // Start Express app
  const port = SERVER_CONFIG.port
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

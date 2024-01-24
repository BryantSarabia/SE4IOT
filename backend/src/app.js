import express, { json } from 'express'
import { SERVER_CONFIG } from './config.js'
import { errorHandler } from './middlewares/error-handler.js'
import { createGrafanaRouter } from './routes/grafana.js'
import { createHealthRouter } from './routes/health.js'
import { createUserPreferencesRouter } from './routes/userPreferences.js'

export const createApp = ({ userPreferencesModel, healthModel, grafanaModel }) => {
  const app = express()
  app.use(json())
  app.use('/health', createHealthRouter({ healthModel }))
  app.use('/user-preferences', createUserPreferencesRouter({ userPreferencesModel }))
  app.use('/grafana/dashboards', createGrafanaRouter({ grafanaModel }))
  // Initialize the Central Control System
  // const centralControlSystem = new CentralControlSystem()
  app.use(errorHandler)

  // Start Express app
  const url = SERVER_CONFIG.url
  const port = SERVER_CONFIG.port
  app.listen(port, () => {
    console.log(`Server is running on ${url}:${port}`)
  })
}

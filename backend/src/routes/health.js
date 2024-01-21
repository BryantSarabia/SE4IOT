import { Router } from 'express'
import { HealthController } from '../controllers/health.js'

export const createHealthRouter = ({ healthModel }) => {
  const healthController = new HealthController({ healthModel })
  const router = Router()
  router.get('/', healthController.get)
  return router
}

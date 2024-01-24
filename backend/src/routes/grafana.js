import { Router } from 'express'
import { GrafanaController } from '../controllers/grafana.js'

export const createGrafanaRouter = ({ grafanaModel }) => {
  const grafanaController = new GrafanaController({ grafanaModel })
  const router = Router()
  router.get('/', grafanaController.getAllDashboards)
  router.get('/:uid', grafanaController.getDashboardByUid)
  router.post('/', grafanaController.createRoomDashboard)
  router.put('/:uid/sensors', grafanaController.addSensorToRoomDashboard)
  return router
}

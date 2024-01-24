import { HttpError } from '../error-handling/httpError.js'
import { Dashboard } from '../models/dashboard.js'
import { SensorPanel } from '../models/panel.js'
export class GrafanaController {
  constructor ({ grafanaModel }) {
    this.grafanaModel = grafanaModel
  }

  getAllDashboards = async (req, res, next) => {
    try {
      const dashboards = await this.grafanaModel.getDashboards()
      res.json(dashboards)
    } catch (error) {
      next(error)
    }
  }

  getDashboardByUid = async (req, res, next) => {
    try {
      const { uid } = req.params
      const dashboard = await this.grafanaModel.getDashboardByUid({ uid })
      if (!dashboard) throw new HttpError(`Dashboard with uid: ${uid} not found.`, 404)
      return res.json(dashboard)
    } catch (error) {
      next(error)
    }
  }

  createRoomDashboard = async (req, res, next) => {
    try {
      let dashboard = null
      const { room } = req.body
      dashboard = await this.grafanaModel.getDashboardByUid({ uid: room })
      if (dashboard) throw new HttpError(`Dashboard for room: ${room} already exists.`, 400)
      else dashboard = new Dashboard({ dashboard: { title: room, uid: room } })
      const dashboardModel = await this.grafanaModel.createDashboard({ dashboard, timezone: dashboard.timezone })
      if (!dashboardModel) throw new HttpError(`Dashboard for room: ${room} not created.`, 400)
      console.log(`Dashboard for room: ${room} created successfully.`)
      return res.status(201).json({ message: `Dashboard for room: ${room} created successfully.`, dashboard: dashboardModel })
    } catch (error) {
      next(error)
    }
  }

  addSensorToRoomDashboard = async (req, res, next) => {
    try {
      let dashboardModel = null
      const { sensor } = req.body
      const { uid } = req.params
      const dashboard = await this.grafanaModel.getDashboardByUid({ uid })
      if (!dashboard) {
        dashboardModel = new Dashboard({ dashboard: { title: uid, uid } })
        // await this.grafanaModel.createDashboard({ dashboard: dashboardModel })
        console.log(`Dashboard for room: ${uid} did not exist. It was created successfully.`)
      } else {
        dashboardModel = new Dashboard({ dashboard, timezone: dashboard.timezone })
      }
      const id = dashboardModel.totalPanels()
      const panel = new SensorPanel({ id, sensor })
      if (dashboardModel.hasPanel({ panel: panel.panel })) throw new HttpError(`Sensor: ${sensor.type}-${sensor.id} already added to room: ${uid}.`, 400)
      dashboardModel.addPanel({ panel: panel.panel })
      const updatedDashboard = await this.grafanaModel.updateDashboard({ dashboard: dashboardModel.dashboard })
      if (!updatedDashboard) throw new HttpError(`Sensor: ${sensor} not added to room: ${uid}.`, 400)
      console.log(`Sensor: ${sensor.type} added to room: ${uid} successfully.`)
      return res.status(201).json({ message: `Sensor: ${sensor} added to room: ${uid} successfully.` })
    } catch (error) {
      next(error)
    }
  }
}

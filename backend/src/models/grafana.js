import { createDashboard, getDashboardByUid, getDashboards, getDashboardsByName, updateDashboard } from '../services/grafana-service.js'

export class GrafanaModel {
  static async getDashboards () {
    const dashboards = await getDashboards()
    return dashboards
  }

  static async getDashboardsByName ({ name }) {
    const dashboard = await getDashboardsByName({ name })
    return dashboard
  }

  static async getDashboardByUid ({ uid }) {
    const dashboard = await getDashboardByUid({ uid })
    return dashboard
  }

  static async createDashboard ({ dashboard }) {
    const newDashboards = await createDashboard({ dashboard: dashboard.dashboard })
    return newDashboards
  }

  static async updateDashboard ({ dashboard }) {
    const updatedDashboard = await updateDashboard({ dashboard })
    return updatedDashboard
  }
}

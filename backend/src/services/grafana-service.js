import { grafanaClient as client } from '../clients/grafana-client.js'
import { STATUS } from '../consts/status.js'

export async function getDashboards () {
  try {
    const response = await client.get('/api/search?query=&')
    if (!response.statusText === STATUS.OK) return []
    return response.data
  } catch (error) {
    console.error('Error getting dashboards')
    throw error
  }
}

export async function getDashboardsByName ({ name }) {
  try {
    const response = await client.get(`/api/search?query=${name}`)
    if (!response.statusText === STATUS.OK) return null
    return response.data
  } catch (error) {
    console.error('Error getting dashboard')
    throw error
  }
}

export async function createDashboard ({ dashboard, overwrite = false }) {
  try {
    const response = await client.post('/api/dashboards/db', { dashboard, overwrite })
    if (!response.statusText === STATUS.OK) return null
    return response.data
  } catch (error) {
    console.log(error.data)
    console.error('Error creating dashboard')
    throw error
  }
}

export async function getDashboardByUid ({ uid }) {
  try {
    const response = await client.get(`/api/dashboards/uid/${uid}`)
    if (!response.statusText === STATUS.OK) return null
    const { dashboard } = response.data
    if (!dashboard) return null
    return dashboard
  } catch (error) {
    console.error('Error getting dashboard')
    throw error
  }
}

export async function updateDashboard ({ dashboard }) {
  try {
    const response = await client.post('/api/dashboards/db', { dashboard, overwrite: true })
    if (!response.statusText === STATUS.OK) return null
    return dashboard
  } catch (error) {
    console.log(error)
    console.error('Error updating dashboard')
    throw error
  }
}

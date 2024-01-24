import axios from 'axios'
import { GRAFANA_CONFIG } from '../config.js'

export const createGrafanaClient = ({ url, port, token }) => {
  if (!url || !port || !token) {
    throw new Error('Grafana client is missing required parameters')
  }
  const grafanaUrl = `${url}:${port}`
  const client = axios.create({
    baseURL: grafanaUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    validateStatus: (status) => status < 500
  })
  return client
}

export const grafanaClient = createGrafanaClient({ url: GRAFANA_CONFIG.url, port: GRAFANA_CONFIG.port, token: GRAFANA_CONFIG.token })

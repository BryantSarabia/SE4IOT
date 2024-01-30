import { SERVER_CONFIG } from '../config.js'

export async function createRoomDashboard ({ room }) {
  try {
    const url = `${SERVER_CONFIG.url}:${SERVER_CONFIG.port}/grafana/dashboards`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ room })
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating room dashboard')
    throw error
  }
}

export async function addSensorToRoomDashboard ({ sensor }) {
  try {
    const url = `${SERVER_CONFIG.url}:${SERVER_CONFIG.port}/grafana/dashboards/${sensor.room}/sensors`
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ sensor }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error adding sensor to room')
    throw error
  }
}

export async function addActuatorToRoomDashboard ({ actuator }) {
  try {
    const url = `${SERVER_CONFIG.url}:${SERVER_CONFIG.port}/grafana/dashboards/${actuator.room}/actuators`
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ actuator }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  } catch (error) {
    console.error('Error adding actuator to room')
    throw error
  }
}

import { GRAFANA_CONFIG } from '../config.js'
import { DEVICE_TYPES } from '../consts/deviceTypes.js'
export class Panel {
  constructor ({ id, device, panelType, deviceType, options }) {
    this.panel = {
      type: panelType,
      title: this.generateTitle({ deviceType, device }),
      gridPos: this.calculateGridPos({ id }),
      options
    }
    this.dbConfig = {
      datasource: {
        type: 'influxdb',
        uid: GRAFANA_CONFIG.influxdb.datasourceUid
      },
      bucket: GRAFANA_CONFIG.influxdb.bucket
    }
  }

  generateTitle ({ deviceType, device }) {
    return `${device.room}-${deviceType ? deviceType + '-' : ''}${device.type}-${device.id}`
  }

  calculateGridPos ({ id }) {
    const grid = { h: 9, w: 12, x: (id % 2) * 12, y: Math.floor(id / 2) * 9 }
    return grid
  }
}

export class SensorPanel extends Panel {
  constructor ({
    id, sensor, options = {
      tooltip: {
        mode: 'multi'
      }
    }
  }) {
    super({ id, device: sensor, panelType: 'timeseries', deviceType: DEVICE_TYPES.SENSOR, options })
    this.query = `from(bucket: "${this.dbConfig.bucket}")\r\n    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\r\n    |> filter(fn: (r) => r.type == "${sensor.type}" and r.room == "${sensor.room}" and r.id == "${sensor.id}")\r\n    |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)`
    const targets = [
      {
        datasource: this.dbConfig.datasource,
        query: this.query,
        refId: 'A'
      }
    ]
    this.panel = { ...this.panel, targets }
  }
}

export class ActuatorPanel extends Panel {
  // eslint-disable-next-line no-useless-constructor
  constructor ({
    id, actuator, options = {
      tooltip: {
        mode: 'multi'
      }
    }
  }) {
    super({ id, device: actuator, panelType: 'timeseries', deviceType: DEVICE_TYPES.ACTUATOR, options })
    this.query = `from(bucket: "${this.dbConfig.bucket}")\r\n    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\r\n    |> filter(fn: (r) => r.type == "${actuator.type}" and r.room == "${actuator.room}" and r.id == "${actuator.id}")\r\n    |> aggregateWindow(every: v.windowPeriod, fn: last, createEmpty: false)`
    const targets = [
      {
        datasource: this.dbConfig.datasource,
        query: this.query,
        refId: 'A'
      }
    ]
    this.panel = { ...this.panel, targets }
  }
}

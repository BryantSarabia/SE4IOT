import { GRAFANA_CONFIG } from '../config.js'

export class Panel {
  constructor ({ id, device, panelType, deviceType }) {
    this.panel = {
      type: panelType,
      title: this.generateTitle({ deviceType, device }),
      gridPos: this.calculateGridPos(id),
      refresh: '5s'
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
    return `${deviceType ? deviceType + '-' : ''}${device.type}-${device.id}`
  }

  calculateGridPos (id) {
    const grid = { h: 9, w: 12, x: (id % 2) * 12, y: Math.floor(id / 2) * 9 }
    return grid
  }
}

export class SensorPanel extends Panel {
  constructor ({ id, sensor }) {
    super({ id, device: sensor, panelType: 'timeseries', deviceType: 'sensor' })
    this.query = `from(bucket: "${this.dbConfig.bucket}")\r\n    |> range(start: -1h)\r\n    |> filter(fn: (r) => r.type == "${sensor.type}" and r.room == "${sensor.room}")`
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
  constructor ({ id, room, actuator }) {
    super({ id, room, actuator })
    // Add specific logic for actuators here
  }
}

// export class RoomPanel extends Panel {
//   constructor ({ id, room }) {
//     super({ id, room })
//     this.query = `from(bucket: \"iot\")\r\n    |> range(start: -1h)\r\n    |> filter(fn: (r) => r.type == \"light\" and r.room == \"living-room\")`
//     this.targets = [
//       {
//         datasource: this.dbConfig.datasource,
//         query: 'from(bucket: "usgs-earthquakes")\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  ',
//         refId: 'A'
//       }
//     ]
//   }
// }

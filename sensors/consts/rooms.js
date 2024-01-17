import { MEASURE_UNITS } from './measureUnits.js'
import { SENSOR_TYPES } from './sensorType.js'

const rooms = {
  LIVING_ROOM: 'living-room',
  KITCHEN: 'kitchen',
  BATHROOM: 'bathroom',
  BEDROOM: 'bedroom',
  OFFICE: 'office',
  GARAGE: 'garage',
  GARDEN: 'garden'
}

export const ROOMS = [
  {
    roomName: rooms.LIVING_ROOM,
    sensors: [
      {
        type: SENSOR_TYPES.LIGHT,
        measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
        value: 0
      },
      {
        type: SENSOR_TYPES.MOTION,
        measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
        value: false
      }
    ]
  }
  // {
  //   roomName: rooms.KITCHEN,
  //   sensors: [{
  //     type: SENSOR_TYPES.LIGHT,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
  //     value: 0
  //   },
  //   {
  //     type: SENSOR_TYPES.MOTION,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
  //     value: false
  //   }
  //   ]
  // },
  // {
  //   roomName: rooms.BATHROOM,
  //   sensors: [{
  //     type: SENSOR_TYPES.LIGHT,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
  //     value: 0
  //   },
  //   {
  //     type: SENSOR_TYPES.MOTION,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
  //     value: false
  //   }
  //   ]
  // },
  // {
  //   roomName: rooms.BEDROOM,
  //   sensors: [{
  //     type: SENSOR_TYPES.LIGHT,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
  //     value: 0
  //   },
  //   {
  //     type: SENSOR_TYPES.MOTION,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
  //     value: false
  //   }
  //   ]
  // },
  // {
  //   roomName: rooms.OFFICE,
  //   sensors: [{
  //     type: SENSOR_TYPES.LIGHT,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
  //     value: 0
  //   },
  //   {
  //     type: SENSOR_TYPES.MOTION,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
  //     value: false
  //   }
  //   ]
  // },
  // {
  //   roomName: rooms.GARAGE,
  //   sensors: [{
  //     type: SENSOR_TYPES.LIGHT,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
  //     value: 0
  //   },
  //   {
  //     type: SENSOR_TYPES.MOTION,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
  //     value: false
  //   }
  //   ]
  // },
  // {
  //   roomName: rooms.GARDEN,
  //   sensors: [{
  //     type: SENSOR_TYPES.LIGHT,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.LIGHT],
  //     value: 0
  //   },
  //   {
  //     type: SENSOR_TYPES.MOTION,
  //     measureUnit: MEASURE_UNITS[SENSOR_TYPES.MOTION],
  //     value: false
  //   }
  //   ]
  // }
]

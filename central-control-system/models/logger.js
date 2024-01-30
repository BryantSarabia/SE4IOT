class Logger {
  constructor () {
    if (this.constructor === Logger) {
      throw new Error('Abstract class "Logger" cannot be instantiated directly.')
    }
  }

  log (...mesage) {
    throw new Error('Method "log" must be implemented.')
  }

  error (...mesage) {
    throw new Error('Method "error" must be implemented.')
  }
}

export class ConsoleLogger extends Logger {
  log (...mesage) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...mesage)
    }
  }

  error (...mesage) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...mesage)
    }
  }
}

export class ProductionLogger extends Logger {
  log (...mesage) {
    // Log messages to a service like AWS CloudWatch
    console.log(...mesage)
  }

  error (...mesage) {
    // Log messages to a service like AWS CloudWatch
    console.error(...mesage)
  }
}

import { ENVIRONMENTS } from '../consts/environments.js'
import { ConsoleLogger, ProductionLogger } from '../models/logger.js'
export class LoggerFactory {
  static loggers = {
    [ENVIRONMENTS.PRODUCTION]: ProductionLogger,
    [ENVIRONMENTS.DEVELOPMENT]: ConsoleLogger,
    [ENVIRONMENTS.TEST]: ConsoleLogger
  }

  static create (...params) {
    const environment = process.env.NODE_ENV
    const Logger = LoggerFactory.loggers[environment]
    if (!Logger) throw new Error(`Logger for environment "${environment}" not found.`)
    return new Logger(...params)
  }
}

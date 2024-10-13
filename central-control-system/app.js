import { LoggerFactory } from "./factory/loggerFactory.js";
import { CentralControlSystem } from "./models/central-control-system.js";

const logger = LoggerFactory.create();
const centralControlSystem = new CentralControlSystem({ logger });
await centralControlSystem.initialize();

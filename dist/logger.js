"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
const levelNumbers = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR
};
class Logger {
    constructor() {
        const level = LogLevel.INFO;
        this.logger = winston.createLogger({
            level: level,
            format: winston.format.json(),
            transports: [new winston.transports.Console()],
            defaultMeta: { service: 'db-migration' },
        });
    }
    getLevel() {
        return levelNumbers[this.logger.level];
    }
    setLevel(level) {
        this.logger.level = level;
    }
    child(props) {
        return this.logger.child(props);
    }
    debug(data, message = 'Debug') {
        this.logger.debug(message, data);
    }
    info(data, message = 'Info') {
        this.logger.info(message, data);
    }
    warn(data, message = 'Warning') {
        this.logger.warn(message, data);
    }
    error(data, message = 'Internal Server Error') {
        if (!data.err) {
            this.logger.error(message, data);
        }
        else {
            const error = {
                message: data.err.message,
                data: data.err.data
            };
            const stack = data.err.stack !== undefined ? data.err.stack.toString().split('\n') : undefined;
            this.logger.error(data.err.message);
        }
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map
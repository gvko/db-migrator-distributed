"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const bunyanPretty = require("bunyan-pretty");
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
const levelNumbers = {
    20: LogLevel.DEBUG,
    30: LogLevel.INFO,
    40: LogLevel.WARN,
    50: LogLevel.ERROR
};
/**
 * Creates and initializes the logger object.
 */
class Logger {
    constructor() {
        const level = LogLevel.INFO;
        const consoleStream = {
            formatter: 'pretty',
            level,
            stream: bunyanPretty()
        };
        this.logger = bunyan.createLogger({
            name: 'db-migrator',
            streams: [consoleStream]
        });
    }
    getLevel() {
        return levelNumbers[this.logger.level()];
    }
    setLevel() {
    }
    setName() {
    }
    child(props) {
        return this.logger.child(props);
    }
    debug(data, message = 'Debug') {
        this.logger.debug(data, message);
    }
    info(data, message = 'Info') {
        this.logger.info(data, message);
    }
    warn(data, message = 'Warning') {
        this.logger.warn(data, message);
    }
    error(data, message = 'Internal Server Error') {
        if (!data.err) {
            this.logger.error(data, message);
        }
        else {
            const error = {
                message: data.err.message,
                data: data.err.data
            };
            /*
             * Bunyan (the logging library in use) filters objects from redundant data. The error stack trace is being
             * filtered, if passed as an object. That's why we strip it out as an array of strings.
             * We only send the stack trace to the logs, but not in the response to the client.
             */
            const stack = data.err.stack !== undefined ? data.err.stack.toString().split('\n') : undefined;
            this.logger.error({ error, stack }, data.err.message);
        }
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map
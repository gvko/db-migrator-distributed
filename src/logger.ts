import * as winston from 'winston';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

const levelNumbers = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR
};

export default class Logger {
  private readonly logger: winston.Logger;

  constructor() {
    const level: LogLevel = LogLevel.INFO;

    this.logger = winston.createLogger({
      level: level,
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
      defaultMeta: { service: 'db-migration' },
    });
  }

  getLevel(): LogLevel {
    return levelNumbers[this.logger.level] as LogLevel;
  }

  setLevel(level: LogLevel): void {
    this.logger.level = level;
  }

  child(props: object): winston.Logger {
    return this.logger.child(props);
  }

  debug(data: object, message = 'Debug'): void {
    this.logger.debug(message, data);
  }

  info(data: object, message = 'Info'): void {
    this.logger.info(message, data);
  }

  warn(data: object, message = 'Warning'): void {
    this.logger.warn(message, data);
  }

  error(data: object | any, message = 'Internal Server Error'): void {
    if (!data.err) {
      this.logger.error(message, data);
    } else {
      const error = {
        message: data.err.message,
        data: data.err.data
      };

      const stack = data.err.stack !== undefined ? data.err.stack.toString().split('\n') : undefined;

      this.logger.error(data.err.message);
    }
  }
}

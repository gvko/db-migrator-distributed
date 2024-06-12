import * as winston from 'winston';
declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
export default class Logger {
    private readonly logger;
    constructor();
    getLevel(): LogLevel;
    setLevel(level: LogLevel): void;
    child(props: object): winston.Logger;
    debug(data: object, message?: string): void;
    info(data: object, message?: string): void;
    warn(data: object, message?: string): void;
    error(data: object | any, message?: string): void;
}
export {};

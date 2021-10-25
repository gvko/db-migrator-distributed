declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
/**
 * Creates and initializes the logger object.
 */
export default class Logger {
    private readonly logger;
    constructor();
    getLevel(): LogLevel;
    setLevel(): void;
    setName(): void;
    child(props: object): object;
    debug(data: object, message?: string): void;
    info(data: object, message?: string): void;
    warn(data: object, message?: string): void;
    error(data: object | any, message?: string): void;
}
export {};

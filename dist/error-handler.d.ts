declare class CustomError extends Error {
    readonly name: string;
    readonly code: number;
    readonly className: string;
    readonly data?: unknown;
    constructor(msg: string, name: string, code: number, className: string, data: any);
}
export declare class BadRequest extends CustomError {
    constructor(msg?: string, data?: any);
}
export declare class NotFound extends CustomError {
    constructor(msg?: string, data?: any);
}
export declare class MethodNotAllowed extends CustomError {
    constructor(msg?: string, data?: any);
}
export declare class Conflict extends CustomError {
    constructor(msg?: string, data?: any);
}
export declare class GeneralError extends CustomError {
    constructor(msg?: string, data?: any);
}
export declare class NotImplemented extends CustomError {
    constructor(msg?: string, data?: any);
}
export interface Errors {
    BadRequest: BadRequest;
    NotFound: NotFound;
    MethodNotAllowed: MethodNotAllowed;
    Conflict: Conflict;
    GeneralError: GeneralError;
    NotImplemented: NotImplemented;
    400: BadRequest;
    404: NotFound;
    405: MethodNotAllowed;
    409: Conflict;
    500: GeneralError;
    501: NotImplemented;
}
export {};

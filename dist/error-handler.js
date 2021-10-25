"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplemented = exports.GeneralError = exports.Conflict = exports.MethodNotAllowed = exports.NotFound = exports.BadRequest = void 0;
class CustomError extends Error {
    constructor(msg, name, code, className, data) {
        super(msg);
        this.name = name;
        this.code = code;
        this.className = className;
        this.data = data;
    }
}
class BadRequest extends CustomError {
    constructor(msg, data) {
        super(msg, 'BadRequest', 400, 'bad-request', data);
    }
}
exports.BadRequest = BadRequest;
class NotFound extends CustomError {
    constructor(msg, data) {
        super(msg, 'NotFound', 404, 'not-found', data);
    }
}
exports.NotFound = NotFound;
class MethodNotAllowed extends CustomError {
    constructor(msg, data) {
        super(msg, 'MethodNotAllowed', 405, 'method-not-allowed', data);
    }
}
exports.MethodNotAllowed = MethodNotAllowed;
class Conflict extends CustomError {
    constructor(msg, data) {
        super(msg, 'Conflict', 409, 'conflict', data);
    }
}
exports.Conflict = Conflict;
class GeneralError extends CustomError {
    constructor(msg, data) {
        super(msg, 'ServerError', 500, 'server-error', data);
    }
}
exports.GeneralError = GeneralError;
class NotImplemented extends CustomError {
    constructor(msg, data) {
        super(msg, 'NotImplemented', 501, 'not-implemented', data);
    }
}
exports.NotImplemented = NotImplemented;
//# sourceMappingURL=error-handler.js.map
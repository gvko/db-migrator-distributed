class CustomError extends Error {
  readonly name: string;
  readonly code: number;
  readonly className: string;
  readonly data?: unknown;

  constructor(msg: string, name: string, code: number, className: string, data: any) {
    super(msg);
    this.name = name;
    this.code = code;
    this.className = className;
    this.data = data;
  }
}

export class BadRequest extends CustomError {
  constructor(msg?: string, data?: any) {
    super(msg, 'BadRequest', 400, 'bad-request', data)
  }
}

export class NotFound extends CustomError {
  constructor(msg?: string, data?: any) {
    super(msg, 'NotFound', 404, 'not-found', data)
  }
}

export class MethodNotAllowed extends CustomError {
  constructor(msg?: string, data?: any) {
    super(msg, 'MethodNotAllowed', 405, 'method-not-allowed', data)
  }
}

export class Conflict extends CustomError {
  constructor(msg?: string, data?: any) {
    super(msg, 'Conflict', 409, 'conflict', data)
  }
}

export class GeneralError extends CustomError {
  constructor(msg?: string, data?: any) {
    super(msg, 'ServerError', 500, 'server-error', data)
  }
}

export class NotImplemented extends CustomError {
  constructor(msg?: string, data?: any) {
    super(msg, 'NotImplemented', 501, 'not-implemented', data)
  }
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

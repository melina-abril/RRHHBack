import type { ErrorRequestHandler, RequestHandler } from 'express';
import { logger } from 'firebase-functions';

/** Errores por campo: { campo: ['mensaje'] } (mismo formato que muestra el front en cada input). */
export type FieldErrors = Record<string, string[]>;

/** Error HTTP con código de negocio. errorHandler lo convierte en ProblemDetail. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly errors: FieldErrors = {},
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** 404: no existe el recurso pedido. */
export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, 'NOT_FOUND', message);
  }
}

/** 409: choca con otro dato (ej. código duplicado). Con field el front marca ese campo. */
export class ConflictError extends HttpError {
  constructor(message: string, field?: string) {
    super(409, 'CONFLICT', message, field ? { [field]: [message] } : {});
  }
}

/** 422: regla de negocio. code en MAYÚSCULAS y estable (ej. 'LEAVE_ALREADY_APPROVED'): el front decide por él. */
export class BusinessRuleError extends HttpError {
  constructor(code: string, message: string) {
    super(422, code, message);
  }
}

/** 400: datos inválidos, con el detalle por campo (lo lanza BodyReader.done()). */
export class ValidationError extends HttpError {
  constructor(errors: FieldErrors) {
    super(400, 'VALIDATION_ERROR', 'Revisa los datos ingresados.', errors);
  }
}

/** 401: sin sesión o con un token vencido. */
export class UnauthorizedError extends HttpError {
  constructor(code = 'UNAUTHORIZED', message = 'Tu sesión venció. Vuelve a iniciar sesión.') {
    super(401, code, message);
  }
}

/** 403: con sesión, pero sin el rol que pide la acción. */
export class ForbiddenError extends HttpError {
  constructor(code = 'FORBIDDEN', message = 'No tienes permiso para esta acción.') {
    super(403, code, message);
  }
}

const TITLES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Content',
  500: 'Internal Server Error',
};

/** Cuerpo de error (RFC 9457): { title, status, detail, code, errors? }. */
function problem(status: number, code: string, detail: string, errors: FieldErrors = {}) {
  return {
    title: TITLES[status] ?? 'Error',
    status,
    detail,
    code,
    ...(Object.keys(errors).length ? { errors } : {}),
  };
}

/** Ruta que no existe bajo /api. Va después de todos los routers. */
export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(problem(404, 'ROUTE_NOT_FOUND', 'El recurso pedido no existe.'));
};

/** Último middleware: todo error lanzado (también en handlers async: Express 5 los captura) termina acá. */
export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json(problem(error.status, error.code, error.message, error.errors));
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json(problem(400, 'INVALID_BODY', 'El cuerpo de la solicitud no es válido.'));
    return;
  }
  logger.error('Error inesperado', { method: req.method, path: req.originalUrl, error });
  res.status(500).json(problem(500, 'INTERNAL_ERROR', 'Ocurrió un error inesperado. Intenta de nuevo.'));
};

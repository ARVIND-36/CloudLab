import { ApiError } from '../utils/apiError.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(new ApiError(400, 'Validation failed', result.error.flatten()));
      return;
    }

    req[source] = result.data;
    next();
  };
}
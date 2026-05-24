import { ApiError } from '../utils/apiError.js';
import { verifyAuthToken } from '../services/jwtService.js';

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next(new ApiError(401, 'Missing authorization token'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAuthToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/apiError.js';
import { createUser, findUserByEmail, findUserById } from '../models/userModel.js';
import { signAuthToken } from './jwtService.js';

export async function registerUser({ name, email, password }) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, passwordHash });
  const token = signAuthToken(user);

  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };

  return {
    user: safeUser,
    token: signAuthToken(safeUser),
  };
}

export async function getProfile(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}
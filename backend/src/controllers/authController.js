import { asyncHandler } from '../utils/asyncHandler.js';
import { loginUser, registerUser, getProfile } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  res.status(201).json({
    status: 'created',
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  res.json({
    status: 'ok',
    token,
    user,
  });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);

  res.json({
    status: 'ok',
    user,
  });
});
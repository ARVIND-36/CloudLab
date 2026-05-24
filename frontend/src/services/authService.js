import { apiRequest } from './api.js';

export function registerUser(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function fetchProfile(token) {
  return apiRequest('/api/auth/profile', {
    token,
  });
}
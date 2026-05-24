const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export function getStoredAuth() {
  try {
    const token = window.localStorage.getItem('cloudlab_token');
    const userJson = window.localStorage.getItem('cloudlab_user');
    const user = userJson ? JSON.parse(userJson) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function setStoredAuth(token, user) {
  window.localStorage.setItem('cloudlab_token', token);
  window.localStorage.setItem('cloudlab_user', JSON.stringify(user));
}

export function clearStoredAuth() {
  window.localStorage.removeItem('cloudlab_token');
  window.localStorage.removeItem('cloudlab_user');
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error ?? 'Request failed');
  }

  return data;
}
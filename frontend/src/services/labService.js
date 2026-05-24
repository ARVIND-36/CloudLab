import { apiRequest } from './api.js';

export function createLab(token, labType) {
  return apiRequest('/api/labs/create', {
    method: 'POST',
    token,
    body: { labType },
  });
}

export function getLabs(token) {
  return apiRequest('/api/labs', {
    token,
  });
}

export function deleteLab(token, labId) {
  return apiRequest(`/api/labs/${labId}`, {
    method: 'DELETE',
    token,
  });
}
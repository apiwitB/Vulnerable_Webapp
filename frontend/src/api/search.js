import { request } from './client';

export async function searchItems(q) {
  // [VULN] Send raw query directly to GET /api/search?q=... (SQLi trigger)
  return request(`/api/search/?q=${encodeURIComponent(q)}`, {
    method: 'GET',
  });
}

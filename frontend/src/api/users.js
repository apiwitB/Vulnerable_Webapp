import { request } from './client';

export async function getUser(id) {
  return request(`/api/users/${id}`, {
    method: 'GET',
  });
}

export async function updateUser(id, data) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    body: data,
  });
}

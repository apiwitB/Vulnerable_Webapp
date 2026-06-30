import { request } from './client';

export async function getPosts(skip = 0, limit = 100) {
  return request(`/api/posts/?skip=${skip}&limit=${limit}`, {
    method: 'GET',
  });
}

export async function getPost(id) {
  return request(`/api/posts/${id}`, {
    method: 'GET',
  });
}

export async function createPost(data) {
  return request('/api/posts/', {
    method: 'POST',
    body: data,
  });
}

export async function deletePost(id) {
  return request(`/api/posts/${id}`, {
    method: 'DELETE',
  });
}

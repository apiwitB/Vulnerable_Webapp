import { request } from './client';

export async function getProducts(skip = 0, limit = 100) {
  return request(`/api/products/?skip=${skip}&limit=${limit}`, {
    method: 'GET',
  });
}

export async function getProduct(id) {
  return request(`/api/products/${id}`, {
    method: 'GET',
  });
}

export async function createProduct(data) {
  return request('/api/products/', {
    method: 'POST',
    body: data,
  });
}

export async function updateProduct(id, data) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteProduct(id) {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

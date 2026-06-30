import { request } from './client';

export async function getAdminUsers() {
  return request('/api/admin/users', {
    method: 'GET',
  });
}

export async function updateUserRole(userId, role) {
  return request(`/api/admin/users/${userId}/role?role=${encodeURIComponent(role)}`, {
    method: 'PUT',
  });
}

export async function getAdminOrders() {
  return request('/api/admin/orders', {
    method: 'GET',
  });
}

export async function deleteProductAdmin(productId) {
  return request(`/api/admin/products/${productId}`, {
    method: 'DELETE',
  });
}

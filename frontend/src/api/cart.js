import { request } from './client';

export async function getCart() {
  return request('/api/cart/', {
    method: 'GET',
  });
}

export async function addToCart(productId, quantity = 1) {
  return request('/api/cart/', {
    method: 'POST',
    body: { product_id: productId, quantity },
  });
}

export async function updateCart(itemId, quantity) {
  // [VULN] IDOR: Put requests targeting arbitrary item IDs
  return request(`/api/cart/${itemId}`, {
    method: 'PUT',
    body: { quantity },
  });
}

export async function removeFromCart(itemId) {
  // [VULN] IDOR: Delete requests targeting arbitrary item IDs
  return request(`/api/cart/${itemId}`, {
    method: 'DELETE',
  });
}

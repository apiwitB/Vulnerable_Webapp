import { request } from './client';

export async function getOrders() {
  return request('/api/orders/', {
    method: 'GET',
  });
}

export async function getOrder(id) {
  // [VULN] IDOR: Getting arbitrary order detail by id
  return request(`/api/orders/${id}`, {
    method: 'GET',
  });
}

export async function createOrder() {
  return request('/api/orders/', {
    method: 'POST',
  });
}

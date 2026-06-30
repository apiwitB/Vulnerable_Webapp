import { request } from './client';

export async function login(username, password) {
  // Backend auth/login uses OAuth2PasswordRequestForm (form-urlencoded)
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  return request('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
}

export async function register(username, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { username, email, password },
  });
}

import { request } from './client';

export async function uploadAvatar(file) {
  // Uses FormData for file uploads
  const formData = new FormData();
  formData.append('file', file);

  return request('/api/upload/avatar', {
    method: 'POST',
    body: formData,
  });
}

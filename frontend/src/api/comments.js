import { request } from './client';

export async function createComment(postId, content) {
  // [VULN] CSRF / XSS: Accepting raw HTML content without frontend filtration
  return request('/api/comments/', {
    method: 'POST',
    body: { post_id: postId, content },
  });
}

export async function deleteComment(id) {
  return request(`/api/comments/${id}`, {
    method: 'DELETE',
  });
}

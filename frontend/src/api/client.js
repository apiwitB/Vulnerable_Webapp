const BASE_URL = 'http://localhost:8000';

/**
 * Custom fetch wrapper for shadowMarketplace API
 * @param {string} endpoint - API path (e.g., '/api/products')
 * @param {object} options - Fetch options (method, body, headers)
 */
export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  // Set Authorization header if token exists in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set Content-Type: application/json if body is not FormData or URLSearchParams
  if (options.body && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // [VULN] Error Boundary / Leakage: Pass raw error stack trace or response from server straight to UI
  if (!response.ok) {
    let errorDetail;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.detail) {
        errorDetail = typeof errorJson.detail === 'object'
          ? JSON.stringify(errorJson.detail)
          : errorJson.detail;
      } else {
        errorDetail = response.statusText;
      }
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail);
  }

  // Return json or empty if no content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

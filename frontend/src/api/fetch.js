import { request } from './client';

export async function fetchUrl(url) {
  // [VULN] SSRF trigger: directly sends user input url to the backend fetch endpoint
  return request('/api/fetch/', {
    method: 'POST',
    body: { url },
  });
}

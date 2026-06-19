import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_API_KEY ? { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY } : {}),
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // data may be a raw string (when transformResponse bypasses JSON parse)
      let parsed = error.response.data;
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch { /* keep as string */ }
      }
      const message =
        (typeof parsed === 'object' && parsed !== null ? parsed.error : null) ||
        (typeof parsed === 'string' ? parsed : null) ||
        'An error occurred';
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error('Network error — make sure the backend server is running on port 5000'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;

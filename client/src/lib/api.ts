// API base URL - uses environment variable in production, relative path in development
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper function to make API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
}

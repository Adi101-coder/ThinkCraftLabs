// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper function for API calls
export async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
}

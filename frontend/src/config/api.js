/**
 * API Configuration
 * Handles API base URLs for different services
 */

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If we're accessing via port 3000 (direct frontend container), use direct service ports
  if (window.location.port === '3000') {
    return `http://${window.location.hostname}:8001`;
  }
  
  // If we're accessing via nginx (port 80 or domain), use /api prefix
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Hugo Engine endpoints
  HUGO_ASSESS: `${API_BASE_URL}/api/hugo/assess`,
  HUGO_PROFILE: `${API_BASE_URL}/api/hugo/profile`,
  
  // Assessment endpoints
  ASSESSMENTS: `${API_BASE_URL}/api/assessments`,
  
  // Team endpoints
  TEAMS: `${API_BASE_URL}/api/teams`,
  
  // Chat Assessment endpoints
  CHAT_ASSESSMENT: `${API_BASE_URL}/api/chat-assessment`
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('hugo_token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  return response;
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiCall
};

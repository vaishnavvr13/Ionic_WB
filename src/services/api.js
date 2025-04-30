const API_URL = 'http://localhost:5000/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const register = async (userData) => {
  try {
    console.log('Sending registration request to:', `${API_URL}/auth/register`);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    console.log('Sending login request to:', `${API_URL}/auth/login`);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

// Test endpoint
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test`, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Connection test error:', error);
    throw new Error('Could not connect to server');
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test login
async function testLogin() {
  try {
    // First get CSRF token
    console.log('Getting CSRF token...');
    const csrfResponse = await api.get('/auth/csrf/');
    console.log('CSRF Response:', csrfResponse.data);
    
    const token = csrfResponse.data.csrfToken;
    api.defaults.headers.common['X-CSRFToken'] = token;
    
    // Now login
    console.log('\nAttempting login with admin/admin123...');
    const loginResponse = await api.post('/auth/login/', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login Response:', loginResponse.data);
    console.log('Response Structure:', {
      hasUser: !!loginResponse.data.user,
      user: loginResponse.data.user,
      message: loginResponse.data.message
    });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testLogin();

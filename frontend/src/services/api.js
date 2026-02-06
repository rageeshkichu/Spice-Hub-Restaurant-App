import axios from 'axios';

// API URL is configured via VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach CSRF token to mutating requests
api.interceptors.request.use((config) => {
  const method = config.method && config.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    let token = getCookie('csrftoken');
    if (!token && window.localStorage) {
      token = window.localStorage.getItem('csrftoken');
    }
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
  }
  config.withCredentials = true;
  return config;
});

// Get CSRF token and store in cookie/localStorage
export const getCSRFToken = async () => {
  try {
    const response = await api.get('/auth/csrf/');
    const token = response.data.csrfToken;
    if (window.localStorage) {
      window.localStorage.setItem('csrftoken', token);
    }
    return token;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
  }
};


// Categories
export const getCategories = () => api.get('/categories/');
export const getCategory = (slug) => api.get(`/categories/${slug}/`);

// Menu Items
export const getMenuItems = (params) => api.get('/menu-items/', { params });
export const getMenuItem = (slug) => api.get(`/menu-items/${slug}/`);

// Orders
export const createOrder = (orderData) => api.post('/orders/', orderData);
export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);

// Reservations
export const createReservation = (reservationData) => api.post('/reservations/', reservationData);
export const getReservations = () => api.get('/reservations/');

// Feedback
export const createFeedback = (feedbackData) => api.post('/feedback/', feedbackData);
export const getFeedbacks = () => api.get('/feedback/');

// Contact
export const createContactMessage = (messageData) => api.post('/contact/', messageData);

// Blog
export const getBlogPosts = () => api.get('/blog/');
export const getBlogPost = (slug) => api.get(`/blog/${slug}/`);

// Restaurant Settings
export const getRestaurantInfo = () => api.get('/settings/info/');

// Auth
export const registerUser = (userData) => api.post('/auth/register/', userData);
export const loginUser = (credentials) => api.post('/auth/login/', credentials);
export const logoutUser = () => api.post('/auth/logout/');
export const getCurrentUser = () => api.get('/auth/user/');

export default api;

import api from './api';

// ============================================================================
// ADMIN DASHBOARD ENDPOINTS
// ============================================================================

export const getDashboardStats = () => api.get('/admin/dashboard-stats/');
export const getSalesAnalytics = () => api.get('/admin/sales-analytics/');
export const getMenuStats = () => api.get('/admin/menu-stats/');
export const getSystemInfo = () => api.get('/admin/system-info/');

// ============================================================================
// ORDERS - ADMIN
// ============================================================================

export const getAllOrders = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.order_type) params.append('order_type', filters.order_type);
  if (filters.from_date) params.append('from_date', filters.from_date);
  if (filters.to_date) params.append('to_date', filters.to_date);
  
  const queryString = params.toString();
  const url = queryString ? `/admin/orders/?${queryString}` : '/admin/orders/';
  return api.get(url);
};

export const getRecentOrders = () => api.get('/admin/recent-orders/');
export const getOrderDetails = (id) => api.get(`/admin/orders/${id}/`);
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/update_status/`, { status });

// ============================================================================
// RESERVATIONS - ADMIN
// ============================================================================

export const getAllReservations = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.date) params.append('date', filters.date);
  
  const queryString = params.toString();
  const url = queryString ? `/admin/reservations/?${queryString}` : '/admin/reservations/';
  return api.get(url);
};

export const getRecentReservations = () => api.get('/admin/recent-reservations/');
export const getReservationDetails = (id) => api.get(`/admin/reservations/${id}/`);
export const updateReservationStatus = (id, status) => api.patch(`/admin/reservations/${id}/update_status/`, { status });

// ============================================================================
// FEEDBACK - ADMIN
// ============================================================================

export const getAllFeedback = (published = null) => {
  const url = published !== null ? `/admin/feedback/?published=${published}` : '/admin/feedback/';
  return api.get(url);
};

export const publishFeedback = (id, isPublished) => api.patch(`/admin/feedback/${id}/publish/`, { is_published: isPublished });

// ============================================================================
// CONTACT MESSAGES - ADMIN
// ============================================================================

export const getContactMessages = () => api.get('/admin/contact-messages/');

// ============================================================================
// BLOG POSTS - ADMIN
// ============================================================================

export const getBlogPosts = (published = null) => {
  const url = published !== null ? `/admin/blog/?published=${published}` : '/admin/blog/';
  return api.get(url);
};

export const createBlogPost = (data) => api.post('/admin/blog/', data);
export const updateBlogPost = (id, data) => api.put(`/admin/blog/${id}/`, data);
export const deleteBlogPost = (id) => api.delete(`/admin/blog/${id}/`);

// ============================================================================
// MENU - ADMIN
// ============================================================================

// Categories (admin-only CRUD)
export const getCategories = () => api.get('/categories/');
export const createCategory = (data) => api.post('/admin/categories/', data);
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}/`, data);
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}/`);

// Menu Items (admin-only CRUD)
export const getMenuItems = () => api.get('/menu-items/');
export const createMenuItem = (data) => api.post('/admin/menu-items/', data);
export const updateMenuItem = (id, data) => api.put(`/admin/menu-items/${id}/`, data);
export const deleteMenuItem = (id) => api.delete(`/admin/menu-items/${id}/`);

// Bulk Update Menu Items
export const bulkUpdateMenuItems = (items) => api.post('/admin/bulk-update-items/', { items });

// ============================================================================
// SETTINGS - ADMIN
// ============================================================================

export const getRestaurantSettings = () => api.get('/admin/settings/');
export const updateRestaurantSettings = (data) => api.put('/admin/settings/', data);

// Opening Hours (admin-only CRUD)
export const getOpeningHours = () => api.get('/admin/opening-hours/');
export const addOpeningHours = (data) => api.post('/admin/opening-hours-crud/', data);
export const updateOpeningHours = (id, data) => api.put(`/admin/opening-hours-crud/${id}/`, data);
export const deleteOpeningHours = (id) => api.delete(`/admin/opening-hours-crud/${id}/`);

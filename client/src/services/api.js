const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const config = {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  };

  // If body is an object and not FormData, stringify it
  if (config.body && !(config.body instanceof FormData) && typeof config.body === 'object') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  getCurrentUser: () => request('/auth/current-user'),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  signup: (userData) => request('/auth/signup', { method: 'POST', body: userData }),
  verifySignupOtp: (email, otp) => request('/auth/verify-signup-otp', { method: 'POST', body: { email, otp } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  sendLoginOtp: (email) => request('/auth/login-with-otp', { method: 'POST', body: { email } }),
  verifyLoginOtp: (email, otp) => request('/auth/verify-login-otp', { method: 'POST', body: { email, otp } }),
  sendForgotPasswordOtp: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  verifyResetOtp: (email, otp) => request('/auth/verify-reset-otp', { method: 'POST', body: { email, otp } }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload }),
  resendOtp: (email, purpose) => request('/auth/resend-otp', { method: 'POST', body: { email, purpose } }),

  // Listings
  getListings: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return request(`/listings${qs ? `?${qs}` : ''}`);
  },
  getListingById: (id) => request(`/listings/${id}`),
  createListing: (formData) => request('/listings', { method: 'POST', body: formData }),
  updateListing: (id, formData) => request(`/listings/${id}`, { method: 'PUT', body: formData }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE' }),

  // Reviews
  addReview: (listingId, reviewData) => request(`/listings/${listingId}/reviews`, { method: 'POST', body: reviewData }),
  deleteReview: (listingId, reviewId) => request(`/listings/${listingId}/reviews/${reviewId}`, { method: 'DELETE' }),

  // Users & Favorites
  getProfile: () => request('/users/profile'),
  updateProfile: (formData) => request('/users/profile', { method: 'PUT', body: formData }),
  toggleFavorite: (listingId) => request(`/users/toggle-favorite/${listingId}`, { method: 'POST' }),
  getFavorites: () => request('/users/favorites'),

  // Chats
  getChats: () => request('/chats'),
  saveChat: (threadData) => request('/chats', { method: 'POST', body: threadData }),
  sendChatMessage: (threadId, payload) => request(`/chats/${threadId}/message`, { method: 'POST', body: payload }),
  markChatRead: (threadId, payload) => request(`/chats/${threadId}/read`, { method: 'POST', body: payload }),
  deleteChat: (threadId) => request(`/chats/${threadId}`, { method: 'DELETE' }),

  // Visits
  getVisits: () => request('/visits'),
  createVisit: (visitData) => request('/visits', { method: 'POST', body: visitData }),
  updateVisitStatus: (visitId, payload) => request(`/visits/${visitId}/status`, { method: 'PATCH', body: payload }),
};

export { API_BASE, request };
export default api;

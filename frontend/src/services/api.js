import axios from 'axios';

// Remove baseURL since we're using Vite proxy
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// axios.defaults.baseURL = API_URL;

export const workersAPI = {
  getAll: (params = {}) => axios.get('/api/workers', { params }),
  getById: (id) => axios.get(`/api/workers/${id}`),
  getSkills: () => axios.get('/api/workers/skills'),
  updateProfile: (data) => axios.put('/api/workers/profile', data),
  getBookings: (params = {}) => axios.get('/api/workers/bookings', { params }),
  updateBookingStatus: (id, status) => axios.put(`/api/workers/bookings/${id}/status`, { status }),
};

export const usersAPI = {
  getProfile: () => axios.get('/api/users/profile'),
  updateProfile: (data) => axios.put('/api/users/profile', data),
};

export const bookingsAPI = {
  create: (data) => axios.post('/api/bookings', data),
  getAll: (params = {}) => axios.get('/api/bookings', { params }),
  getById: (id) => axios.get(`/api/bookings/${id}`),
  cancel: (id) => axios.put(`/api/bookings/${id}/cancel`),
  rate: (id, data) => axios.put(`/api/bookings/${id}/rate`, data),
};

export const paymentsAPI = {
  createCheckoutSession: (bookingId) => axios.post('/api/payments/create-checkout-session', { bookingId }),
  handlePaymentSuccess: (sessionId, bookingId) => axios.post('/api/payments/success', { sessionId, bookingId }),
  getPaymentStatus: (bookingId) => axios.get(`/api/payments/status/${bookingId}`)
};

export const authAPI = {
  login: (data) => axios.post('/api/auth/login', data),
  registerUser: (data) => axios.post('/api/auth/register-user', data),
  registerWorker: (data) => axios.post('/api/auth/register-worker', data),
  getProfile: () => axios.get('/api/auth/profile'),
}; 
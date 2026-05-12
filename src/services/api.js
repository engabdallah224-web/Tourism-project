
import axios from 'axios';

// Point to your Firebase backend
const BASE = 'http://localhost:5050/api';
const api = axios.create({ baseURL: BASE });


// Image Upload
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// Packages (Firebase)
export const getPackages = () => api.get('/packages');
export const createPackage = (data) => api.post('/packages', data);
export const getPackage = (id) => api.get(`/packages/${id}`);
export const updatePackage = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/packages/${id}`);

// Bookings (Firebase)
export const createBooking  = (data) => api.post('/bookings', data);
export const getBookings    = ()     => api.get('/bookings');
export const getUserBookings= (email) => api.get(`/bookings/user/${email}`);
export const confirmBooking = (id)   => api.put(`/bookings/${id}/confirm`);
export const cancelBooking  = (id, type) => api.put(`/bookings/${id}/cancel?type=${type}`);
export const updateBooking  = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking  = (id)   => api.delete(`/bookings/${id}`);

// Admin & Dashboard
export const getDashboard = () => api.get('/admin/dashboard');
export const getUserDashboard = (email) => api.get(`/user/dashboard/${email}`);
export const changeAdminPassword = (data) => api.put('/admin/change-password', data);

// Enquiries (Admin)
export const getEnquiries = () => api.get('/enquiries');
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);
export const replyEnquiry = (id, reply) => api.put(`/enquiries/${id}/reply`, { reply });
export const updateEnquiry = (id, data) => api.put(`/enquiries/${id}`, data);

// Users (Admin)
export const getUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Auth (Firebase, stub)
export const loginUser = (data) => api.post('/login', data);
export const registerUser = (data) => api.post('/register', data);
export const loginAdmin = (data) => api.post('/admin/login', data);

// Profile & Account
export const getProfile = (email) => api.get(`/profile/${email}`);
export const updateProfile = (email, data) => api.put(`/profile/${email}`, data);
export const changePassword = (data) => api.put('/change-password', data);

// Feedback & Enquiry
export const sendEnquiry = (data) => api.post('/enquiry', data);

// Support Issues
export const getIssues = () => api.get('/issues');
export const createIssue = (data) => api.post('/issues', data);
export const updateIssue = (id, data) => api.put(`/issues/${id}`, data);
export const deleteIssue = (id) => api.delete(`/issues/${id}`);

export default api;

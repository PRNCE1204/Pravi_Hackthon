import api from './api';

export const authService = {
  // Citizen Registration
  register: async ({ name, email, password }) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // User Login
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get Current Authenticated Profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Fetch Pre-seeded Demo Users List for Hackathon Judges
  getDemoUsers: async () => {
    const response = await api.get('/auth/demo-users');
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  },
};

export default authService;

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me')
};

// Tickets API (public)
export const ticketsAPI = {
    create: (ticketData) => api.post('/tickets', ticketData),
    getByEmail: (email) => api.get(`/tickets/customer/${email}`),
    getAll: (params) => api.get('/tickets', { params }),
    getById: (id) => api.get(`/tickets/${id}`),
    update: (id, data) => api.patch(`/tickets/${id}`),
    addComment: (id, comment) => api.post(`/tickets/${id}/comments`, comment),
    reclassify: (id) => api.post(`/tickets/${id}/reclassify`)
};

// Admin API
export const adminAPI = {
    getMetrics: () => api.get('/admin/metrics'),
    getQueues: () => api.get('/admin/queues'),
    getAgents: () => api.get('/admin/agents'),
    assignTickets: (ticketIds, agentId) => api.post('/admin/assign', { ticketIds, agentId }),
    transferTickets: (ticketIds, queue) => api.post('/admin/transfer', { ticketIds, queue })
};

export default api;

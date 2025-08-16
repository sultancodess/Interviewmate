import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    // Handle network errors
    if (!response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject(new Error('Network error'))
    }

    // Handle different HTTP status codes
    switch (response.status) {
      case 400:
        toast.error(response.data?.message || 'Bad request')
        break
      case 401:
        toast.error('Session expired. Please login again.')
        localStorage.removeItem('token')
        window.location.href = '/login'
        break
      case 403:
        toast.error('Access denied')
        break
      case 404:
        toast.error('Resource not found')
        break
      case 429:
        toast.error('Too many requests. Please try again later.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        toast.error(response.data?.message || 'Something went wrong')
    }

    return Promise.reject(error)
  }
)

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    googleLogin: (credential) => api.post('/auth/google', { credential }),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
    resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
  },

  // User endpoints
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    updatePreferences: (data) => api.put('/user/preferences', data),
    getSubscription: () => api.get('/user/subscription'),
    updateSubscription: (data) => api.put('/user/subscription', data),
    changePassword: (data) => api.put('/user/password', data),
    deleteAccount: (password) => api.delete('/user/account', { data: { password } }),
    getStats: () => api.get('/user/stats'),
  },

  // Interview endpoints
  interview: {
    create: (data) => api.post('/interview/create', data),
    getById: (id) => api.get(`/interview/${id}`),
    update: (id, data) => api.put(`/interview/${id}`, data),
    evaluate: (id, transcript) => api.post(`/interview/${id}/evaluate`, { transcript }),
    getHistory: (params = {}) => api.get('/interview/history', { params }),
    delete: (id) => api.delete(`/interview/${id}`),
    getAnalytics: () => api.get('/interview/analytics'),
    generateQuestions: (data) => api.post('/interview/generate-questions', data),
    generateFollowup: (data) => api.post('/interview/generate-followup', data),
    testGemini: () => api.get('/interview/test-gemini'),
  },

  // Payment endpoints
  payment: {
    createOrder: (data) => api.post('/payment/create-order', data),
    verifyPayment: (data) => api.post('/payment/verify', data),
    getHistory: () => api.get('/payment/history'),
    cancelSubscription: () => api.post('/payment/cancel-subscription'),
  },
}

// Utility functions for handling API responses
export const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall()
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Something went wrong',
    }
  }
}

// Retry mechanism for failed requests
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

export default api
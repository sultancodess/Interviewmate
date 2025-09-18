import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService, handleApiResponse } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => {
    // Safely get token from localStorage
    try {
      return localStorage.getItem('token')
    } catch (error) {
      console.error('Failed to read token from localStorage:', error)
      return null
    }
  })
  const [authChecked, setAuthChecked] = useState(false)

  // Check if user is authenticated on app load
  useEffect(() => {
    let isMounted = true // Prevent state updates if component unmounts

    const checkAuth = async () => {
      if (!token) {
        setLoading(false)
        setAuthChecked(true)
        return
      }

      try {
        const result = await handleApiResponse(() => apiService.auth.getMe())
        
        if (!isMounted) return // Component unmounted, don't update state
        
        if (result.success) {
          setUser(result.data.user)
        } else {
          console.error('Auth check failed:', result.error)
          // Only logout if it's an auth error, not a network error
          if (result.error?.includes('401') || result.error?.includes('unauthorized')) {
            logout()
          }
        }
      } catch (error) {
        if (!isMounted) return
        
        console.error('Auth check failed:', error)
        // Only logout on auth errors, not network errors
        if (error.response?.status === 401) {
          logout()
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setAuthChecked(true)
        }
      }
    }

    checkAuth()

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false
    }
  }, [token]) // Only depend on token, not the logout function

  const login = async (email, password) => {
    try {
      const result = await handleApiResponse(() => apiService.auth.login({ email, password }))
      
      if (result.success) {
        const { token: newToken, user: userData } = result.data
        
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        
        toast.success('Welcome back!')
        return { success: true }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Login failed'
      return { success: false, message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const result = await handleApiResponse(() => apiService.auth.register({ name, email, password }))
      
      if (result.success) {
        const { token: newToken, user: userData } = result.data
        
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        
        toast.success('Account created successfully!')
        return { success: true }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Registration failed'
      return { success: false, message }
    }
  }

  const googleLogin = async (credential) => {
    try {
      const result = await handleApiResponse(() => apiService.auth.googleLogin(credential))
      
      if (result.success) {
        const { token: newToken, user: userData } = result.data
        
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        
        toast.success('Welcome!')
        return { success: true }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Google login failed'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await handleApiResponse(() => apiService.auth.logout())
    } catch (error) {
      // Continue with logout even if server call fails
      console.error('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const updateProfile = async (profileData) => {
    try {
      const result = await handleApiResponse(() => apiService.user.updateProfile(profileData))
      
      if (result.success) {
        setUser(result.data.user)
        return { success: true, user: result.data.user }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update profile' }
    }
  }

  const updateSubscription = async (subscriptionData) => {
    try {
      const result = await handleApiResponse(() => apiService.user.updateSubscription(subscriptionData))
      
      if (result.success) {
        setUser(prev => ({
          ...prev,
          subscription: result.data.subscription
        }))
        return { success: true, subscription: result.data.subscription }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update subscription' }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    updateProfile,
    updateSubscription,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
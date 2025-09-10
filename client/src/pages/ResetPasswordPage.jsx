import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
import { Loader } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { AlertCircle } from 'lucide-react'
import { apiService, handleApiResponse } from '../services/api'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  useEffect(() => {
    // Validate token format
    if (!token || token.length < 32) {
      setTokenValid(false)
    }
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.password.trim()) {
      toast.error('Password is required')
      return false
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const result = await handleApiResponse(() => 
        apiService.auth.resetPassword(token, formData.password)
      )
      
      if (result.success) {
        setSuccess(true)
        toast.success('Password reset successful!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Password reset successful. Please sign in with your new password.' }
          })
        }, 3000)
      } else {
        if (result.error.includes('Invalid') || result.error.includes('expired')) {
          setTokenValid(false)
        }
        toast.error(result.error || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'text-red-500' }
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'text-yellow-500' }
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: 'Strong', color: 'text-green-500' }
    }
    return { strength: 2, label: 'Fair', color: 'text-yellow-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  // Invalid token UI
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex justify-center mb-6">
              <Logo size="lg" showText={true} />
            </Link>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600">This password reset link is invalid or has expired.</p>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Password reset links expire after 1 hour for security reasons.
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/forgot-password"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Request New Reset Link
                </Link>
                
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success UI
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex justify-center mb-6">
              <Logo size="lg" showText={true} />
            </Link>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-gray-600">Your password has been successfully updated.</p>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                You can now sign in with your new password.
              </p>
              
              <p className="text-sm text-gray-500">
                Redirecting to sign in page in 3 seconds...
              </p>
              
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Reset form UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                          passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                          passwordStrength.strength === 3 ? 'bg-green-500 w-full' : 'w-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-1 flex items-center">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Passwords match</span>
                    </div>
                  ) : (
                    <span className="text-xs text-red-600">Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Reset password'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back to login */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
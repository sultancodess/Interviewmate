import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { Mail } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { Loader } from 'lucide-react'
import { apiService, handleApiResponse } from '../services/api'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      const result = await handleApiResponse(() => apiService.auth.forgotPassword(email))
      
      if (result.success) {
        setEmailSent(true)
        toast.success('Password reset email sent!')
      } else {
        toast.error(result.error || 'Failed to send reset email')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-600">We've sent a password reset link to</p>
              <p className="text-blue-600 font-medium">{email}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                </div>
                <p className="text-gray-700">Check your email inbox (and spam folder)</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                </div>
                <p className="text-gray-700">Click the "Reset Password" button in the email</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                </div>
                <p className="text-gray-700">Create a new password for your account</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> The reset link will expire in 1 hour for security reasons.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Send another email
              </button>
              
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
          <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
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
                  'Send reset link'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back to login */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
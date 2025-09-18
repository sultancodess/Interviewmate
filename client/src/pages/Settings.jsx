import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  User,
  Mail,
  Phone,
  Camera,
  Moon,
  Sun,
  Bell,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Upload,
  X,
  Check,
  AlertTriangle,
  Download,
  FileText,
  Globe,
  Lock,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  })
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    interviews: true,
    reports: true,
    marketing: false
  })
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showEmail: false,
    allowAnalytics: true
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    toast.success(`Switched to ${newTheme} mode`)
  }

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    toast.success('Notification preferences updated')
  }

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
    toast.success('Privacy settings updated')
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      // API call to delete account
      toast.success('Account deletion initiated. You will receive a confirmation email.')
      setShowDeleteConfirm(false)
    } catch (error) {
      toast.error('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      setLoading(true)
      // API call to export user data
      toast.success('Data export initiated. Download link will be sent to your email.')
    } catch (error) {
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'appearance', name: 'Appearance', icon: theme === 'dark' ? Moon : Sun },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'data', name: 'Data & Export', icon: Download },
    { id: 'account', name: 'Account', icon: Trash2 }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[600px]">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </button>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`p-4 border-2 rounded-lg transition-colors ${
                            theme === 'light'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Sun className="w-6 h-6 text-yellow-500" />
                            <div className="text-left">
                              <div className="font-medium">Light Mode</div>
                              <div className="text-sm text-gray-500">Clean and bright interface</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`p-4 border-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Moon className="w-6 h-6 text-blue-500" />
                            <div className="text-left">
                              <div className="font-medium">Dark Mode</div>
                              <div className="text-sm text-gray-500">Easy on the eyes</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                  <div className="space-y-6">
                    {Object.entries({
                      email: 'Email Notifications',
                      push: 'Push Notifications',
                      interviews: 'Interview Reminders',
                      reports: 'Report Updates',
                      marketing: 'Marketing Communications'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium text-gray-900">{label}</div>
                          <div className="text-sm text-gray-500">
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'push' && 'Receive push notifications in browser'}
                            {key === 'interviews' && 'Get reminded about upcoming interviews'}
                            {key === 'reports' && 'Get notified when reports are ready'}
                            {key === 'marketing' && 'Receive product updates and tips'}
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key, !notifications[key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[key] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                  <div className="space-y-6">
                    {Object.entries({
                      profilePublic: 'Public Profile',
                      showEmail: 'Show Email Address',
                      allowAnalytics: 'Allow Analytics'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium text-gray-900">{label}</div>
                          <div className="text-sm text-gray-500">
                            {key === 'profilePublic' && 'Make your profile visible to other users'}
                            {key === 'showEmail' && 'Display your email address on your profile'}
                            {key === 'allowAnalytics' && 'Help us improve by sharing usage data'}
                          </div>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange(key, !privacy[key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacy[key] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy[key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Export Tab */}
              {activeTab === 'data' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Export</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-blue-900">Export Your Data</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Download a copy of all your interview data, reports, and account information.
                          </p>
                          <button
                            onClick={handleExportData}
                            disabled={loading}
                            className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {loading ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium text-red-900">Delete Account</h3>
                          <p className="text-sm text-red-700 mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="mt-3 flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This will permanently remove all your data, including interviews, reports, and settings. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Settings
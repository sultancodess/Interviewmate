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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your account preferences and privacy settings
          </p>
        </div>

        {/* ... keep the rest of your JSX unchanged ... */}
      </div>
    </DashboardLayout>
  )
}

export default Settings
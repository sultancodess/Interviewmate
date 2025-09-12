import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../contexts/InterviewContext'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import FileUpload from '../components/FileUpload'
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Code,
  CheckCircle,
  Brain,
  Globe,
  Zap,
  CreditCard,
  Upload,
  FileText,
} from 'lucide-react'
import toast from 'react-hot-toast'

const InterviewSetup = () => {
  const navigate = useNavigate()
  const { createInterview, loading } = useInterview()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    candidateInfo: {
      name: user?.name || '',
      role: '',
      company: '',
      experience: 'fresher',
      resume: null,
      jobDescriptionFile: null,
    },
    type: 'hr',
    configuration: {
      duration: 15,
      difficulty: 'medium',
      interviewMode: 'webspeech',
      topics: [],
      customTopics: [],
      customQuestions: [],
      customQuestionsFile: null,
      jobDescription: '',
      language: 'en',
    },
  })

  const [customTopic, setCustomTopic] = useState('')
  const [customQuestion, setCustomQuestion] = useState('')

  const interviewTypes = [
    {
      id: 'hr',
      name: 'HR Interview',
      description: 'Behavioral questions, cultural fit, and soft skills assessment',
      icon: Users,
      color: 'bg-blue-500',
      topics: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Career Goals', 'Company Culture'],
    },
    {
      id: 'technical',
      name: 'Technical Interview',
      description: 'Technical knowledge, coding skills, and system design',
      icon: Code,
      color: 'bg-green-500',
      topics: ['Data Structures', 'Algorithms', 'System Design', 'Programming Languages', 'Databases', 'APIs'],
    },
  ]

  const experienceLevels = [
    { id: 'fresher', name: 'Fresher (0-1 years)', description: 'New to the industry' },
    { id: 'mid-level', name: 'Mid-level (2-5 years)', description: 'Some professional experience' },
    { id: 'senior', name: 'Senior (5+ years)', description: 'Experienced professional' },
  ]

  const difficultyLevels = [
    { id: 'easy', name: 'Easy', description: 'Basic questions, supportive approach', color: 'text-green-600' },
    { id: 'medium', name: 'Medium', description: 'Standard interview questions', color: 'text-yellow-600' },
    { id: 'hard', name: 'Hard', description: 'Challenging questions, detailed follow-ups', color: 'text-red-600' },
  ]

  const durationOptions = [
    { value: 5, label: '5 minutes', description: 'Quick practice' },
    { value: 10, label: '10 minutes', description: 'Short session' },
    { value: 15, label: '15 minutes', description: 'Standard practice' },
    { value: 30, label: '30 minutes', description: 'Full interview' },
  ]

  const interviewModes = [
    {
      id: 'webspeech',
      name: 'Web Speech API',
      description: 'Free, unlimited, browser-based voice interview',
      icon: Globe,
      badge: 'FREE',
      badgeColor: 'bg-green-100 text-green-800',
      features: ['Unlimited usage', 'No cost', 'Browser-based', 'Good quality'],
    },
    {
      id: 'vapi',
      name: 'VAPI AI',
      description: 'Premium, natural conversation with advanced AI',
      icon: Brain,
      badge: 'PREMIUM',
      badgeColor: 'bg-blue-100 text-blue-800',
      features: ['Natural conversation', 'Low latency', 'Advanced AI', 'Professional quality'],
    },
  ]

  const languageOptions = [
    { id: 'en', name: 'English', description: 'English (US)' },
    { id: 'hi', name: 'Hindi', description: 'हिन्दी' },
    { id: 'es', name: 'Spanish', description: 'Español' },
    { id: 'fr', name: 'French', description: 'Français' },
    { id: 'de', name: 'German', description: 'Deutsch' },
  ]

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Your details' },
    { id: 2, name: 'Interview Type', description: 'Choose type' },
    { id: 3, name: 'Customization', description: 'Configure settings' },
    { id: 4, name: 'Review', description: 'Final review' },
  ]

  /** ---- helpers ---- */

  const updateFormData = (section, field, value) => {
    setFormData(prev => {
      // handle top-level fields like `type`
      if (!section) {
        return { ...prev, [field]: value }
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }
    })
  }

  const _addCustomTopic = () => {
    if (customTopic.trim()) {
      updateFormData('configuration', 'customTopics', [
        ...formData.configuration.customTopics,
        customTopic.trim(),
      ])
      setCustomTopic('')
    }
  }
  const _removeCustomTopic = idx => {
    const updated = formData.configuration.customTopics.filter((_, i) => i !== idx)
    updateFormData('configuration', 'customTopics', updated)
  }

  const _addCustomQuestion = () => {
    if (customQuestion.trim()) {
      updateFormData('configuration', 'customQuestions', [
        ...formData.configuration.customQuestions,
        customQuestion.trim(),
      ])
      setCustomQuestion('')
    }
  }
  const _removeCustomQuestion = idx => {
    const updated = formData.configuration.customQuestions.filter((_, i) => i !== idx)
    updateFormData('configuration', 'customQuestions', updated)
  }

  const handleNext = () => setCurrentStep(s => Math.min(4, s + 1))
  const handlePrevious = () => setCurrentStep(s => Math.max(1, s - 1))

  const canUseVAPI = () => {
    const sub = user?.subscription
    if (!sub) return false
    if (sub.plan === 'free') {
      return sub.vapiMinutesRemaining >= formData.configuration.duration
    }
    if (sub.plan === 'pro') {
      return sub.payAsYouGoBalance >= formData.configuration.duration * 0.5
    }
    return false
  }

  const getVAPICost = () => {
    const sub = user?.subscription
    if (!sub) return ''
    if (sub.plan === 'free') {
      return `${formData.configuration.duration} minutes from your free quota`
    }
    return `$${(formData.configuration.duration * 0.5).toFixed(2)} from your balance`
  }

  const handleSubmit = async () => {
    try {
      const { candidateInfo, configuration } = formData
      if (!candidateInfo.name || !candidateInfo.role || !candidateInfo.company) {
        toast.error('Please fill in all required fields')
        setCurrentStep(1)
        return
      }

      if (configuration.interviewMode === 'vapi' && !canUseVAPI()) {
        toast.error('Insufficient VAPI minutes or balance.')
        return
      }

      const result = await createInterview(formData)
      if (result.success) {
        navigate(`/interview/live/${result.interview._id}`)
      } else {
        toast.error(result.message || 'Failed to create interview')
      }
    } catch (e) {
      toast.error('Failed to create interview')
    }
  }

  /** ---- render ---- */
  return (
    <DashboardLayout>
      {/* keep all JSX exactly as you had it; only logic changed */}
      {/* -------------- */}
      {/*  full JSX body is same as in your original message */}
      {/* -------------- */}
    </DashboardLayout>
  )
}

export default InterviewSetup

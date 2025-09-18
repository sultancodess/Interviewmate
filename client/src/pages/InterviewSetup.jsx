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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.candidateInfo.name}
                    onChange={(e) => updateFormData('candidateInfo', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    value={formData.candidateInfo.role}
                    onChange={(e) => updateFormData('candidateInfo', 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Backend Developer, Data Scientist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={formData.candidateInfo.company}
                    onChange={(e) => updateFormData('candidateInfo', 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Google, Microsoft, TCS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    value={formData.candidateInfo.experience}
                    onChange={(e) => updateFormData('candidateInfo', 'experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Uploads */}
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (Optional)
                  </label>
                  <FileUpload
                    accept=".pdf,.doc,.docx"
                    onFileSelect={(file) => updateFormData('candidateInfo', 'resume', file)}
                    maxSize={5 * 1024 * 1024} // 5MB
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <FileUpload
                    accept=".pdf,.doc,.docx,.txt"
                    onFileSelect={(file) => updateFormData('candidateInfo', 'jobDescriptionFile', file)}
                    maxSize={5 * 1024 * 1024} // 5MB
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interview Type */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Interview Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interviewTypes.map(type => (
                  <div
                    key={type.id}
                    onClick={() => updateFormData(null, 'type', type.id)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${type.color} text-white`}>
                        <type.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {type.topics.map(topic => (
                            <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Customization */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Configuration</h2>
              
              <div className="space-y-8">
                {/* Interview Mode Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Mode</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviewModes.map(mode => (
                      <div
                        key={mode.id}
                        onClick={() => updateFormData('configuration', 'interviewMode', mode.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.configuration.interviewMode === mode.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${mode.id === 'vapi' && !canUseVAPI() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <mode.icon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-900">{mode.name}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${mode.badgeColor}`}>
                            {mode.badge}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                        <ul className="space-y-1">
                          {mode.features.map(feature => (
                            <li key={feature} className="text-xs text-gray-500 flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {mode.id === 'vapi' && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                            {canUseVAPI() ? (
                              <span className="text-green-600">✓ Cost: {getVAPICost()}</span>
                            ) : (
                              <span className="text-red-600">⚠️ Insufficient balance</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Duration</label>
                    <div className="space-y-2">
                      {durationOptions.map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="duration"
                            value={option.value}
                            checked={formData.configuration.duration === option.value}
                            onChange={(e) => updateFormData('configuration', 'duration', parseInt(e.target.value))}
                            className="mr-3"
                          />
                          <div>
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-gray-500 ml-2">{option.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty</label>
                    <div className="space-y-2">
                      {difficultyLevels.map(level => (
                        <label key={level.id} className="flex items-center">
                          <input
                            type="radio"
                            name="difficulty"
                            value={level.id}
                            checked={formData.configuration.difficulty === level.id}
                            onChange={(e) => updateFormData('configuration', 'difficulty', e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <span className={`font-medium ${level.color}`}>{level.name}</span>
                            <span className="text-sm text-gray-500 ml-2">{level.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Topics */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Custom Topics (Optional)
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="e.g., React.js, System Design"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && _addCustomTopic()}
                    />
                    <button
                      type="button"
                      onClick={_addCustomTopic}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.configuration.customTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                      >
                        {topic}
                        <button
                          onClick={() => _removeCustomTopic(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Custom Questions (Optional)
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Enter a custom interview question"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && _addCustomQuestion()}
                    />
                    <button
                      type="button"
                      onClick={_addCustomQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.configuration.customQuestions.map((question, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg flex items-start justify-between"
                      >
                        <span className="text-sm">{question}</span>
                        <button
                          onClick={() => _removeCustomQuestion(index)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Start Interview</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Candidate:</span>
                    <span className="ml-2">{formData.candidateInfo.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="ml-2">{formData.candidateInfo.role}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Company:</span>
                    <span className="ml-2">{formData.candidateInfo.company}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Experience:</span>
                    <span className="ml-2 capitalize">{formData.candidateInfo.experience}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 capitalize">{formData.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Mode:</span>
                    <span className="ml-2 capitalize">{formData.configuration.interviewMode}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2">{formData.configuration.duration} minutes</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Difficulty:</span>
                    <span className="ml-2 capitalize">{formData.configuration.difficulty}</span>
                  </div>
                </div>

                {formData.configuration.customTopics.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Custom Topics:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.configuration.customTopics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.configuration.customQuestions.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Custom Questions:</span>
                    <ul className="mt-2 space-y-1">
                      {formData.configuration.customQuestions.map((question, index) => (
                        <li key={index} className="text-sm text-gray-600">• {question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {formData.configuration.interviewMode === 'vapi' && !canUseVAPI() && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Insufficient Balance</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    You need {getVAPICost()} to use VAPI mode. Please add funds or switch to Web Speech API.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || (formData.configuration.interviewMode === 'vapi' && !canUseVAPI())}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Creating Interview...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Start Interview</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewSetup

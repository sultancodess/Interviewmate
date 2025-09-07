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
  FileText
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
      jobDescriptionFile: null
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
      language: 'en'
    }
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
      topics: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Career Goals', 'Company Culture']
    },
    {
      id: 'technical',
      name: 'Technical Interview',
      description: 'Technical knowledge, coding skills, and system design',
      icon: Code,
      color: 'bg-green-500',
      topics: ['Data Structures', 'Algorithms', 'System Design', 'Programming Languages', 'Databases', 'APIs']
    }
  ]

  const experienceLevels = [
    { id: 'fresher', name: 'Fresher (0-1 years)', description: 'New to the industry' },
    { id: 'mid-level', name: 'Mid-level (2-5 years)', description: 'Some professional experience' },
    { id: 'senior', name: 'Senior (5+ years)', description: 'Experienced professional' }
  ]

  const difficultyLevels = [
    { id: 'easy', name: 'Easy', description: 'Basic questions, supportive approach', color: 'text-green-600' },
    { id: 'medium', name: 'Medium', description: 'Standard interview questions', color: 'text-yellow-600' },
    { id: 'hard', name: 'Hard', description: 'Challenging questions, detailed follow-ups', color: 'text-red-600' }
  ]

  const durationOptions = [
    { value: 5, label: '5 minutes', description: 'Quick practice' },
    { value: 10, label: '10 minutes', description: 'Short session' },
    { value: 15, label: '15 minutes', description: 'Standard practice' },
    { value: 30, label: '30 minutes', description: 'Full interview' }
  ]

  const interviewModes = [
    {
      id: 'webspeech',
      name: 'Web Speech API',
      description: 'Free, unlimited, browser-based voice interview',
      icon: Globe,
      badge: 'FREE',
      badgeColor: 'bg-green-100 text-green-800',
      features: ['Unlimited usage', 'No cost', 'Browser-based', 'Good quality']
    },
    {
      id: 'vapi',
      name: 'VAPI AI',
      description: 'Premium, natural conversation with advanced AI',
      icon: Brain,
      badge: 'PREMIUM',
      badgeColor: 'bg-blue-100 text-blue-800',
      features: ['Natural conversation', 'Low latency', 'Advanced AI', 'Professional quality']
    }
  ]

  const steps = [
    { id: 1, name: 'Basic Info', description: 'Your details' },
    { id: 2, name: 'Interview Type', description: 'Choose type' },
    { id: 3, name: 'Customization', description: 'Configure settings' },
    { id: 4, name: 'Review', description: 'Final review' }
  ]

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const _addCustomTopic = () => {
    if (customTopic.trim()) {
      updateFormData('configuration', 'customTopics', [
        ...formData.configuration.customTopics,
        customTopic.trim()
      ])
      setCustomTopic('')
    }
  }

  const _removeCustomTopic = (index) => {
    const updatedTopics = formData.configuration.customTopics.filter((_, i) => i !== index)
    updateFormData('configuration', 'customTopics', updatedTopics)
  }

  const _addCustomQuestion = () => {
    if (customQuestion.trim()) {
      updateFormData('configuration', 'customQuestions', [
        ...formData.configuration.customQuestions,
        customQuestion.trim()
      ])
      setCustomQuestion('')
    }
  }

  const _removeCustomQuestion = (index) => {
    const updatedQuestions = formData.configuration.customQuestions.filter((_, i) => i !== index)
    updateFormData('configuration', 'customQuestions', updatedQuestions)
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!formData.candidateInfo.name || !formData.candidateInfo.role || !formData.candidateInfo.company) {
        toast.error('Please fill in all required fields')
        setCurrentStep(1)
        return
      }

      if (formData.configuration.interviewMode === 'vapi') {
        if (user.subscription.plan === 'free' && user.subscription.vapiMinutesRemaining < formData.configuration.duration) {
          toast.error(`Insufficient VAPI minutes. You have ${user.subscription.vapiMinutesRemaining} minutes remaining.`)
          return
        }
        
        if (user.subscription.plan === 'pro') {
          const cost = formData.configuration.duration * 0.5
          if (user.subscription.payAsYouGoBalance < cost) {
            toast.error(`Insufficient balance. Need $${cost.toFixed(2)} for ${formData.configuration.duration} minutes.`)
            return
          }
        }
      }

      const result = await createInterview(formData)
      
      if (result.success) {
        navigate(`/interview/live/${result.interview._id}`)
      } else {
        toast.error(result.message || 'Failed to create interview')
      }
    } catch (error) {
      toast.error('Failed to create interview')
    }
  }

  const canUseVAPI = () => {
    if (user.subscription.plan === 'free') {
      return user.subscription.vapiMinutesRemaining >= formData.configuration.duration
    }
    if (user.subscription.plan === 'pro') {
      const cost = formData.configuration.duration * 0.5
      return user.subscription.payAsYouGoBalance >= cost
    }
    return false
  }

  const getVAPICost = () => {
    if (user.subscription.plan === 'free') {
      return `${formData.configuration.duration} minutes from your free quota`
    }
    const cost = formData.configuration.duration * 0.5
    return `$${cost.toFixed(2)} from your balance`
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your Interview</h1>
          <p className="text-lg text-gray-600">Configure your AI-powered interview practice session</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <p className="text-gray-600 mb-6">Tell us about yourself and the role you're preparing for.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.candidateInfo.name}
                    onChange={(e) => updateFormData('candidateInfo', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position *</label>
                  <input
                    type="text"
                    value={formData.candidateInfo.role}
                    onChange={(e) => updateFormData('candidateInfo', 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineer, Product Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    value={formData.candidateInfo.company}
                    onChange={(e) => updateFormData('candidateInfo', 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Google, Microsoft, Startup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <select
                    value={formData.candidateInfo.experience}
                    onChange={(e) => updateFormData('candidateInfo', 'experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {experienceLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Uploads Section */}
              <div className="mt-8 space-y-6">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-blue-500" />
                    Optional Documents
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload your resume and job description to get more personalized interview questions.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <FileText className="inline h-4 w-4 mr-1" />
                        Resume/CV
                      </label>
                      <FileUpload
                        onFileSelect={(file) => updateFormData('candidateInfo', 'resume', file)}
                        acceptedTypes=".pdf,.doc,.docx"
                        maxSize={10 * 1024 * 1024}
                        label="Upload Resume"
                        description="PDF, DOC, DOCX up to 10MB"
                        uploadType="resume"
                      />
                      {formData.candidateInfo.resume && (
                        <div className="mt-2 text-sm text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resume uploaded successfully
                        </div>
                      )}
                    </div>

                    {/* Job Description Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <FileText className="inline h-4 w-4 mr-1" />
                        Job Description
                      </label>
                      <FileUpload
                        onFileSelect={(file) => updateFormData('candidateInfo', 'jobDescriptionFile', file)}
                        acceptedTypes=".pdf,.doc,.docx,.txt"
                        maxSize={10 * 1024 * 1024}
                        label="Upload Job Description"
                        description="PDF, DOC, DOCX, TXT up to 10MB"
                        uploadType="jobDescription"
                      />
                      {formData.candidateInfo.jobDescriptionFile && (
                        <div className="mt-2 text-sm text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Job description uploaded successfully
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <Brain className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">AI Enhancement</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          When you upload documents, our AI will analyze them to create more relevant and personalized interview questions tailored to your background and the specific role.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interview Type */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Type</h2>
                <p className="text-gray-600 mb-6">Choose the type of interview you want to practice.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewTypes.map(type => (
                  <div
                    key={type.id}
                    onClick={() => updateFormData('', 'type', type.id)}
                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
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
                        <p className="text-gray-600 mb-4">{type.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {type.topics.slice(0, 3).map(topic => (
                            <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {formData.type === type.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Customization */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Configuration</h2>
                <p className="text-gray-600 mb-6">Customize your interview settings and preferences.</p>
              </div>

              {/* Interview Mode Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Mode</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewModes.map(mode => (
                    <div
                      key={mode.id}
                      onClick={() => {
                        if (mode.id === 'vapi' && !canUseVAPI()) {
                          toast.error('Insufficient VAPI minutes or balance.')
                          return
                        }
                        updateFormData('configuration', 'interviewMode', mode.id)
                      }}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.configuration.interviewMode === mode.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${mode.id === 'vapi' && !canUseVAPI() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <mode.icon className="w-6 h-6 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{mode.name}</h4>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${mode.badgeColor}`}>
                              {mode.badge}
                            </span>
                          </div>
                        </div>
                        {formData.configuration.interviewMode === mode.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {mode.features.map(feature => (
                          <li key={feature} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {mode.id === 'vapi' && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                          <p className="text-yellow-800">Cost: {getVAPICost()}</p>
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
                          className="mr-3 text-blue-600"
                        />
                        <div>
                          <span className="font-medium">{option.label}</span>
                          <span className="text-sm text-gray-500 ml-2">- {option.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
                  <div className="space-y-2">
                    {difficultyLevels.map(level => (
                      <label key={level.id} className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value={level.id}
                          checked={formData.configuration.difficulty === level.id}
                          onChange={(e) => updateFormData('configuration', 'difficulty', e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <div>
                          <span className={`font-medium ${level.color}`}>{level.name}</span>
                          <span className="text-sm text-gray-500 ml-2">- {level.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Your Setup</h2>
                <p className="text-gray-600 mb-6">Please review your interview configuration before starting.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.candidateInfo.name}</span></div>
                    <div><span className="text-gray-600">Role:</span> <span className="font-medium">{formData.candidateInfo.role}</span></div>
                    <div><span className="text-gray-600">Company:</span> <span className="font-medium">{formData.candidateInfo.company}</span></div>
                    <div><span className="text-gray-600">Experience:</span> <span className="font-medium capitalize">{formData.candidateInfo.experience}</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Interview Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Type:</span> <span className="font-medium capitalize">{formData.type}</span></div>
                    <div><span className="text-gray-600">Mode:</span> <span className="font-medium">{interviewModes.find(m => m.id === formData.configuration.interviewMode)?.name}</span></div>
                    <div><span className="text-gray-600">Duration:</span> <span className="font-medium">{formData.configuration.duration} minutes</span></div>
                    <div><span className="text-gray-600">Difficulty:</span> <span className="font-medium capitalize">{formData.configuration.difficulty}</span></div>
                  </div>
                </div>
              </div>

              {formData.configuration.interviewMode === 'vapi' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-yellow-800 mb-1">VAPI Interview Cost</h3>
                      <p className="text-sm text-yellow-700">
                        This interview will cost: <span className="font-medium">{getVAPICost()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formData.configuration.interviewMode === 'webspeech' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-green-800 mb-1">Free Web Speech Interview</h3>
                      <p className="text-sm text-green-700">
                        This interview is completely free with unlimited usage.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  Start Interview
                  <Zap className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewSetup
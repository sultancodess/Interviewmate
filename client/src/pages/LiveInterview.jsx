import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInterview } from '../contexts/InterviewContext'
import { useAuth } from '../contexts/AuthContext'
import vapiService from '../services/vapi'
import webSpeechService from '../services/webSpeechService'
// Using console logs instead of toast notifications
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  PhoneOff, 
  Settings, 
  Maximize, 
  Minimize, 
  Loader, 
  AlertCircle,
  Clock,
  Activity,
  Brain,
  BarChart3
} from 'lucide-react'

const LiveInterview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: _user } = useAuth()
  const { getInterview, evaluateInterview } = useInterview()
  
  // State management
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState(null)
  
  // Call state
  const [callStatus, setCallStatus] = useState('idle') // idle, connecting, connected, ended
  const [_isConnected, _setIsConnected] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [followUpQuestions, setFollowUpQuestions] = useState([])
  const [transcript, setTranscript] = useState('')
  const [transcriptHistory, setTranscriptHistory] = useState([])
  
  // Controls state
  const [isMuted, setIsMuted] = useState(false)
  const [isVolumeOn, setIsVolumeOn] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Timer state
  const [duration, setDuration] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef(null)
  
  // Interview data
  const [questionCount, setQuestionCount] = useState(0)
  const [totalQuestions] = useState(10) // Default total questions
  
  // Load interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true)
        const result = await getInterview(id)
        if (result.success) {
          setInterview(result.interview)
          await initializeInterviewSystem(result.interview)
        } else {
          console.error('Interview not found')
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Failed to fetch interview:', error)
        console.error('Failed to load interview')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchInterview()
    }
  }, [id])

  // Initialize interview systems
  const initializeInterviewSystem = async (_interviewData) => {
    try {
      setIsInitializing(true)
      setError(null)
      
      // Initialize VAPI service
      const vapiInitialized = vapiService.initialize(import.meta.env.VITE_VAPI_PUBLIC_KEY)
      if (!vapiInitialized) {
        throw new Error('Failed to initialize VAPI service')
      }
      
      // Generate potential follow-up questions based on interview type
      generateFollowUpQuestions(_interviewData)
      
      // Initialize Web Speech Service
      const webSpeechInitialized = webSpeechService.initialize()
      if (webSpeechInitialized) {
        webSpeechService.setCallbacks({
          onTranscript: (transcriptData) => {
            if (transcriptData.isFinal) {
              setTranscript(prev => prev + ' ' + transcriptData.text)
              
              // Update transcript history based on role
              const speaker = transcriptData.role === 'interviewer' ? 'AI Interviewer' : 'You'
              updateTranscriptHistory(speaker, transcriptData.text)
            }
          },
          onError: (error) => {
            setError(error.message)
            console.error('Speech recognition error: ' + error.message)
          },
          onQuestionGenerated: (question) => {
            setCurrentQuestion(question)
            setQuestionCount(prev => prev + 1)
            
            // Update transcript history with AI question
            updateTranscriptHistory('AI Interviewer', question)
          }
        })
      }
      
      // Setup VAPI event listeners
      vapiService.setCallbacks({
        onCallStart: () => {
          console.log('VAPI call started')
          setCallStatus('connected')
          _setIsConnected(true)
          startTimer()
          console.log('Connected to AI interviewer!')
        },
        onCallEnd: () => {
          console.log('VAPI call ended')
          setCallStatus('ended')
          _setIsConnected(false)
          stopTimer()
        },
        onError: (error) => {
          console.error('VAPI error:', error)
          setError(error.message)
          setCallStatus('idle')
          _setIsConnected(false)
          console.error('Speech recognition error: ' + error.message)
        },
        onMessage: (message) => {
          console.log('VAPI message:', message)
          if (message.type === 'transcript') {
            setTranscript(prev => prev + ' ' + message.text)
            // Update transcript history with AI response
            if (message.role === 'assistant') {
              updateTranscriptHistory('AI Interviewer', message.text)
            } else {
              updateTranscriptHistory('You', message.text)
            }
          }
        },
        onTranscript: (transcript) => {
          setTranscript(prev => prev + ' ' + transcript)
          // Update transcript history with user response
          updateTranscriptHistory('You', transcript)
        }
      })
      
    } catch (error) {
      console.error('❌ Failed to initialize interview system:', error)
      setError(error.message)
      console.error('Failed to initialize interview system: ' + error.message)
    } finally {
      setIsInitializing(false)
    }
  }

  // Generate follow-up questions based on interview type and current question
  const generateFollowUpQuestions = (interviewData) => {
    if (!interviewData) return
    
    // Sample follow-up questions based on interview type
    const followUpsByType = {
      hr: [
        "Can you provide a specific example of that?",
        "How did you handle challenges in that situation?",
        "What did you learn from that experience?",
        "How would you approach this differently now?",
        "How does this relate to the role you're applying for?"
      ],
      technical: [
        "Can you explain your approach in more detail?",
        "What are the time and space complexity of your solution?",
        "How would you optimize this solution further?",
        "What edge cases should we consider?",
        "How would you scale this solution?"
      ]
    }
    
    // Set initial follow-up questions based on interview type
    const interviewType = interviewData.type || 'hr'
    setFollowUpQuestions(followUpsByType[interviewType] || followUpsByType.hr)
  }
  
  // Update transcript history with new entries
  const updateTranscriptHistory = (speaker, text) => {
    if (!text) return
    
    setTranscriptHistory(prev => [
      ...prev,
      { speaker, text, timestamp: new Date().toISOString() }
    ])
  }
  
  // Timer functions
  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const pauseTimer = () => {
    if (isTimerRunning) {
      stopTimer()
    } else {
      startTimer()
    }
  }

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle VAPI service errors
  const _handleVapiError = (error) => {
    console.error('VAPI Service Error:', error)
    setError('VAPI service error. Please try again or contact support.')
    setCallStatus('idle')
    _setIsConnected(false)
    console.error('VAPI service error. Please try again or contact support.')
  }

  // Start interview
  const startInterview = async () => {
    try {
      setCallStatus('connecting')
      setError(null)
      
      const interviewMode = interview.configuration?.interviewMode || 'webspeech'
      
      if (interviewMode === 'vapi') {
        // Try VAPI first
        try {
          const result = await vapiService.startCall(interview.type, {
            interviewId: interview._id,
            candidateInfo: interview.candidateInfo,
            type: interview.type,
            difficulty: interview.configuration.difficulty
          })
          
          if (result.success) {
            setCallStatus('connected')
            _setIsConnected(true)
            startTimer()
            console.log('Connected to VAPI AI interviewer!')
            return
          }
        } catch (vapiError) {
          console.error('VAPI failed, falling back to Web Speech API:', vapiError)
          // Fall back to Web Speech API
        }
      }
      
      // Use Web Speech API (either by choice or as fallback)
      const webSpeechResult = await webSpeechService.startInterview({
        type: interview.type,
        candidateInfo: interview.candidateInfo,
        configuration: interview.configuration
      })
      
      if (webSpeechResult) {
        setCallStatus('connected')
        _setIsConnected(true)
        startTimer()
        console.log('Connected to Web Speech API interviewer!')
        
        if (interviewMode === 'vapi') {
          setError('VAPI unavailable - using Web Speech API fallback mode')
        }
      }
      
    } catch (error) {
      console.error('Failed to start interview:', error)
      setError(error.message)
      setCallStatus('idle')
      console.error('Failed to start interview: ' + error.message)
    }
  }

  // Toggle mute
  const toggleMute = async () => {
    try {
      const newMutedState = !isMuted
      
      if (vapiService.isCallActive()) {
        // Handle VAPI mute
        // Note: Actual VAPI mute implementation would go here
        console.log('VAPI mute toggle:', newMutedState)
      }
      
      // Handle web speech mute
      if (newMutedState) {
        webSpeechService.stop()
      } else {
        webSpeechService.start()
      }
      
      setIsMuted(newMutedState)
      console.log(newMutedState ? 'Microphone muted' : 'Microphone unmuted')
    } catch (error) {
      console.error('Failed to toggle mute:', error)
      console.error('Failed to toggle microphone')
    }
  }

  // Toggle volume
  const toggleVolume = () => {
    const newVolumeState = !isVolumeOn
    setIsVolumeOn(newVolumeState)
    
    // Handle volume control
    // Note: Actual volume control implementation would go here
    
    console.log(newVolumeState ? 'Volume unmuted' : 'Volume muted')
  }

  // Toggle pause
  const togglePause = async () => {
    try {
      const newPausedState = !isPaused
      
      if (newPausedState) {
        pauseTimer()
        // Pause VAPI call if needed
      } else {
        startTimer()
        // Resume VAPI call if needed
      }
      
      setIsPaused(newPausedState)
      console.log(newPausedState ? 'Interview paused' : 'Interview resumed')
    } catch (error) {
      console.error('Failed to toggle pause:', error)
      console.error('Failed to pause/resume interview')
    }
  }

  // End interview
  const endInterview = async () => {
    try {
      setCallStatus('ended')
      stopTimer()
      
      // Stop VAPI call if active
      if (vapiService.isCallActive()) {
        await vapiService.stopCall()
      }
      
      // Stop web speech
      webSpeechService.cleanup()
      
      // Prepare final transcript
      const finalTranscript = transcript.trim() || webSpeechService.getTranscript()
      
      // Format transcript history for evaluation
      const formattedTranscriptHistory = transcriptHistory.map(entry => 
        `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.speaker}: ${entry.text}`
      ).join('\n\n')
      
      console.log('Interview completed! Generating evaluation...')
      
      // Use transcript history if available, otherwise fall back to simple transcript
      const transcriptForEvaluation = formattedTranscriptHistory || finalTranscript
      
      const result = await evaluateInterview(id, transcriptForEvaluation)
      if (result.success) {
        navigate(`/interview/report/${id}`)
      } else {
        console.error('Failed to evaluate interview')
        navigate(`/interview/report/${id}`)
      }
    } catch (error) {
      console.error('Failed to end interview:', error)
      console.error('Failed to end interview')
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      try {
        vapiService.removeAllListeners()
      } catch (error) {
        console.warn('Error removing VAPI listeners:', error)
      }
      try {
        webSpeechService.cleanup()
      } catch (error) {
        console.warn('Error cleaning up web speech service:', error)
      }
    }
  }, [])

  // Loading state
  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader className="w-16 h-16 mx-auto mb-6 text-blue-400 animate-spin" />
            <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-blue-400/20 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {loading ? 'Loading Interview...' : 'Initializing AI Assistant...'}
          </h2>
          <p className="text-blue-200">
            {loading ? 'Preparing your interview session' : 'Setting up voice recognition and AI systems'}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Interview Not Found</h2>
          <p className="text-gray-300">The interview session could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">InterviewMate</span>
            </div>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="text-sm text-gray-300">
              <span className="font-medium">{interview.candidateInfo.name}</span>
              <span className="mx-2">•</span>
              <span>{interview.candidateInfo.role}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-mono">{formatDuration(duration)}</span>
            </div>
            
            {/* Progress */}
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400">
                <span className="font-medium">{questionCount}</span>/{totalQuestions}
              </div>
              <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${(questionCount / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Interview Area */}
        <div className="flex-1 flex flex-col">
          {/* AI Interviewer Section */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)] animate-pulse"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
              {/* AI Interviewer Avatar */}
              <div className="mb-8">
                <div className="relative">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 ${callStatus === 'connected' ? 'animate-pulse' : ''}`}>
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                        alt="AI Interviewer" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-gray-900 flex items-center justify-center ${
                    callStatus === 'connected' ? 'bg-green-500' : 
                    callStatus === 'connecting' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
              
              {/* Interviewer Info */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Alex Chen</h3>
                <p className="text-blue-200 mb-1">Senior Technical Interviewer</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>🏢</span>
                    <span>Tech Corp</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span>4.9/5</span>
                  </div>
                </div>
              </div>

              {/* Current Question Display */}
              {currentQuestion && callStatus === 'connected' && (
                <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{questionCount}</span>
                    </div>
                    <p className="text-lg text-left">{currentQuestion}</p>
                  </div>
                  
                  {/* Follow-up Questions */}
                  {followUpQuestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Potential Follow-up Questions:</h4>
                      <ul className="space-y-2">
                        {followUpQuestions.map((question, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="inline-block w-5 h-5 rounded-full bg-blue-600/50 text-blue-200 text-xs flex items-center justify-center mr-2 mt-0.5">{index + 1}</span>
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-8 p-4 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {/* Start Interview Button */}
              {callStatus === 'idle' && !error && (
                <button
                  onClick={startInterview}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Play className="h-6 w-6" />
                  <span className="text-lg">Start Interview</span>
                </button>
              )}

              {/* Connecting State */}
              {callStatus === 'connecting' && (
                <div className="flex items-center justify-center space-x-3 text-blue-200">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Connecting to AI assistant...</span>
                </div>
              )}
              
              {/* Paused State */}
              {callStatus === 'connected' && isPaused && (
                <div className="p-6 bg-yellow-500/20 backdrop-blur-md rounded-2xl border border-yellow-500/30">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Pause className="h-6 w-6 text-yellow-400" />
                  </div>
                  <p className="text-yellow-200 text-lg">Interview Paused</p>
                  <p className="text-yellow-300 text-sm">Click resume to continue</p>
                </div>
              )}

              {/* Ended State */}
              {callStatus === 'ended' && (
                <div className="p-6 bg-green-500/20 backdrop-blur-md rounded-2xl border border-green-500/30">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Brain className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-green-200 text-lg">Interview Completed</p>
                  <p className="text-green-300 text-sm">Generating your performance report...</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-6">
            <div className="flex items-center justify-center space-x-6">
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                disabled={callStatus !== 'connected'}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>

              {/* Volume Button */}
              <button
                onClick={toggleVolume}
                disabled={callStatus !== 'connected'}
                className={`p-4 rounded-full transition-all duration-200 ${
                  !isVolumeOn 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isVolumeOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </button>

              {/* Pause/Resume Button */}
              <button
                onClick={togglePause}
                disabled={callStatus !== 'connected'}
                className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </button>

              {/* End Interview Button */}
              <button
                onClick={endInterview}
                disabled={callStatus !== 'connected'}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center mt-4">
              <div className="text-2xl font-mono font-bold">
                {formatDuration(duration)}
              </div>
              <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min((duration / 1800) * 100, 100)}%` }} // 30 min max
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-black/30 backdrop-blur-md border-l border-white/10 flex flex-col">
          {/* Interview Info */}
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold mb-4">Interview Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="capitalize">{interview.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className="capitalize">{interview.configuration.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Questions:</span>
                <span>{questionCount}/{totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold mb-4">Live Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-300">Speaking</span>
                </div>
                <div className="text-lg font-bold">{callStatus === 'connected' && !isMuted ? 'Active' : 'Inactive'}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-gray-300">Questions</span>
                </div>
                <div className="text-lg font-bold">{questionCount}</div>
              </div>
            </div>
          </div>

          {/* Transcript Preview */}
          <div className="flex-1 p-6">
            <h3 className="text-lg font-semibold mb-4">Live Transcript</h3>
            <div className="bg-white/5 rounded-lg p-4 h-64 overflow-y-auto text-sm">
              {transcript ? (
                <p className="text-gray-300 leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-gray-500 italic">Transcript will appear here during the interview...</p>
              )}
              
              {/* Transcript History */}
              {transcriptHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Conversation History:</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {transcriptHistory.map((entry, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-blue-400 mb-1">{entry.speaker}:</div>
                        <p className="text-gray-300">{entry.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Interview Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Microphone Sensitivity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="50"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Speaker Volume</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="75"
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-pause on silence</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Show live captions</span>
                <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveInterview
import Vapi from '@vapi-ai/web'
import toast from 'react-hot-toast'

class VapiService {
  constructor() {
    this.vapi = null
    this.isInitialized = false
    this.currentCall = null
    this.callbacks = {
      onCallStart: null,
      onCallEnd: null,
      onSpeechStart: null,
      onSpeechEnd: null,
      onMessage: null,
      onError: null,
      onTranscript: null,
    }
  }

  // Initialize VAPI with public key
  async initialize(publicKey) {
    try {
      if (!publicKey) {
        throw new Error('VAPI public key is required')
      }

      this.vapi = new Vapi(publicKey)
      this.isInitialized = true
      this.setupEventListeners()
      
      console.log('VAPI initialized successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize VAPI:', error)
      toast.error('Failed to initialize voice assistant')
      return false
    }
  }

  // Setup event listeners
  setupEventListeners() {
    if (!this.vapi) return

    this.vapi.on('call-start', () => {
      console.log('Call started')
      this.callbacks.onCallStart?.()
    })

    this.vapi.on('call-end', () => {
      console.log('Call ended')
      this.currentCall = null
      this.callbacks.onCallEnd?.()
    })

    this.vapi.on('speech-start', () => {
      console.log('User started speaking')
      this.callbacks.onSpeechStart?.()
    })

    this.vapi.on('speech-end', () => {
      console.log('User stopped speaking')
      this.callbacks.onSpeechEnd?.()
    })

    this.vapi.on('message', (message) => {
      console.log('Message received:', message)
      this.callbacks.onMessage?.(message)
      
      // Handle transcript messages
      if (message.type === 'transcript' && message.transcript) {
        this.callbacks.onTranscript?.(message.transcript)
      }
    })

    this.vapi.on('error', (error) => {
      console.error('❌ VAPI error:', error)
      this.callbacks.onError?.(error)
      // Don't show toast here, let the calling code handle fallback
    })

    this.vapi.on('volume-level', () => {
      // Handle volume level changes if needed
    })
  }

  // Start a call with assistant configuration
  async startCall(interviewType, interviewData) {
    try {
      if (!this.isInitialized) {
        throw new Error('VAPI not initialized')
      }

      if (this.currentCall) {
        throw new Error('Call already in progress')
      }

      // Get assistant ID based on interview type
      const assistantId = this.getAssistantId(interviewType)
      if (!assistantId) {
        throw new Error(`No assistant ID configured for interview type: ${interviewType}`)
      }

      const callConfig = {
        assistantId: assistantId,
        metadata: {
          interviewId: interviewData.interviewId,
          candidateInfo: interviewData.candidateInfo,
          type: interviewData.type,
          difficulty: interviewData.difficulty
        }
      }

      // Start the call
      this.currentCall = this.vapi.start(callConfig)
      return { success: true, call: this.currentCall }
      
    } catch (error) {
      console.error('Failed to start VAPI call:', error)
      throw error
    }
  }

  // Get assistant ID based on interview type
  getAssistantId(interviewType) {
    const assistantIds = {
      'hr': import.meta.env.VITE_VAPI_HR_ASSISTANT_ID,
      'technical': import.meta.env.VITE_VAPI_TECHNICAL_ASSISTANT_ID
    }
    
    return assistantIds[interviewType] || assistantIds['hr'] // Default to HR if type not found
  }



  // Get default assistant for fallback
  getDefaultAssistant() {
    return {
      name: 'InterviewMate Assistant',
      firstMessage: 'Hello! Welcome to your interview practice session. I\'m here to help you prepare. Shall we begin?',
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 150,
        messages: [
          {
            role: 'system',
            content: 'You are a friendly interview assistant helping candidates practice their interview skills. Ask relevant questions and provide encouragement.'
          }
        ]
      },
      voice: {
        provider: 'playht',
        voiceId: 'jennifer'
      },
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en-US'
      }
    }
  }

  // Build interview context for the assistant
  buildInterviewContext(candidateInfo, configuration, type) {
    const context = `
Interview Context:
- Candidate: ${candidateInfo.name}
- Role: ${candidateInfo.role}
- Company: ${candidateInfo.company}
- Experience Level: ${candidateInfo.experience}
- Interview Type: ${type.toUpperCase()}
- Duration: ${configuration.duration} minutes
- Difficulty: ${configuration.difficulty}
- Focus Topics: ${configuration.topics?.join(', ') || 'General'}
${configuration.customQuestions?.length ? `- Custom Questions: ${configuration.customQuestions.join('; ')}` : ''}
${configuration.jobDescription ? `- Job Description: ${configuration.jobDescription.substring(0, 200)}...` : ''}

Please conduct a ${type} interview focusing on the specified topics and difficulty level.
    `.trim()

    return context
  }

  // Stop the current call
  async stopCall() {
    try {
      if (!this.currentCall) {
        console.log('No active call to stop')
        return
      }

      this.vapi.stop()
      this.currentCall = null
      console.log('Call stopped')
    } catch (error) {
      console.error('Failed to stop call:', error)
      toast.error('Failed to stop voice interview')
      throw error
    }
  }

  // Check if call is active
  isCallActive() {
    return !!this.currentCall
  }

  // Set mute state
  async setMuted(muted) {
    try {
      if (!this.currentCall) {
        throw new Error('No active call')
      }

      this.vapi.setMuted(muted)
      console.log(`Call ${muted ? 'muted' : 'unmuted'}`)
    } catch (error) {
      console.error('Failed to set mute state:', error)
      throw error
    }
  }

  // Send a message during the call
  async sendMessage(message) {
    try {
      if (!this.currentCall) {
        throw new Error('No active call')
      }

      this.vapi.send({
        type: 'add-message',
        message: {
          role: 'system',
          content: message,
        },
      })
      
      console.log('Message sent:', message)
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  // Set callback functions
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  // Event listener methods for compatibility
  onCallStart(callback) {
    this.callbacks.onCallStart = callback
  }

  onCallEnd(callback) {
    this.callbacks.onCallEnd = callback
  }

  onSpeechStart(callback) {
    this.callbacks.onSpeechStart = callback
  }

  onSpeechEnd(callback) {
    this.callbacks.onSpeechEnd = callback
  }

  onMessage(callback) {
    this.callbacks.onMessage = callback
  }

  onError(callback) {
    this.callbacks.onError = callback
  }

  onTranscript(callback) {
    this.callbacks.onTranscript = callback
  }

  // Remove all listeners
  removeAllListeners() {
    this.callbacks = {
      onCallStart: null,
      onCallEnd: null,
      onSpeechStart: null,
      onSpeechEnd: null,
      onMessage: null,
      onError: null,
      onTranscript: null,
    }
    
    if (this.vapi) {
      // Remove VAPI event listeners if the method exists
      try {
        this.vapi.removeAllListeners?.()
      } catch (error) {
        console.warn('VAPI removeAllListeners not available:', error)
      }
    }
  }

  // Cleanup resources
  cleanup() {
    if (this.currentCall) {
      this.stopCall()
    }
    
    this.removeAllListeners()
    
    this.isInitialized = false
    this.vapi = null
    this.currentCall = null
  }
}

// Create singleton instance
const vapiService = new VapiService()

export default vapiService
// Web Speech API Service for Fallback Mode
class WebSpeechService {
  constructor() {
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.isListening = false
    this.isSupported = this.checkSupport()
    this.callbacks = {}
    this.currentUtterance = null
    this.voices = []
    this.selectedVoice = null
    
    // Initialize voices
    this.initializeVoices()
  }

  checkSupport() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis
    
    return !!(SpeechRecognition && speechSynthesis)
  }

  initializeVoices() {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices()
      
      // Prefer female voice for HR, male for Technical
      const _femaleVoices = this.voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan')
      )
      
      const _maleVoices = this.voices.filter(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('daniel') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('tom')
      )
      
      // Default to first available voice
      this.selectedVoice = this.voices[0] || null
    }

    // Load voices immediately if available
    loadVoices()
    
    // Also listen for voices changed event (some browsers load voices asynchronously)
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices
    }
  }

  setVoice(interviewType = 'hr') {
    if (!this.voices.length) return

    if (interviewType === 'hr') {
      // Prefer female voice for HR
      const femaleVoice = this.voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen')
      )
      this.selectedVoice = femaleVoice || this.voices[0]
    } else {
      // Prefer male voice for Technical
      const maleVoice = this.voices.find(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('daniel') ||
        voice.name.toLowerCase().includes('alex')
      )
      this.selectedVoice = maleVoice || this.voices[0]
    }
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks
  }

  async initialize(interviewType = 'hr') {
    if (!this.isSupported) {
      throw new Error('Web Speech API is not supported in this browser')
    }

    try {
      // Set appropriate voice
      this.setVoice(interviewType)
      
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      
      // Configure recognition
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
      this.recognition.maxAlternatives = 1

      // Set up event listeners
      this.recognition.onstart = () => {
        this.isListening = true
        console.log('Speech recognition started')
        this.callbacks.onSpeechStart?.()
      }

      this.recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Send interim results for real-time display
        if (interimTranscript) {
          this.callbacks.onTranscript?.({
            role: 'user',
            text: interimTranscript,
            isFinal: false
          })
        }

        // Send final results for processing
        if (finalTranscript) {
          this.callbacks.onTranscript?.({
            role: 'user',
            text: finalTranscript.trim(),
            isFinal: true
          })
          
          // Process the final transcript
          this.callbacks.onUserSpeechEnd?.(finalTranscript.trim())
        }
      }

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        this.callbacks.onError?.(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
        console.log('Speech recognition ended')
        
        // Restart recognition if we're still in an active session
        if (this.callbacks.shouldRestart?.()) {
          setTimeout(() => {
            this.startListening()
          }, 100)
        }
      }

      return true
    } catch (error) {
      console.error('Failed to initialize Web Speech API:', error)
      throw error
    }
  }

  startListening() {
    if (!this.recognition || this.isListening) return

    try {
      this.recognition.start()
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      this.callbacks.onError?.(error)
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure utterance
      utterance.voice = this.selectedVoice
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onstart = () => {
        this.currentUtterance = utterance
        console.log('AI started speaking:', text.substring(0, 50) + '...')
        
        // Send transcript for display
        this.callbacks.onTranscript?.({
          role: 'assistant',
          text: text,
          isFinal: true
        })
      }

      utterance.onend = () => {
        this.currentUtterance = null
        console.log('AI finished speaking')
        resolve()
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        console.error('Speech synthesis error:', event.error)
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.synthesis.speak(utterance)
    })
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  isSpeaking() {
    return this.synthesis?.speaking || false
  }

  setMuted(muted) {
    if (muted) {
      this.stopListening()
    } else {
      this.startListening()
    }
  }

  setVolume(volume) {
    // Volume will be applied to next utterance
    this.volume = Math.max(0, Math.min(1, volume))
  }

  cleanup() {
    this.stopListening()
    this.stopSpeaking()
    this.callbacks = {}
    
    if (this.recognition) {
      this.recognition.onstart = null
      this.recognition.onresult = null
      this.recognition.onerror = null
      this.recognition.onend = null
      this.recognition = null
    }
  }

  // Utility methods
  getAvailableVoices() {
    return this.voices
  }

  setSelectedVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName)
    if (voice) {
      this.selectedVoice = voice
    }
  }

  // Test method to check if everything is working
  async test() {
    try {
      await this.speak('Testing Web Speech API. Can you hear me?')
      return true
    } catch (error) {
      console.error('Web Speech API test failed:', error)
      return false
    }
  }
}

// Create singleton instance
const webSpeechService = new WebSpeechService()

export default webSpeechService
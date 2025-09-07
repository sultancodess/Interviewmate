// Client-side Gemini service - communicates with server API

class GeminiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    this.initialized = true // Client doesn't need initialization
  }

  async initialize() {
    // No initialization needed on client-side
    console.log('✅ Gemini service ready (client-side)')
    return true
  }

  async generateQuestions(jobDescription, difficulty = 'medium', count = 5) {
    try {
      const response = await fetch(`${this.baseURL}/interview/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobDescription,
          difficulty,
          count
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.questions || []
    } catch (error) {
      console.error('Error generating questions:', error)
      throw new Error('Failed to generate interview questions')
    }
  }

  async evaluateInterview(transcript, questions) {
    try {
      const response = await fetch(`${this.baseURL}/interview/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transcript,
          questions
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.evaluation || {}
    } catch (error) {
      console.error('Error evaluating interview:', error)
      throw new Error('Failed to evaluate interview')
    }
  }

  // Generate follow-up questions
  async generateFollowUp(prompt) {
    try {
      const response = await fetch(`${this.baseURL}/interview/generate-followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.followUp || ''
    } catch (error) {
      console.error('Error generating follow-up:', error)
      throw new Error('Failed to generate follow-up question')
    }
  }

  // Helper method to check service health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`)
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }

  // Test connection
  async testConnection() {
    try {
      return await this.checkHealth()
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService()

export default geminiService
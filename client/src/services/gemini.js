import { apiService } from './api'

class GeminiService {
  constructor() {
    this.isInitialized = false
  }

  initialize() {
    this.isInitialized = true
    return true
  }

  async generateQuestions(prompt) {
    try {
      const response = await apiService.interview.generateQuestions({ prompt })
      return response.data
    } catch (error) {
      console.error('Failed to generate questions:', error)
      throw error
    }
  }

  async generateFollowUp(prompt) {
    try {
      const response = await apiService.interview.generateFollowup({ prompt })
      return response.data.followUp
    } catch (error) {
      console.error('Failed to generate follow-up:', error)
      throw error
    }
  }

  async testConnection() {
    try {
      const response = await apiService.interview.testGemini()
      return response.data.success
    } catch (error) {
      console.error('Gemini connection test failed:', error)
      return false
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService()

export default geminiService
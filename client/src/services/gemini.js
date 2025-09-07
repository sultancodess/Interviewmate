import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiService {
  constructor() {
    this.genAI = null
    this.model = null
    this.isInitialized = false
  }

  // Initialize Gemini AI
  initialize() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        console.warn('Gemini API key not found in environment variables')
        return false
      }

      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      this.isInitialized = true
      
      console.log('✅ Gemini AI initialized successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error)
      return false
    }
  }

  // Generate interview questions
  async generateQuestions(prompt) {
    try {
      if (!this.isInitialized) {
        const initialized = this.initialize()
        if (!initialized) {
          throw new Error('Gemini AI not initialized')
        }
      }

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(text)
        return parsed
      } catch (parseError) {
        // If not JSON, extract questions from text
        const questions = this.extractQuestionsFromText(text)
        return { questions }
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
      throw error
    }
  }

  // Generate follow-up questions
  async generateFollowUp(prompt) {
    try {
      if (!this.isInitialized) {
        const initialized = this.initialize()
        if (!initialized) {
          throw new Error('Gemini AI not initialized')
        }
      }

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      console.error('Failed to generate follow-up:', error)
      throw error
    }
  }

  // Evaluate interview performance
  async evaluateInterview(transcript, interviewData) {
    try {
      if (!this.isInitialized) {
        const initialized = this.initialize()
        if (!initialized) {
          throw new Error('Gemini AI not initialized')
        }
      }

      const prompt = this.buildEvaluationPrompt(transcript, interviewData)
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Try to parse JSON response
      try {
        const evaluation = JSON.parse(text)
        return evaluation
      } catch (parseError) {
        // If not JSON, create structured evaluation from text
        return this.parseEvaluationFromText(text)
      }
    } catch (error) {
      console.error('Failed to evaluate interview:', error)
      throw error
    }
  }

  // Build evaluation prompt
  buildEvaluationPrompt(transcript, interviewData) {
    return `Evaluate this ${interviewData.type} interview performance:

CANDIDATE INFO:
- Name: ${interviewData.candidateInfo.name}
- Role: ${interviewData.candidateInfo.role}
- Experience: ${interviewData.candidateInfo.experience}
- Company: ${interviewData.candidateInfo.company}

INTERVIEW TRANSCRIPT:
${transcript}

EVALUATION CRITERIA:
- Communication Skills (clarity, articulation, confidence)
- Technical Knowledge (for technical interviews)
- Problem-Solving Ability
- Behavioral Responses (for HR interviews)
- Overall Professionalism

Please provide a detailed evaluation in JSON format:
{
  "overallScore": 85,
  "skillScores": {
    "communication": 90,
    "technicalKnowledge": 80,
    "problemSolving": 85,
    "confidence": 88,
    "clarity": 92,
    "behavioral": 85
  },
  "strengths": ["Clear communication", "Good technical knowledge"],
  "weaknesses": ["Could improve confidence", "More specific examples needed"],
  "recommendations": ["Practice more technical scenarios", "Work on body language"],
  "detailedFeedback": "Detailed paragraph about performance...",
  "badges": ["Clear Communicator", "Technical Expert"]
}

Provide constructive, actionable feedback that helps the candidate improve.`
  }

  // Extract questions from text response
  extractQuestionsFromText(text) {
    const lines = text.split('\n').filter(line => line.trim())
    const questions = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.match(/^\d+\./) || trimmed.includes('?')) {
        // Remove numbering and clean up
        const question = trimmed.replace(/^\d+\.\s*/, '').trim()
        if (question.length > 10) {
          questions.push(question)
        }
      }
    }

    return questions.slice(0, 10) // Limit to 10 questions
  }

  // Parse evaluation from text response
  parseEvaluationFromText(text) {
    // Basic parsing for non-JSON responses
    const _lines = text.split('\n').filter(line => line.trim())
    
    return {
      overallScore: 75, // Default score
      skillScores: {
        communication: 75,
        technicalKnowledge: 70,
        problemSolving: 75,
        confidence: 70,
        clarity: 80,
        behavioral: 75
      },
      strengths: this.extractListFromText(text, ['strength', 'good', 'excellent', 'strong']),
      weaknesses: this.extractListFromText(text, ['weakness', 'improve', 'work on', 'better']),
      recommendations: this.extractListFromText(text, ['recommend', 'suggest', 'should', 'practice']),
      detailedFeedback: text.substring(0, 500) + '...',
      badges: ['Participant']
    }
  }

  // Extract list items from text based on keywords
  extractListFromText(text, keywords) {
    const sentences = text.split(/[.!?]/).filter(s => s.trim())
    const items = []

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase()
      if (keywords.some(keyword => lower.includes(keyword))) {
        const cleaned = sentence.trim()
        if (cleaned.length > 10 && cleaned.length < 200) {
          items.push(cleaned)
        }
      }
    }

    return items.slice(0, 5) // Limit to 5 items
  }

  // Test connection
  async testConnection() {
    try {
      if (!this.isInitialized) {
        const initialized = this.initialize()
        if (!initialized) {
          return false
        }
      }

      const result = await this.model.generateContent('Say "Hello" if you can hear me.')
      const response = await result.response
      const text = response.text()
      
      return text.toLowerCase().includes('hello')
    } catch (error) {
      console.error('Gemini connection test failed:', error)
      return false
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService()

export default geminiService
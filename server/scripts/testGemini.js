import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testGeminiAPI() {
  try {
    console.log('🔧 Testing Gemini API connection...')
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment')
    }
    
    console.log(`📋 API Key: ${apiKey.substring(0, 8)}...`)
    console.log(`📋 Model: ${process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'}`)
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    })

    console.log('🚀 Sending test request...')
    
    const prompt = 'Say "Hello from Gemini!" in exactly 3 words.'
    console.log('📝 Prompt:', prompt)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('✅ Gemini API Response:', text)
    console.log('✅ Gemini API is working correctly!')
    
    return true
  } catch (error) {
    console.error('❌ Gemini API Test Failed:', error.message)
    
    if (error.message.includes('API key not valid')) {
      console.log('💡 Solution: Check your API key at https://aistudio.google.com/app/apikey')
    } else if (error.message.includes('quota')) {
      console.log('💡 Solution: You have exceeded your quota. Wait or upgrade your plan.')
    } else if (error.message.includes('not found')) {
      console.log('💡 Solution: Try using "gemini-1.5-flash" model instead')
    }
    
    return false
  }
}

// Run the test
testGeminiAPI().then(success => {
  process.exit(success ? 0 : 1)
})
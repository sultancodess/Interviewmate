#!/usr/bin/env node

/**
 * Test Gemini API with correct model
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API...')
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment')
      process.exit(1)
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // First, let's list available models
    console.log('📋 Listing available models...')
    try {
      const models = await genAI.listModels()
      console.log('Available models:')
      models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`)
      })
    } catch (listError) {
      console.log('Could not list models:', listError.message)
    }

    // Test with gemini-1.5-flash (correct model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })

    console.log('🔄 Sending test request...')
    
    const result = await model.generateContent('Hello, this is a test. Please respond with "Gemini API is working correctly!"')
    const response = result.response
    const text = response.text()
    
    console.log('✅ Gemini API Response:', text)
    console.log('🎉 Gemini API is working correctly!')
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message)
    
    if (error.message.includes('404')) {
      console.error('💡 Suggestion: The model might not be available. Try gemini-1.5-flash instead.')
    } else if (error.message.includes('403')) {
      console.error('💡 Suggestion: Check your API key permissions.')
    } else if (error.message.includes('quota')) {
      console.error('💡 Suggestion: You may have exceeded your API quota.')
    }
    
    process.exit(1)
  }
}

testGemini()
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

async function testGeminiHTTP() {
  try {
    console.log('🔧 Testing Gemini API with direct HTTP request...')
    
    const apiKey = process.env.GEMINI_API_KEY
    console.log(`📋 API Key: ${apiKey.substring(0, 8)}...`)
    
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello in 3 words'
          }]
        }]
      })
    })
    
    console.log('📊 Response Status:', response.status)
    console.log('📊 Response Headers:', Object.fromEntries(response.headers))
    
    const data = await response.json()
    console.log('📊 Response Data:', JSON.stringify(data, null, 2))
    
    if (response.ok && data.candidates && data.candidates[0]) {
      const text = data.candidates[0].content.parts[0].text
      console.log('✅ Gemini Response:', text)
      console.log('✅ HTTP API test successful!')
      return true
    } else {
      console.log('❌ HTTP API test failed')
      return false
    }
    
  } catch (error) {
    console.error('❌ HTTP Test Error:', error.message)
    return false
  }
}

testGeminiHTTP().then(success => {
  process.exit(success ? 0 : 1)
})
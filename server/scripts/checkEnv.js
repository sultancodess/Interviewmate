#!/usr/bin/env node

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') })

console.log('🔍 Checking InterviewMate Environment Setup...\n')

// Check required variables
const required = [
  { key: 'MONGODB_URI', description: 'MongoDB connection string' },
  { key: 'JWT_SECRET', description: 'JWT signing secret' }
]

// Check optional variables
const optional = [
  { key: 'GEMINI_API_KEY', description: 'Google Gemini AI API key', feature: 'AI Evaluation' },
  { key: 'RAZORPAY_KEY_ID', description: 'Razorpay payment key', feature: 'Payments' },
  { key: 'VAPI_PRIVATE_API_KEY', description: 'VAPI AI private key', feature: 'Voice AI' }
]

let hasErrors = false
let warnings = []

// Check required variables
console.log('✅ Required Configuration:')
required.forEach(({ key, description }) => {
  if (!process.env[key]) {
    console.log(`❌ ${key}: Missing (${description})`)
    hasErrors = true
  } else {
    console.log(`✅ ${key}: Configured`)
  }
})

console.log('\n🔧 Optional Configuration:')
optional.forEach(({ key, description, feature }) => {
  if (!process.env[key] || process.env[key].includes('your_') || process.env[key].includes('_here')) {
    console.log(`⚠️  ${key}: Not configured (${feature} will be disabled)`)
    warnings.push(`${feature} disabled - ${description} not configured`)
  } else {
    console.log(`✅ ${key}: Configured (${feature} enabled)`)
  }
})

// Summary
console.log('\n📋 Summary:')
if (hasErrors) {
  console.log('❌ Setup incomplete - missing required configuration')
  console.log('\n🔧 To fix:')
  console.log('1. Copy server/.env.example to server/.env')
  console.log('2. Edit server/.env with your actual values')
  console.log('3. Run this check again: node server/scripts/checkEnv.js')
  process.exit(1)
} else {
  console.log('✅ Minimum configuration complete - server can start')
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    warnings.forEach(warning => console.log(`   - ${warning}`))
    console.log('\n💡 These features are optional and can be configured later.')
  }
  
  console.log('\n🚀 Ready to start server: npm run dev')
}
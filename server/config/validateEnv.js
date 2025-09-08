import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
]

// Optional environment variables with defaults
const optionalEnvVars = {
  PORT: '5000',
  NODE_ENV: 'development',
  CLIENT_URL: 'http://localhost:5173',
  JWT_EXPIRE: '7d',
  GEMINI_MODEL: 'gemini-1.5-pro',
  GEMINI_TEMPERATURE: '0.7',
  GEMINI_MAX_TOKENS: '2000'
}

// Validate environment variables
export const validateEnvironment = () => {
  const missingVars = []
  const warnings = []

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })

  // Set defaults for optional variables
  Object.entries(optionalEnvVars).forEach(([varName, defaultValue]) => {
    if (!process.env[varName]) {
      process.env[varName] = defaultValue
      warnings.push(`${varName} not set, using default: ${defaultValue}`)
    }
  })

  // Check JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security')
  }

  if (process.env.JWT_SECRET === 'interviewmate123') {
    warnings.push('Using default JWT secret - change this in production!')
  }

  // Check optional services
  if (!process.env.GEMINI_API_KEY) {
    warnings.push('GEMINI_API_KEY not set - AI evaluation will use fallback mode')
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    warnings.push('Razorpay credentials not set - payment features will be disabled')
  }

  if (!process.env.VAPI_PRIVATE_API_KEY) {
    warnings.push('VAPI credentials not set - voice features may be limited')
  }

  // Log results
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.error('\nPlease check your .env file and add the missing variables.')
    process.exit(1)
  }

  if (warnings.length > 0) {
    console.log('⚠️  Environment warnings:')
    warnings.forEach(warning => {
      console.log(`   - ${warning}`)
    })
    console.log('')
  }

  console.log('✅ Environment validation completed')
}

// Check if we're in development and provide helpful setup messages
export const checkDevelopmentSetup = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode detected')
    
    // Check if using default/placeholder values
    const placeholderChecks = [
      {
        key: 'JWT_SECRET',
        placeholder: 'interviewmate123',
        message: 'Using default JWT secret - change this in production!'
      },
      {
        key: 'MONGODB_URI',
        placeholder: 'mongodb://localhost:27017',
        message: 'Using local MongoDB - make sure MongoDB is running'
      }
    ]

    placeholderChecks.forEach(({ key, placeholder, message }) => {
      if (process.env[key] && process.env[key].includes(placeholder)) {
        console.log(`⚠️  ${message}`)
      }
    })
  }
}

// Default export removed - using named exports
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
  const securityIssues = []

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

  // Security validations
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      securityIssues.push('JWT_SECRET must be at least 32 characters long for security')
    }
    
    // Check for common weak secrets
    const weakSecrets = ['secret', '123456', 'password', 'interviewmate123', 'jwt_secret']
    if (weakSecrets.some(weak => process.env.JWT_SECRET.toLowerCase().includes(weak))) {
      securityIssues.push('JWT_SECRET appears to be weak or default - use a strong random secret')
    }
  }

  // Check for exposed credentials in development
  const sensitiveKeys = ['GEMINI_API_KEY', 'VAPI_PRIVATE_API_KEY', 'RAZORPAY_KEY_SECRET']
  sensitiveKeys.forEach(key => {
    if (process.env[key] && process.env[key].length < 10) {
      warnings.push(`${key} appears to be too short - verify it's correct`)
    }
  })

  // Production security checks
  if (process.env.NODE_ENV === 'production') {
    // Critical production requirements
    const productionRequired = ['CLIENT_URL', 'GEMINI_API_KEY']
    productionRequired.forEach(varName => {
      if (!process.env[varName]) {
        securityIssues.push(`${varName} is required in production`)
      }
    })
    
    if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('localhost')) {
      securityIssues.push('CLIENT_URL contains localhost in production environment')
    }
    
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      securityIssues.push('Using localhost MongoDB in production - use a proper database service')
    }
    
    // Ensure HTTPS in production
    if (process.env.CLIENT_URL && !process.env.CLIENT_URL.startsWith('https://')) {
      securityIssues.push('CLIENT_URL must use HTTPS in production')
    }
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

  if (securityIssues.length > 0) {
    console.error('🚨 SECURITY ISSUES DETECTED:')
    securityIssues.forEach(issue => {
      console.error(`   - ${issue}`)
    })
    if (process.env.NODE_ENV === 'production') {
      console.error('\nSecurity issues detected in production. Exiting for safety.')
      process.exit(1)
    } else {
      console.error('\nSecurity issues detected. Please fix before deploying to production.\n')
    }
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

// Validate security settings specifically
export const validateSecuritySettings = () => {
  const securityWarnings = []
  
  // Check for secure headers configuration
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CORS_ORIGIN) {
      securityWarnings.push('CORS_ORIGIN not set - using default CLIENT_URL')
      process.env.CORS_ORIGIN = process.env.CLIENT_URL
    }
    
    if (!process.env.RATE_LIMIT_WINDOW) {
      process.env.RATE_LIMIT_WINDOW = '900000' // 15 minutes
    }
    
    if (!process.env.RATE_LIMIT_MAX) {
      process.env.RATE_LIMIT_MAX = '100'
    }
  }
  
  // Check for security middleware configuration
  const securityEnvVars = {
    HELMET_ENABLED: 'true',
    RATE_LIMITING_ENABLED: 'true',
    CORS_ENABLED: 'true'
  }
  
  Object.entries(securityEnvVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue
    }
  })
  
  if (securityWarnings.length > 0) {
    console.log('🔒 Security configuration warnings:')
    securityWarnings.forEach(warning => {
      console.log(`   - ${warning}`)
    })
  }
  
  console.log('🔒 Security settings validated')
}

// Default export removed - using named exports
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'

// Import configuration
import { validateEnvironment, checkDevelopmentSetup } from './config/validateEnv.js'
import connectDB from './config/database.js'
import geminiService from './config/gemini.js'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import interviewRoutes from './routes/interview.js'
import paymentRoutes from './routes/payment.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'
import healthRoutes from './routes/health.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { sanitizeAll } from './middleware/sanitize.js'
import { apiLimiter, authLimiter } from './middleware/rateLimiting.js'

// Validate environment variables
validateEnvironment()
checkDevelopmentSetup()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'InterviewMate API is running',
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB()
    
    // Initialize Gemini AI
    try {
      const initialized = geminiService.initialize()
      
      if (initialized) {
        // Test Gemini connection
        const isGeminiWorking = await geminiService.testConnection()
        if (isGeminiWorking) {
          console.log('✅ Gemini AI connection verified')
        } else {
          console.log('⚠️ Gemini AI connection test failed - using fallback evaluation')
        }
      } else {
        console.log('⚠️ Gemini AI not configured - using fallback evaluation')
      }
    } catch (error) {
      console.log('⚠️ Gemini AI initialization failed - using fallback evaluation:', error.message)
    }
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
      console.log(`🌐 API URL: http://localhost:${PORT}/api`)
      console.log(`📚 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
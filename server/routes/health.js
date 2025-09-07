import express from 'express'
import mongoose from 'mongoose'
import { promisify } from 'util'
import { exec } from 'child_process'
import os from 'os'

const router = express.Router()
const execAsync = promisify(exec)

// Basic health check
router.get('/health', async (req, res) => {
  const startTime = Date.now()
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    node_version: process.version
  }

  try {
    // Database health check
    const dbStart = Date.now()
    await mongoose.connection.db.admin().ping()
    const dbTime = Date.now() - dbStart
    
    health.database = {
      status: 'connected',
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      response_time: `${dbTime}ms`,
      ready_state: mongoose.connection.readyState
    }
  } catch (error) {
    health.database = {
      status: 'disconnected',
      error: error.message
    }
    health.status = 'degraded'
  }

  // Memory usage
  const memUsage = process.memoryUsage()
  health.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
    usage_percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
  }

  // System information
  health.system = {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    total_memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
    free_memory: `${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB`,
    load_average: os.loadavg()
  }

  // Response time
  health.response_time = `${Date.now() - startTime}ms`

  const statusCode = health.status === 'ok' ? 200 : 503
  res.status(statusCode).json(health)
})

// Detailed health check (admin only)
router.get('/health/detailed', async (req, res) => {
  const startTime = Date.now()
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {}
  }

  // Database detailed check
  try {
    const dbStats = await mongoose.connection.db.stats()
    health.checks.database = {
      status: 'pass',
      collections: dbStats.collections,
      data_size: `${Math.round(dbStats.dataSize / 1024 / 1024)}MB`,
      storage_size: `${Math.round(dbStats.storageSize / 1024 / 1024)}MB`,
      indexes: dbStats.indexes,
      index_size: `${Math.round(dbStats.indexSize / 1024 / 1024)}MB`
    }
  } catch (error) {
    health.checks.database = {
      status: 'fail',
      error: error.message
    }
    health.status = 'fail'
  }

  // File system check
  try {
    const { stdout } = await execAsync('df -h /')
    const diskInfo = stdout.split('\n')[1].split(/\s+/)
    health.checks.filesystem = {
      status: 'pass',
      total: diskInfo[1],
      used: diskInfo[2],
      available: diskInfo[3],
      usage_percentage: diskInfo[4]
    }
  } catch (error) {
    health.checks.filesystem = {
      status: 'unknown',
      error: 'Unable to check disk space'
    }
  }

  // Environment variables check
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV'
  ]
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])
  health.checks.environment = {
    status: missingEnvVars.length === 0 ? 'pass' : 'fail',
    required_vars: requiredEnvVars.length,
    missing_vars: missingEnvVars
  }

  if (missingEnvVars.length > 0) {
    health.status = 'fail'
  }

  // External services check
  health.checks.external_services = {
    gemini_ai: process.env.GEMINI_API_KEY ? 'configured' : 'not_configured',
    vapi: process.env.VAPI_PRIVATE_API_KEY ? 'configured' : 'not_configured',
    razorpay: process.env.RAZORPAY_KEY_ID ? 'configured' : 'not_configured',
    email: process.env.EMAIL_HOST ? 'configured' : 'not_configured'
  }

  health.response_time = `${Date.now() - startTime}ms`

  const statusCode = health.status === 'ok' ? 200 : 503
  res.status(statusCode).json(health)
})

// Readiness probe (for Kubernetes)
router.get('/ready', async (req, res) => {
  try {
    // Check if database is ready
    await mongoose.connection.db.admin().ping()
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

// Liveness probe (for Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

export default router
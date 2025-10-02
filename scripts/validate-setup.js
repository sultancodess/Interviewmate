#!/usr/bin/env node

/**
 * InterviewMate Setup Validation Script
 * 
 * This script validates that all components of the InterviewMate platform
 * are properly configured and ready for development or production use.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
}

/**
 * Log functions with colors
 */
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  subheader: (msg) => console.log(`${colors.bright}${msg}${colors.reset}`)
}

/**
 * Check if a file exists
 */
const fileExists = (filePath) => {
  try {
    return fs.existsSync(path.resolve(rootDir, filePath))
  } catch (error) {
    return false
  }
}

/**
 * Read and parse JSON file
 */
const readJsonFile = (filePath) => {
  try {
    const fullPath = path.resolve(rootDir, filePath)
    const content = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

/**
 * Check if environment file has required variables
 */
const checkEnvFile = (filePath, requiredVars) => {
  if (!fileExists(filePath)) {
    return { exists: false, missing: requiredVars }
  }

  try {
    const content = fs.readFileSync(path.resolve(rootDir, filePath), 'utf8')
    const missing = requiredVars.filter(varName => {
      const regex = new RegExp(`^${varName}=`, 'm')
      return !regex.test(content)
    })
    
    return { exists: true, missing }
  } catch (error) {
    return { exists: false, missing: requiredVars }
  }
}

/**
 * Validate project structure
 */
const validateProjectStructure = () => {
  log.header('📁 Project Structure Validation')
  
  const requiredFiles = [
    'package.json',
    'README.md',
    '.gitignore',
    'client/package.json',
    'client/src/main.jsx',
    'client/src/App.jsx',
    'client/index.html',
    'client/vite.config.js',
    'client/tailwind.config.js',
    'server/package.json',
    'server/server.js',
    'server/models/User.js',
    'server/models/Interview.js',
    'server/routes/auth.js',
    'server/routes/interview.js',
    'server/config/database.js',
    'server/config/gemini.js'
  ]

  const requiredDirectories = [
    'client/src/components',
    'client/src/pages',
    'client/src/contexts',
    'client/src/services',
    'client/src/utils',
    'client/src/constants',
    'server/routes',
    'server/models',
    'server/middleware',
    'server/config'
  ]

  let allFilesExist = true
  let allDirsExist = true

  // Check files
  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      log.success(`${file}`)
      results.passed++
    } else {
      log.error(`Missing: ${file}`)
      results.failed++
      results.issues.push(`Missing required file: ${file}`)
      allFilesExist = false
    }
  })

  // Check directories
  requiredDirectories.forEach(dir => {
    if (fileExists(dir)) {
      log.success(`${dir}/`)
      results.passed++
    } else {
      log.error(`Missing directory: ${dir}`)
      results.failed++
      results.issues.push(`Missing required directory: ${dir}`)
      allDirsExist = false
    }
  })

  if (allFilesExist && allDirsExist) {
    log.success('All required files and directories are present')
  }
}

/**
 * Validate package.json files
 */
const validatePackageJson = () => {
  log.header('📦 Package.json Validation')
  
  // Root package.json
  const rootPkg = readJsonFile('package.json')
  if (rootPkg) {
    log.success('Root package.json is valid')
    
    // Check required scripts
    const requiredScripts = ['dev', 'build', 'start', 'install:all']
    const missingScripts = requiredScripts.filter(script => !rootPkg.scripts?.[script])
    
    if (missingScripts.length === 0) {
      log.success('All required scripts are present')
      results.passed++
    } else {
      log.error(`Missing scripts: ${missingScripts.join(', ')}`)
      results.failed++
      results.issues.push(`Missing scripts in root package.json: ${missingScripts.join(', ')}`)
    }
  } else {
    log.error('Root package.json is invalid or missing')
    results.failed++
    results.issues.push('Invalid or missing root package.json')
  }

  // Client package.json
  const clientPkg = readJsonFile('client/package.json')
  if (clientPkg) {
    log.success('Client package.json is valid')
    
    // Check required dependencies
    const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios', 'tailwindcss']
    const missingDeps = requiredDeps.filter(dep => 
      !clientPkg.dependencies?.[dep] && !clientPkg.devDependencies?.[dep]
    )
    
    if (missingDeps.length === 0) {
      log.success('All required client dependencies are present')
      results.passed++
    } else {
      log.warning(`Missing client dependencies: ${missingDeps.join(', ')}`)
      results.warnings++
    }
  } else {
    log.error('Client package.json is invalid or missing')
    results.failed++
    results.issues.push('Invalid or missing client package.json')
  }

  // Server package.json
  const serverPkg = readJsonFile('server/package.json')
  if (serverPkg) {
    log.success('Server package.json is valid')
    
    // Check required dependencies
    const requiredDeps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'cors']
    const missingDeps = requiredDeps.filter(dep => 
      !serverPkg.dependencies?.[dep] && !serverPkg.devDependencies?.[dep]
    )
    
    if (missingDeps.length === 0) {
      log.success('All required server dependencies are present')
      results.passed++
    } else {
      log.warning(`Missing server dependencies: ${missingDeps.join(', ')}`)
      results.warnings++
    }
  } else {
    log.error('Server package.json is invalid or missing')
    results.failed++
    results.issues.push('Invalid or missing server package.json')
  }
}

/**
 * Validate environment configuration
 */
const validateEnvironment = () => {
  log.header('🔧 Environment Configuration Validation')
  
  // Server environment variables
  const serverEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'VAPI_PRIVATE_API_KEY',
    'VAPI_PUBLIC_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'CLIENT_URL',
    'PORT'
  ]

  const serverEnvCheck = checkEnvFile('server/.env.example', serverEnvVars)
  if (serverEnvCheck.exists) {
    log.success('Server .env.example exists')
    if (serverEnvCheck.missing.length === 0) {
      log.success('All required server environment variables are documented')
      results.passed++
    } else {
      log.warning(`Missing server env vars in example: ${serverEnvCheck.missing.join(', ')}`)
      results.warnings++
    }
  } else {
    log.error('Server .env.example is missing')
    results.failed++
    results.issues.push('Missing server/.env.example file')
  }

  // Client environment variables
  const clientEnvVars = [
    'VITE_API_URL',
    'VITE_VAPI_PUBLIC_KEY',
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_RAZORPAY_KEY_ID'
  ]

  const clientEnvCheck = checkEnvFile('client/.env.example', clientEnvVars)
  if (clientEnvCheck.exists) {
    log.success('Client .env.example exists')
    if (clientEnvCheck.missing.length === 0) {
      log.success('All required client environment variables are documented')
      results.passed++
    } else {
      log.warning(`Missing client env vars in example: ${clientEnvCheck.missing.join(', ')}`)
      results.warnings++
    }
  } else {
    log.error('Client .env.example is missing')
    results.failed++
    results.issues.push('Missing client/.env.example file')
  }

  // Check if actual .env files exist (should not be in repo)
  if (fileExists('server/.env')) {
    log.warning('server/.env file exists - ensure it\'s in .gitignore')
    results.warnings++
  }

  if (fileExists('client/.env')) {
    log.warning('client/.env file exists - ensure it\'s in .gitignore')
    results.warnings++
  }
}

/**
 * Validate key components
 */
const validateComponents = () => {
  log.header('🧩 Component Validation')
  
  const keyComponents = [
    'client/src/components/InterviewSetup/InterviewSetupForm.jsx',
    'client/src/components/Reports/InterviewReportCard.jsx',
    'client/src/pages/Dashboard.jsx',
    'client/src/pages/InterviewSetup.jsx',
    'client/src/pages/LiveInterview.jsx',
    'client/src/pages/InterviewReport.jsx',
    'client/src/pages/InterviewHistory.jsx',
    'client/src/pages/Analytics.jsx',
    'client/src/contexts/AuthContext.jsx',
    'client/src/contexts/InterviewContext.jsx',
    'client/src/services/api.js',
    'client/src/services/vapi.js',
    'client/src/services/webSpeechService.js',
    'client/src/utils/pdfGenerator.js',
    'client/src/constants/index.js'
  ]

  keyComponents.forEach(component => {
    if (fileExists(component)) {
      log.success(`${component}`)
      results.passed++
    } else {
      log.error(`Missing: ${component}`)
      results.failed++
      results.issues.push(`Missing key component: ${component}`)
    }
  })
}

/**
 * Validate configuration files
 */
const validateConfigFiles = () => {
  log.header('⚙️ Configuration Files Validation')
  
  const configFiles = [
    'client/vite.config.js',
    'client/tailwind.config.js',
    'client/postcss.config.js',
    '.gitignore'
  ]

  configFiles.forEach(file => {
    if (fileExists(file)) {
      log.success(`${file}`)
      results.passed++
    } else {
      log.warning(`Missing: ${file}`)
      results.warnings++
    }
  })

  // Check .gitignore content
  if (fileExists('.gitignore')) {
    try {
      const gitignoreContent = fs.readFileSync(path.resolve(rootDir, '.gitignore'), 'utf8')
      const requiredEntries = ['.env', 'node_modules/', '/dist', '/build']
      const missingEntries = requiredEntries.filter(entry => !gitignoreContent.includes(entry))
      
      if (missingEntries.length === 0) {
        log.success('.gitignore has all required entries')
        results.passed++
      } else {
        log.warning(`Missing .gitignore entries: ${missingEntries.join(', ')}`)
        results.warnings++
      }
    } catch (error) {
      log.warning('Could not read .gitignore file')
      results.warnings++
    }
  }
}

/**
 * Check for common issues
 */
const checkCommonIssues = () => {
  log.header('🔍 Common Issues Check')
  
  // Check for node_modules
  if (fileExists('node_modules')) {
    log.success('Root node_modules exists')
  } else {
    log.warning('Root node_modules missing - run "npm install"')
    results.warnings++
  }

  if (fileExists('client/node_modules')) {
    log.success('Client node_modules exists')
  } else {
    log.warning('Client node_modules missing - run "npm run install:all"')
    results.warnings++
  }

  if (fileExists('server/node_modules')) {
    log.success('Server node_modules exists')
  } else {
    log.warning('Server node_modules missing - run "npm run install:all"')
    results.warnings++
  }

  // Check for build directories
  if (fileExists('client/dist')) {
    log.info('Client build directory exists')
  }

  // Check for common port conflicts
  log.info('Remember to check that ports 5173 (client) and 5001 (server) are available')
}

/**
 * Generate summary report
 */
const generateSummary = () => {
  log.header('📊 Validation Summary')
  
  console.log(`${colors.green}✓ Passed: ${results.passed}${colors.reset}`)
  console.log(`${colors.yellow}⚠ Warnings: ${results.warnings}${colors.reset}`)
  console.log(`${colors.red}✗ Failed: ${results.failed}${colors.reset}`)
  
  if (results.issues.length > 0) {
    log.subheader('\n🚨 Issues to Address:')
    results.issues.forEach((issue, index) => {
      console.log(`${colors.red}${index + 1}.${colors.reset} ${issue}`)
    })
  }

  if (results.failed === 0) {
    log.success('\n🎉 All critical validations passed! Your InterviewMate setup looks good.')
    
    if (results.warnings > 0) {
      log.warning('⚠️ Please review the warnings above for optimal setup.')
    }
    
    log.info('\n📚 Next steps:')
    log.info('1. Copy .env.example files and configure your environment variables')
    log.info('2. Run "npm run install:all" to install all dependencies')
    log.info('3. Run "npm run dev" to start the development servers')
    log.info('4. Visit http://localhost:5173 to access the application')
    
    return true
  } else {
    log.error('\n❌ Critical issues found! Please fix the errors above before proceeding.')
    
    log.info('\n🔧 Quick fixes:')
    log.info('1. Ensure all required files are present')
    log.info('2. Check package.json files for required dependencies')
    log.info('3. Create missing directories')
    log.info('4. Review the project structure')
    
    return false
  }
}

/**
 * Main validation function
 */
const main = () => {
  console.log(`${colors.bright}${colors.magenta}`)
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║                    InterviewMate Setup Validator             ║')
  console.log('║              AI-Powered Interview Practice Platform          ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  console.log(`${colors.reset}`)
  
  log.info('Starting comprehensive setup validation...\n')
  
  try {
    validateProjectStructure()
    validatePackageJson()
    validateEnvironment()
    validateComponents()
    validateConfigFiles()
    checkCommonIssues()
    
    const success = generateSummary()
    
    process.exit(success ? 0 : 1)
    
  } catch (error) {
    log.error(`Validation failed with error: ${error.message}`)
    console.error(error)
    process.exit(1)
  }
}

// Run validation
main()
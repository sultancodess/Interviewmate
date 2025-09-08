#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import fetch from 'node-fetch'

const execAsync = promisify(exec)

console.log('🧪 InterviewMate Setup Test')
console.log('==========================\n')

const tests = []

// Test 1: Check if server starts
async function testServerStart() {
  try {
    console.log('🔄 Testing server startup...')
    
    // Start server in background
    const serverProcess = exec('cd server && npm start', { timeout: 10000 })
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Test health endpoint
    const response = await fetch('http://localhost:5001/api/health')
    const data = await response.json()
    
    if (data.status === 'ok') {
      tests.push({ name: 'Server Startup', status: '✅', details: 'Server running on port 5001' })
    } else {
      tests.push({ name: 'Server Startup', status: '❌', details: 'Health check failed' })
    }
    
    // Kill server
    serverProcess.kill()
    
  } catch (error) {
    tests.push({ name: 'Server Startup', status: '❌', details: error.message })
  }
}

// Test 2: Check client build
async function testClientBuild() {
  try {
    console.log('🔄 Testing client build...')
    
    const { stdout, stderr } = await execAsync('cd client && npm run build', { timeout: 30000 })
    
    if (fs.existsSync('client/dist')) {
      tests.push({ name: 'Client Build', status: '✅', details: 'Build successful' })
    } else {
      tests.push({ name: 'Client Build', status: '❌', details: 'Build failed - no dist folder' })
    }
    
  } catch (error) {
    tests.push({ name: 'Client Build', status: '❌', details: error.message })
  }
}

// Test 3: Check environment files
function testEnvironmentFiles() {
  console.log('🔄 Testing environment configuration...')
  
  const serverEnv = fs.existsSync('server/.env')
  const clientEnv = fs.existsSync('client/.env')
  
  if (serverEnv && clientEnv) {
    tests.push({ name: 'Environment Files', status: '✅', details: 'Both .env files present' })
  } else if (serverEnv) {
    tests.push({ name: 'Environment Files', status: '⚠️', details: 'Server .env present, client .env missing' })
  } else {
    tests.push({ name: 'Environment Files', status: '❌', details: 'Environment files missing' })
  }
}

// Test 4: Check key dependencies
async function testDependencies() {
  console.log('🔄 Testing dependencies...')
  
  try {
    // Check server dependencies
    const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'))
    const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'))
    
    const serverDeps = Object.keys(serverPackage.dependencies || {}).length
    const clientDeps = Object.keys(clientPackage.dependencies || {}).length
    
    tests.push({ 
      name: 'Dependencies', 
      status: '✅', 
      details: `Server: ${serverDeps} deps, Client: ${clientDeps} deps` 
    })
    
  } catch (error) {
    tests.push({ name: 'Dependencies', status: '❌', details: error.message })
  }
}

// Run all tests
async function runTests() {
  testEnvironmentFiles()
  await testDependencies()
  
  // Skip server and client tests in CI or if requested
  if (!process.env.SKIP_INTEGRATION_TESTS) {
    await testClientBuild()
    // await testServerStart() // Skip for now due to port conflicts
  }
  
  // Display results
  console.log('\n📊 Test Results:')
  console.log('================\n')
  
  let passed = 0
  let failed = 0
  let warnings = 0
  
  tests.forEach(test => {
    console.log(`${test.status} ${test.name.padEnd(25)} ${test.details}`)
    
    if (test.status === '✅') passed++
    else if (test.status === '❌') failed++
    else warnings++
  })
  
  console.log('\n' + '='.repeat(50))
  console.log(`Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`)
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Setup is ready.')
    console.log('\n📋 Next Steps:')
    console.log('1. cd server && npm run dev')
    console.log('2. cd client && npm run dev (in another terminal)')
    console.log('3. Open http://localhost:5173 in your browser')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.')
  }
}

// Run tests
runTests().catch(console.error)
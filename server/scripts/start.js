#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import net from 'net'

const execAsync = promisify(exec)

// Function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer()
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true)
      })
      server.close()
    })
    
    server.on('error', () => {
      resolve(false)
    })
  })
}

// Function to find available port
const findAvailablePort = async (startPort = 5001) => {
  let port = startPort
  while (port < startPort + 100) {
    if (await isPortAvailable(port)) {
      return port
    }
    port++
  }
  throw new Error('No available ports found')
}

// Function to kill process on port
const killProcessOnPort = async (port) => {
  try {
    if (process.platform === 'win32') {
      // Windows
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)
      const lines = stdout.split('\n').filter(line => line.includes('LISTENING'))
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        const pid = parts[parts.length - 1]
        if (pid && pid !== '0') {
          await execAsync(`taskkill /PID ${pid} /F`)
          console.log(`✅ Killed process ${pid} on port ${port}`)
        }
      }
    } else {
      // Unix/Linux/macOS
      const { stdout } = await execAsync(`lsof -ti:${port}`)
      const pids = stdout.trim().split('\n').filter(pid => pid)
      
      for (const pid of pids) {
        await execAsync(`kill -9 ${pid}`)
        console.log(`✅ Killed process ${pid} on port ${port}`)
      }
    }
  } catch (error) {
    // Process might not exist, which is fine
    console.log(`ℹ️  No process found on port ${port}`)
  }
}

// Main startup function
const startServer = async () => {
  const desiredPort = process.env.PORT || 5001
  
  console.log('🚀 Starting InterviewMate Server...')
  console.log(`📍 Checking port ${desiredPort}...`)
  
  try {
    // Check if desired port is available
    const isAvailable = await isPortAvailable(desiredPort)
    
    if (!isAvailable) {
      console.log(`⚠️  Port ${desiredPort} is in use`)
      
      // Ask user if they want to kill the process
      const readline = await import('readline')
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      const answer = await new Promise((resolve) => {
        rl.question(`Kill process on port ${desiredPort}? (y/n): `, resolve)
      })
      
      rl.close()
      
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await killProcessOnPort(desiredPort)
        
        // Wait a moment for the port to be freed
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Check if port is now available
        if (await isPortAvailable(desiredPort)) {
          console.log(`✅ Port ${desiredPort} is now available`)
        } else {
          console.log(`❌ Port ${desiredPort} is still in use, finding alternative...`)
          const availablePort = await findAvailablePort(parseInt(desiredPort) + 1)
          process.env.PORT = availablePort.toString()
          console.log(`✅ Using port ${availablePort} instead`)
        }
      } else {
        // Find alternative port
        const availablePort = await findAvailablePort(parseInt(desiredPort) + 1)
        process.env.PORT = availablePort.toString()
        console.log(`✅ Using port ${availablePort} instead`)
      }
    } else {
      console.log(`✅ Port ${desiredPort} is available`)
    }
    
    // Start the server
    console.log('🔧 Starting server...')
    const serverProcess = exec('node server.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Server error: ${error}`)
        return
      }
      if (stderr) {
        console.error(`⚠️  Server stderr: ${stderr}`)
      }
    })
    
    serverProcess.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    
    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString())
    })
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...')
      serverProcess.kill('SIGINT')
      process.exit(0)
    })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Run the startup script
startServer().catch(console.error)
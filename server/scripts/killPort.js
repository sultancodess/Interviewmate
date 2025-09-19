import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Kill processes running on a specific port
 */
async function killPort(port = 5001) {
  try {
    console.log(`🔍 Looking for processes on port ${port}...`)
    
    // Check if port is in use
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)
    
    if (!stdout.trim()) {
      console.log(`✅ Port ${port} is not in use`)
      return
    }
    
    console.log(`📋 Found processes on port ${port}:`)
    console.log(stdout)
    
    // Extract PIDs
    const lines = stdout.split('\n').filter(line => line.includes('LISTENING'))
    const pids = new Set()
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      const pid = parts[parts.length - 1]
      if (pid && pid !== '0') {
        pids.add(pid)
      }
    }
    
    if (pids.size === 0) {
      console.log(`✅ No processes found to kill on port ${port}`)
      return
    }
    
    // Kill processes
    for (const pid of pids) {
      try {
        console.log(`🔪 Killing process ${pid}...`)
        await execAsync(`taskkill /PID ${pid} /F`)
        console.log(`✅ Process ${pid} killed successfully`)
      } catch (error) {
        console.log(`⚠️  Could not kill process ${pid}: ${error.message}`)
      }
    }
    
    console.log(`✅ Port ${port} should now be free`)
    
  } catch (error) {
    console.error(`❌ Error killing processes on port ${port}:`, error.message)
  }
}

// Get port from command line argument or use default
const port = process.argv[2] || 5001

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  killPort(port)
}

export default killPort

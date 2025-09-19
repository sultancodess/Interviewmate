import crypto from 'crypto'

/**
 * Generate a strong JWT secret for production use
 */
function generateJWTSecret() {
  // Generate a 64-character random string
  const secret = crypto.randomBytes(32).toString('hex')
  
  console.log('🔐 Generated JWT Secret:')
  console.log(`JWT_SECRET=${secret}`)
  console.log('')
  console.log('📋 Instructions:')
  console.log('1. Copy the JWT_SECRET value above')
  console.log('2. Add it to your .env file')
  console.log('3. Restart your server')
  console.log('')
  console.log('⚠️  IMPORTANT: Keep this secret secure and never commit it to version control!')
  
  return secret
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateJWTSecret()
}

export default generateJWTSecret

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const setupAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@interviewmate.com' },
        { isAdmin: true }
      ]
    })

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists')
      console.log(`Admin email: ${existingAdmin.email}`)
      process.exit(0)
    }

    // Create admin user
    const adminData = {
      name: 'InterviewMate Admin',
      email: 'admin@interviewmate.com',
      password: 'admin123456', // Change this in production!
      isAdmin: true,
      emailVerified: true,
      subscription: {
        plan: 'pro',
        vapiMinutesRemaining: 10000,
        payAsYouGoBalance: 1000
      }
    }

    const admin = await User.create(adminData)
    
    console.log('🎉 Admin user created successfully!')
    console.log(`Email: ${admin.email}`)
    console.log(`Password: admin123456`)
    console.log('⚠️ IMPORTANT: Change the admin password after first login!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting up admin:', error)
    process.exit(1)
  }
}

setupAdmin()
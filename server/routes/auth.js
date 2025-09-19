import express from 'express'
import crypto from 'crypto'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { protect, sendTokenResponse } from '../middleware/auth.js'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../config/email.js'
import { validateRegistration, validateLogin, handleValidationErrors } from '../middleware/validation.js'
import { authLimiter } from '../middleware/rateLimiting.js'

const router = express.Router()

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authLimiter, validateRegistration, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    })

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user).catch(error => {
      console.error('Failed to send welcome email:', error)
    })

    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authLimiter, validateLogin, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
})

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      })
    }

    // Import Google Auth Library
    const { OAuth2Client } = await import('google-auth-library')
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    // Verify the Google credential
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential'
      })
    }

    const googleUserData = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      profilePicture: payload.picture,
      emailVerified: payload.email_verified
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUserData.email },
        { googleId: googleUserData.googleId }
      ]
    })

    if (user) {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleUserData.googleId
        user.profilePicture = user.profilePicture || googleUserData.profilePicture
        user.emailVerified = true
        await user.save()
      }
    } else {
      // Create new user
      user = await User.create({
        name: googleUserData.name,
        email: googleUserData.email,
        googleId: googleUserData.googleId,
        profilePicture: googleUserData.profilePicture,
        emailVerified: true
      })

      // Send welcome email (don't wait for it)
      sendWelcomeEmail(user).catch(error => {
        console.error('Failed to send welcome email:', error)
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    console.error('Google OAuth error:', error)
    
    if (error.message.includes('Token used too early') || error.message.includes('Invalid token')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential'
      })
    }
    
    next(error)
  }
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  })
})

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email',
        errors: errors.array()
      })
    }

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Hash token and set to resetPasswordToken field
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    // Set expire time (10 minutes)
    user.passwordResetToken = hashedToken
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000
    
    await user.save({ validateBeforeSave: false })

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    try {
      await sendPasswordResetEmail(user, resetUrl)
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      })
    } catch (error) {
      console.error('Email send error:', error)
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })
      
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      })
    }
  } catch (error) {
    next(error)
  }
})

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        errors: errors.array()
      })
    }

    // Get hashed token
    const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Set new password
    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
})

export default router
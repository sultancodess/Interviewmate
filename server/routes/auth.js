import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { protect, sendTokenResponse } from '../middleware/auth.js'

const router = express.Router()

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res, next) => {
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

    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res, next) => {
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

    // In a real implementation, you would verify the Google credential
    // For now, we'll simulate the process
    
    // This is a placeholder - in production, you'd use Google's OAuth library
    // to verify the credential and extract user information
    
    // Simulated user data (replace with actual Google OAuth verification)
    const googleUserData = {
      googleId: 'google_user_id',
      email: 'user@example.com',
      name: 'Google User',
      profilePicture: 'https://example.com/avatar.jpg'
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUserData.email },
        { googleId: googleUserData.googleId }
      ]
    })

    if (user) {
      // Update existing user
      if (!user.googleId) {
        user.googleId = googleUserData.googleId
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
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      })
    }

    // In a real implementation, you would:
    // 1. Generate a reset token
    // 2. Save it to the user document
    // 3. Send an email with the reset link
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    })
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

    // In a real implementation, you would verify the reset token
    // For now, we'll return a success message
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    })
  } catch (error) {
    next(error)
  }
})

export default router
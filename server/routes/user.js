import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
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

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const allowedUpdates = ['name', 'profilePicture']
    const updates = {}

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key]
      }
    })

    // Handle email update separately (requires verification in production)
    if (req.body.email && req.body.email !== req.user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: req.user.id }
      })
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        })
      }
      
      updates.email = req.body.email
      updates.emailVerified = false // Would require re-verification
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
router.put('/preferences', protect, [
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be light or dark'),
  body('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Invalid language code')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { theme, notifications, language } = req.body
    const updates = {}

    if (theme) updates['preferences.theme'] = theme
    if (language) updates['preferences.language'] = language
    if (notifications) {
      if (notifications.email !== undefined) {
        updates['preferences.notifications.email'] = notifications.email
      }
      if (notifications.push !== undefined) {
        updates['preferences.notifications.push'] = notifications.push
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user subscription details
// @route   GET /api/user/subscription
// @access  Private
router.get('/subscription', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.status(200).json({
      success: true,
      subscription: user.subscription,
      stats: user.stats
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Update user subscription
// @route   PUT /api/user/subscription
// @access  Private
router.put('/subscription', protect, [
  body('plan')
    .isIn(['free', 'pro', 'enterprise'])
    .withMessage('Invalid subscription plan'),
  body('minutesRemaining')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minutes remaining must be a positive number')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { plan, minutesRemaining, stripeCustomerId, stripeSubscriptionId } = req.body
    const updates = {}

    if (plan) {
      updates['subscription.plan'] = plan
      
      // Set default minutes based on plan
      if (plan === 'pro' && !minutesRemaining) {
        updates['subscription.minutesRemaining'] = 1000 // Pro plan gets 1000 minutes
      } else if (plan === 'enterprise' && !minutesRemaining) {
        updates['subscription.minutesRemaining'] = 5000 // Enterprise gets 5000 minutes
      }
    }

    if (minutesRemaining !== undefined) {
      updates['subscription.minutesRemaining'] = minutesRemaining
    }

    if (stripeCustomerId) {
      updates['subscription.stripeCustomerId'] = stripeCustomerId
    }

    if (stripeSubscriptionId) {
      updates['subscription.stripeSubscriptionId'] = stripeSubscriptionId
    }

    // Update renewal date
    if (plan && plan !== 'free') {
      const renewalDate = new Date()
      renewalDate.setMonth(renewalDate.getMonth() + 1)
      updates['subscription.renewalDate'] = renewalDate
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      subscription: user.subscription
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Change password
// @route   PUT /api/user/password
// @access  Private
router.put('/password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', protect, [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account',
        errors: errors.array()
      })
    }

    const { password } = req.body

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')

    // Verify password (skip for Google OAuth users)
    if (user.password) {
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect'
        })
      }
    }

    // Soft delete - deactivate account
    user.isActive = false
    user.email = `deleted_${Date.now()}_${user.email}`
    await user.save()

    // In production, you might want to:
    // 1. Cancel any active subscriptions
    // 2. Delete or anonymize user data
    // 3. Send confirmation email

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user dashboard stats
// @route   GET /api/user/stats
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    // Calculate additional stats
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Get this month's interview count (would require Interview model import)
    // For now, return basic stats
    
    const stats = {
      ...user.stats,
      subscription: user.subscription,
      joinDate: user.createdAt,
      lastActive: user.updatedAt
    }

    res.status(200).json({
      success: true,
      stats
    })
  } catch (error) {
    next(error)
  }
})

export default router
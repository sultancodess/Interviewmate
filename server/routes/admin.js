import express from 'express'
import mongoose from 'mongoose'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Interview from '../models/Interview.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    // Check if user is admin (you can modify this logic)
    if (user.email !== 'admin@interviewmate.com' && !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      })
    }
    
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking admin privileges'
    })
  }
}

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, isAdmin, async (req, res) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Basic counts
    const totalUsers = await User.countDocuments()
    const totalInterviews = await Interview.countDocuments()
    const activeUsers = await User.countDocuments({ 
      updatedAt: { $gte: thirtyDaysAgo }
    })
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Revenue calculation
    const revenueData = await User.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$subscription.payAsYouGoBalance' },
          proUsers: {
            $sum: { $cond: [{ $eq: ['$subscription.plan', 'pro'] }, 1, 0] }
          }
        }
      }
    ])

    // Interview statistics
    const interviewStats = await Interview.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgScore: { $avg: '$evaluation.overallScore' }
        }
      }
    ])

    // Daily user registrations (last 30 days)
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Daily interviews (last 30 days)
    const dailyInterviews = await Interview.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Top performing users
    const topUsers = await User.aggregate([
      {
        $match: {
          'stats.totalInterviews': { $gt: 0 }
        }
      },
      {
        $sort: { 'stats.averageScore': -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: 1,
          email: 1,
          'stats.totalInterviews': 1,
          'stats.averageScore': 1,
          'subscription.plan': 1
        }
      }
    ])

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalInterviews,
          activeUsers,
          newUsersThisMonth,
          totalRevenue: revenueData[0]?.totalRevenue || 0,
          proUsers: revenueData[0]?.proUsers || 0
        },
        interviewStats,
        dailyRegistrations,
        dailyInterviews,
        topUsers
      }
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    })
  }
})

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    const search = req.query.search || ''
    const plan = req.query.plan || ''
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    // Build filter
    const filter = {}
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (plan) {
      filter['subscription.plan'] = plan
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await User.countDocuments(filter)

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin users fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
})

// @desc    Get all interviews with pagination and filters
// @route   GET /api/admin/interviews
// @access  Private (Admin only)
router.get('/interviews', protect, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    const type = req.query.type || ''
    const status = req.query.status || ''
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    // Build filter
    const filter = {}
    
    if (type) {
      filter.type = type
    }
    
    if (status) {
      filter.status = status
    }

    const interviews = await Interview.find(filter)
      .populate('userId', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Interview.countDocuments(filter)

    res.status(200).json({
      success: true,
      interviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin interviews fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message
    })
  }
})

// @desc    Update user subscription
// @route   PUT /api/admin/users/:id/subscription
// @access  Private (Admin only)
router.put('/users/:id/subscription', protect, isAdmin, [
  body('plan').isIn(['free', 'pro']).withMessage('Invalid plan'),
  body('vapiMinutesRemaining').optional().isInt({ min: 0 }).withMessage('Invalid minutes'),
  body('payAsYouGoBalance').optional().isFloat({ min: 0 }).withMessage('Invalid balance')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { id } = req.params
    const { plan, vapiMinutesRemaining, payAsYouGoBalance } = req.body

    const updateData = {}
    if (plan) updateData['subscription.plan'] = plan
    if (vapiMinutesRemaining !== undefined) updateData['subscription.vapiMinutesRemaining'] = vapiMinutesRemaining
    if (payAsYouGoBalance !== undefined) updateData['subscription.payAsYouGoBalance'] = payAsYouGoBalance

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'User subscription updated successfully',
      user
    })
  } catch (error) {
    console.error('Admin user update error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user subscription',
      error: error.message
    })
  }
})

// @desc    Delete user account (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    // Don't allow deleting admin users
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.email === 'admin@interviewmate.com' || user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      })
    }

    // Soft delete - deactivate account
    await User.findByIdAndUpdate(id, {
      isActive: false,
      email: `deleted_${Date.now()}_${user.email}`
    })

    // Also delete user's interviews
    await Interview.deleteMany({ userId: id })

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    })
  } catch (error) {
    console.error('Admin user delete error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account',
      error: error.message
    })
  }
})

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private (Admin only)
router.get('/health', protect, isAdmin, async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    // Check various system components
    const health = {
      database: {
        status: dbStatus,
        collections: {
          users: await User.countDocuments(),
          interviews: await Interview.countDocuments()
        }
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      environment: process.env.NODE_ENV || 'development'
    }

    res.status(200).json({
      success: true,
      health
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    })
  }
})

// @desc    Create admin user (one-time setup)
// @route   POST /api/admin/setup
// @access  Public (only works if no admin exists)
router.post('/setup', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required')
], async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@interviewmate.com' },
        { isAdmin: true }
      ]
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      })
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password, name } = req.body

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      isAdmin: true,
      subscription: {
        plan: 'pro',
        vapiMinutesRemaining: 10000,
        payAsYouGoBalance: 1000
      }
    })

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email
      }
    })
  } catch (error) {
    console.error('Admin setup error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user',
      error: error.message
    })
  }
})

export default router
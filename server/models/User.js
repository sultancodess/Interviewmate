import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free'
    },
    vapiMinutesRemaining: {
      type: Number,
      default: 30 // Free plan starts with 30 VAPI minutes
    },
    vapiMinutesUsed: {
      type: Number,
      default: 0
    },
    payAsYouGoBalance: {
      type: Number,
      default: 0 // For Pro plan pay-as-you-go credits
    },
    renewalDate: {
      type: Date,
      default: () => {
        const date = new Date()
        date.setMonth(date.getMonth() + 1)
        return date
      }
    },
    razorpayCustomerId: String,
    razorpaySubscriptionId: String,
    lastPayment: {
      amount: Number,
      date: Date,
      razorpayPaymentId: String,
      status: String
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  stats: {
    totalInterviews: {
      type: Number,
      default: 0
    },
    totalMinutesUsed: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    lastInterviewDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
})

// Create indexes for better query performance
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ googleId: 1 }, { unique: true, sparse: true })
userSchema.index({ createdAt: -1 })
userSchema.index({ isActive: 1 })
userSchema.index({ 'subscription.plan': 1 })
userSchema.index({ 'stats.lastInterviewDate': -1 })

// Compound indexes for common queries
userSchema.index({ email: 1, isActive: 1 })
userSchema.index({ 'subscription.plan': 1, isActive: 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

// Update user stats
userSchema.methods.updateStats = function(interviewData) {
  this.stats.totalInterviews += 1
  this.stats.totalMinutesUsed += interviewData.duration || 0
  this.stats.lastInterviewDate = new Date()
  
  // Calculate new average score
  if (interviewData.score) {
    const totalScore = (this.stats.averageScore * (this.stats.totalInterviews - 1)) + interviewData.score
    this.stats.averageScore = Math.round(totalScore / this.stats.totalInterviews)
  }
  
  // Handle minute deduction based on interview mode
  if (interviewData.duration && interviewData.mode === 'vapi') {
    if (this.subscription.plan === 'free') {
      // Deduct from free VAPI minutes
      this.subscription.vapiMinutesRemaining = Math.max(0, this.subscription.vapiMinutesRemaining - interviewData.duration)
    } else if (this.subscription.plan === 'pro') {
      // Deduct from pay-as-you-go balance (at $0.50 per minute)
      const cost = interviewData.duration * 0.5
      this.subscription.payAsYouGoBalance = Math.max(0, this.subscription.payAsYouGoBalance - cost)
    }
    this.subscription.vapiMinutesUsed += interviewData.duration
  }
  // Web Speech API is always free and unlimited
}

// Generate profile picture URL
userSchema.virtual('avatarUrl').get(function() {
  if (this.profilePicture) {
    return this.profilePicture
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=3b82f6&color=fff`
})

// Transform JSON output
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password
    delete ret.emailVerificationToken
    delete ret.passwordResetToken
    delete ret.passwordResetExpires
    return ret
  }
})

const User = mongoose.model('User', userSchema)

export default User
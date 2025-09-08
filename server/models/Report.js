import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    unique: true,
    index: true
  },
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  data: {
    candidateInfo: {
      name: String,
      role: String,
      company: String,
      experience: String
    },
    interviewDetails: {
      type: String,
      duration: Number,
      difficulty: String,
      date: Date
    },
    evaluation: {
      overallScore: Number,
      skillScores: {
        communication: Number,
        technicalKnowledge: Number,
        problemSolving: Number,
        confidence: Number,
        clarity: Number,
        behavioral: Number
      },
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
      detailedFeedback: String,
      badges: [String]
    },
    analytics: {
      speakingTime: Number,
      pauseCount: Number,
      averagePauseLength: Number,
      wordsPerMinute: Number,
      sentimentScore: Number,
      keywordMatches: [String]
    }
  },
  files: {
    pdf: {
      url: String,
      path: String,
      size: Number,
      generatedAt: Date
    },
    json: {
      url: String,
      path: String,
      size: Number,
      generatedAt: Date
    }
  },
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    sharedOn: [{
      platform: {
        type: String,
        enum: ['linkedin', 'twitter', 'facebook', 'email']
      },
      sharedAt: Date,
      url: String
    }],
    views: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  },
  metadata: {
    generatedBy: {
      type: String,
      default: 'system'
    },
    version: {
      type: String,
      default: '1.0'
    },
    template: {
      type: String,
      default: 'standard'
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
reportSchema.index({ userId: 1, createdAt: -1 })
reportSchema.index({ status: 1 })

// Generate unique report ID
reportSchema.pre('save', function(next) {
  if (!this.reportId) {
    this.reportId = `report_${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  next()
})

// Generate public slug for sharing
reportSchema.methods.generatePublicSlug = function() {
  if (!this.sharing.publicSlug) {
    this.sharing.publicSlug = `${this.data.candidateInfo.name.toLowerCase().replace(/\s+/g, '-')}-${this.data.candidateInfo.role.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    this.sharing.isPublic = true
  }
  return this.sharing.publicSlug
}

// Method to increment view count
reportSchema.methods.incrementViews = function() {
  this.sharing.views += 1
  this.sharing.lastViewed = new Date()
  return this.save()
}

// Virtual for performance grade
reportSchema.virtual('performanceGrade').get(function() {
  if (!this.data.evaluation.overallScore) return 'N/A'
  
  const score = this.data.evaluation.overallScore
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  return 'D'
})

// Transform JSON output
reportSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Don't expose sensitive data in public API
    if (!ret.sharing?.isPublic) {
      delete ret.files?.pdf?.path
      delete ret.files?.json?.path
    }
    return ret
  }
})

const Report = mongoose.model('Report', reportSchema)

export default Report
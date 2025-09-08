import mongoose from 'mongoose'

const ledgerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  category: {
    type: String,
    enum: ['purchase', 'usage', 'refund', 'bonus', 'monthly_credit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  minutes: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Payment', 'Interview', 'User']
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  metadata: {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    source: {
      type: String,
      default: 'system'
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
ledgerSchema.index({ userId: 1, createdAt: -1 })
ledgerSchema.index({ type: 1 })
ledgerSchema.index({ category: 1 })

// Static method to get user balance
ledgerSchema.statics.getUserBalance = async function(userId) {
  const result = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalCredits: {
          $sum: {
            $cond: [{ $eq: ['$type', 'credit'] }, '$minutes', 0]
          }
        },
        totalDebits: {
          $sum: {
            $cond: [{ $eq: ['$type', 'debit'] }, '$minutes', 0]
          }
        }
      }
    }
  ])
  
  if (result.length === 0) return 0
  return result[0].totalCredits - result[0].totalDebits
}

// Static method to add credit
ledgerSchema.statics.addCredit = async function(userId, minutes, category, description, relatedId = null, relatedModel = null) {
  const transactionId = `credit_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const currentBalance = await this.getUserBalance(userId)
  const newBalance = currentBalance + minutes
  
  return await this.create({
    userId,
    transactionId,
    type: 'credit',
    category,
    amount: minutes * 0.5, // Assuming $0.50 per minute
    minutes,
    description,
    relatedId,
    relatedModel,
    balanceAfter: newBalance
  })
}

// Static method to add debit
ledgerSchema.statics.addDebit = async function(userId, minutes, category, description, relatedId = null, relatedModel = null) {
  const transactionId = `debit_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const currentBalance = await this.getUserBalance(userId)
  
  if (currentBalance < minutes) {
    throw new Error('Insufficient balance')
  }
  
  const newBalance = currentBalance - minutes
  
  return await this.create({
    userId,
    transactionId,
    type: 'debit',
    category,
    amount: minutes * 0.5, // Assuming $0.50 per minute
    minutes,
    description,
    relatedId,
    relatedModel,
    balanceAfter: newBalance
  })
}

const Ledger = mongoose.model('Ledger', ledgerSchema)

export default Ledger
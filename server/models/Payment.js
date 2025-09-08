import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String,
    required: true
  },
  razorpaySignature: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  plan: {
    type: String,
    enum: ['pro', 'enterprise'],
    required: true
  },
  minutesAdded: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      default: 'web'
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
paymentSchema.index({ userId: 1, createdAt: -1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ razorpayPaymentId: 1 })

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
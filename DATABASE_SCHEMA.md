# InterviewMate - Database Schema & Design

## 🗄️ Database Overview

InterviewMate uses MongoDB as its primary database, designed for scalability, flexibility, and performance. The schema is optimized for the interview practice workflow and supports complex queries for analytics and reporting.

## 📊 Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │────▶│ Interviews  │────▶│   Reports   │
│             │     │             │     │             │
│ - _id       │     │ - _id       │     │ - _id       │
│ - email     │     │ - userId    │     │ - interviewId│
│ - name      │     │ - type      │     │ - reportData│
│ - password  │     │ - status    │     │ - pdfUrl    │
│ - googleId  │     │ - candidate │     │ - publicUrl │
│ - subscription│   │ - config    │     │ - shareCount│
│ - preferences│    │ - session   │     └─────────────┘
│ - stats     │     │ - evaluation│
│ - isActive  │     │ - analytics │
└─────────────┘     │ - feedback  │
        │           └─────────────┘
        │                  │
        ▼                  ▼
┌─────────────┐     ┌─────────────┐
│  Payments   │     │   Ledger    │
│             │     │             │
│ - _id       │     │ - _id       │
│ - userId    │     │ - userId    │
│ - razorpayId│     │ - type      │
│ - amount    │     │ - amount    │
│ - status    │     │ - description│
│ - planType  │     │ - balances  │
└─────────────┘     └─────────────┘
```

## 📋 Collection Schemas

### 1. Users Collection

**Purpose**: Store user account information, subscription details, and preferences.

```javascript
{
  // Primary Identification
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john.doe@example.com", // Unique index
  password: "$2b$12$hashedPasswordString", // bcrypt hashed
  googleId: "google_oauth_id_string", // Sparse unique index
  profilePicture: "https://example.com/avatar.jpg",
  
  // Subscription Management
  subscription: {
    plan: "free", // enum: ['free', 'pro', 'enterprise']
    vapiMinutesRemaining: 30,
    vapiMinutesUsed: 0,
    payAsYouGoBalance: 0.00, // For pro plan credits
    renewalDate: ISODate("2024-02-01T00:00:00Z"),
    razorpayCustomerId: "cust_razorpay_id",
    razorpaySubscriptionId: "sub_razorpay_id",
    lastPayment: {
      amount: 49900, // in paise
      date: ISODate("2024-01-01T10:30:00Z"),
      razorpayPaymentId: "pay_razorpay_id",
      status: "paid"
    }
  },
  
  // User Preferences
  preferences: {
    theme: "light", // enum: ['light', 'dark']
    notifications: {
      email: true,
      push: true
    },
    language: "en" // ISO language code
  },
  
  // User Statistics (calculated fields)
  stats: {
    totalInterviews: 15,
    totalMinutesUsed: 450,
    averageScore: 78.5,
    lastInterviewDate: ISODate("2024-01-15T14:30:00Z")
  },
  
  // Account Status
  isActive: true,
  isAdmin: false,
  emailVerified: true,
  
  // Security Fields
  emailVerificationToken: "verification_token_string",
  passwordResetToken: "reset_token_string",
  passwordResetExpires: ISODate("2024-01-02T10:30:00Z"),
  
  // Timestamps
  createdAt: ISODate("2024-01-01T10:00:00Z"),
  updatedAt: ISODate("2024-01-15T14:30:00Z")
}
```

**Indexes:**
```javascript
// Primary indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true })

// Query optimization indexes
db.users.createIndex({ createdAt: -1 })
db.users.createIndex({ isActive: 1 })
db.users.createIndex({ "subscription.plan": 1 })
db.users.createIndex({ "stats.lastInterviewDate": -1 })

// Compound indexes for common queries
db.users.createIndex({ email: 1, isActive: 1 })
db.users.createIndex({ "subscription.plan": 1, isActive: 1 })
```

### 2. Interviews Collection

**Purpose**: Store complete interview data including configuration, session details, and evaluation results.

```javascript
{
  // Primary Identification
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Reference to Users
  type: "technical", // enum: ['hr', 'technical', 'managerial', 'custom']
  status: "completed", // enum: ['created', 'in_progress', 'completed', 'cancelled']
  
  // Candidate Information
  candidateInfo: {
    name: "John Doe",
    role: "Senior Software Engineer",
    company: "Google",
    experience: "senior", // enum: ['fresher', 'mid-level', 'senior', 'executive']
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    resume: {
      filename: "john_doe_resume.pdf",
      path: "/uploads/resumes/507f1f77bcf86cd799439012_resume.pdf",
      uploadDate: ISODate("2024-01-15T10:00:00Z")
    },
    jobDescription: {
      filename: "google_swe_jd.pdf",
      path: "/uploads/jds/507f1f77bcf86cd799439012_jd.pdf",
      uploadDate: ISODate("2024-01-15T10:05:00Z")
    }
  },
  
  // Interview Configuration
  configuration: {
    duration: 30, // minutes
    difficulty: "medium", // enum: ['easy', 'medium', 'hard']
    topics: ["System Design", "Algorithms", "JavaScript"],
    customTopics: ["React Hooks", "GraphQL"],
    customQuestions: [
      "Explain the virtual DOM in React",
      "How would you optimize a slow database query?"
    ],
    jobDescription: "We are looking for a Senior Software Engineer...",
    language: "en",
    interviewMode: "vapi", // enum: ['webspeech', 'vapi']
    numQuestions: 12
  },
  
  // VAPI Configuration (for voice interviews)
  vapiConfig: {
    assistantId: "33589d74-e3de-409e-bc7c-1ed23c258121",
    callId: "call_vapi_id_string",
    firstMessage: "Good morning, John! I'm Alex, your technical interviewer...",
    systemPrompt: "You are Alex, an expert AI interviewer...",
    voice: {
      provider: "elevenlabs",
      voiceId: "josh"
    }
  },
  
  // Interview Session Data
  session: {
    startTime: ISODate("2024-01-15T14:00:00Z"),
    endTime: ISODate("2024-01-15T14:28:00Z"),
    actualDuration: 28, // minutes
    transcript: "Interviewer: Good morning, John! Tell me about yourself...\nCandidate: Thank you for having me. I'm a senior software engineer...",
    recording: {
      url: "https://recordings.vapi.ai/call_recording.mp3",
      duration: 1680 // seconds
    }
  },
  
  // AI Evaluation Results
  evaluation: {
    overallScore: 85, // 0-100
    skillScores: {
      communication: 88,
      technicalKnowledge: 82,
      problemSolving: 87,
      confidence: 85,
      clarity: 89,
      behavioral: 83
    },
    strengths: [
      "Excellent communication skills",
      "Strong problem-solving approach",
      "Good understanding of system design principles"
    ],
    weaknesses: [
      "Could improve knowledge of advanced algorithms",
      "Needs more experience with microservices architecture"
    ],
    recommendations: [
      "Practice more algorithm problems on LeetCode",
      "Study microservices design patterns",
      "Work on explaining complex concepts more simply"
    ],
    detailedFeedback: "John demonstrated strong technical knowledge and excellent communication skills throughout the interview. His approach to problem-solving was methodical and well-structured...",
    badges: ["Excellent Communicator", "Problem Solver", "Technical Expert"],
    evaluatedAt: ISODate("2024-01-15T14:30:00Z"),
    evaluationModel: "gemini-1.5-flash"
  },
  
  // Interview Analytics
  analytics: {
    speakingTime: 65, // percentage of time candidate spoke
    pauseCount: 12,
    averagePauseLength: 2.3, // seconds
    wordsPerMinute: 145,
    sentimentScore: 0.7, // -1 to 1
    keywordMatches: ["react", "javascript", "algorithm", "system design"]
  },
  
  // User Feedback
  feedback: {
    userRating: 5, // 1-5 stars
    userComments: "Great interview experience! The AI interviewer was very realistic.",
    reportGenerated: true,
    reportUrl: "https://reports.interviewmate.com/507f1f77bcf86cd799439012.pdf",
    sharedOn: ["linkedin", "twitter"]
  },
  
  // Metadata
  metadata: {
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    deviceType: "desktop",
    browserInfo: "Chrome 120.0.0.0"
  },
  
  // Timestamps
  createdAt: ISODate("2024-01-15T13:45:00Z"),
  updatedAt: ISODate("2024-01-15T14:30:00Z")
}
```

**Indexes:**
```javascript
// Primary indexes
db.interviews.createIndex({ userId: 1, createdAt: -1 })
db.interviews.createIndex({ type: 1 })
db.interviews.createIndex({ status: 1 })

// Performance indexes
db.interviews.createIndex({ "evaluation.overallScore": -1 })
db.interviews.createIndex({ userId: 1, status: 1 })
db.interviews.createIndex({ userId: 1, type: 1 })

// Analytics indexes
db.interviews.createIndex({ "session.startTime": -1 })
db.interviews.createIndex({ "configuration.interviewMode": 1 })
```

### 3. Payments Collection

**Purpose**: Track all payment transactions and subscription changes.

```javascript
{
  // Primary Identification
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Reference to Users
  
  // Razorpay Integration
  razorpayOrderId: "order_razorpay_id_string", // Unique index
  razorpayPaymentId: "pay_razorpay_id_string", // Unique sparse index
  razorpaySignature: "signature_string_for_verification",
  
  // Payment Details
  amount: 49900, // in paise (₹499.00)
  currency: "INR",
  status: "paid", // enum: ['created', 'paid', 'failed', 'refunded']
  
  // Plan Information
  planType: "minutes", // enum: ['minutes', 'subscription']
  minutesPurchased: 100, // VAPI minutes purchased
  
  // Additional Data
  metadata: {
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  
  // Timestamps
  createdAt: ISODate("2024-01-15T12:00:00Z"),
  updatedAt: ISODate("2024-01-15T12:05:00Z")
}
```

**Indexes:**
```javascript
// Primary indexes
db.payments.createIndex({ userId: 1, createdAt: -1 })
db.payments.createIndex({ razorpayOrderId: 1 }, { unique: true })
db.payments.createIndex({ razorpayPaymentId: 1 }, { unique: true, sparse: true })

// Query indexes
db.payments.createIndex({ status: 1 })
db.payments.createIndex({ planType: 1 })
```

### 4. Reports Collection

**Purpose**: Store generated interview reports and sharing information.

```javascript
{
  // Primary Identification
  _id: ObjectId("507f1f77bcf86cd799439014"),
  interviewId: ObjectId("507f1f77bcf86cd799439012"), // Reference to Interviews
  userId: ObjectId("507f1f77bcf86cd799439011"), // Reference to Users
  
  // Report Data (denormalized for performance)
  reportData: {
    candidateInfo: {
      name: "John Doe",
      role: "Senior Software Engineer",
      company: "Google"
    },
    interviewType: "technical",
    interviewDate: ISODate("2024-01-15T14:00:00Z"),
    duration: 28,
    overallScore: 85,
    performanceGrade: "A",
    skillBreakdown: {
      communication: 88,
      technicalKnowledge: 82,
      problemSolving: 87,
      confidence: 85,
      clarity: 89,
      behavioral: 83
    },
    strengths: [
      "Excellent communication skills",
      "Strong problem-solving approach"
    ],
    weaknesses: [
      "Could improve knowledge of advanced algorithms"
    ],
    recommendations: [
      "Practice more algorithm problems on LeetCode",
      "Study microservices design patterns"
    ],
    badges: ["Excellent Communicator", "Problem Solver", "Technical Expert"]
  },
  
  // File Storage
  pdfUrl: "https://storage.interviewmate.com/reports/507f1f77bcf86cd799439014.pdf",
  publicUrl: "https://reports.interviewmate.com/public/abc123def456", // Shareable link
  
  // Sharing Analytics
  shareCount: 3,
  sharedPlatforms: ["linkedin", "twitter", "email"],
  
  // Timestamps
  createdAt: ISODate("2024-01-15T14:35:00Z"),
  updatedAt: ISODate("2024-01-15T15:00:00Z")
}
```

**Indexes:**
```javascript
// Primary indexes
db.reports.createIndex({ interviewId: 1 }, { unique: true })
db.reports.createIndex({ userId: 1, createdAt: -1 })

// Sharing indexes
db.reports.createIndex({ publicUrl: 1 }, { sparse: true })
db.reports.createIndex({ shareCount: -1 })
```

### 5. Ledger Collection

**Purpose**: Maintain an immutable audit trail of all balance changes and transactions.

```javascript
{
  // Primary Identification
  _id: ObjectId("507f1f77bcf86cd799439015"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Reference to Users
  
  // Transaction Details
  transactionType: "credit", // enum: ['credit', 'debit', 'refund']
  amount: 100, // minutes or money amount
  description: "Purchased 100 VAPI minutes",
  
  // Related Records
  relatedPaymentId: ObjectId("507f1f77bcf86cd799439013"),
  relatedInterviewId: null, // ObjectId when minutes are used
  
  // Balance Tracking
  balanceBefore: 30, // minutes before transaction
  balanceAfter: 130, // minutes after transaction
  
  // Metadata
  metadata: {
    paymentMethod: "razorpay",
    planType: "minutes"
  },
  
  // Timestamp (immutable)
  createdAt: ISODate("2024-01-15T12:05:00Z")
}
```

**Indexes:**
```javascript
// Primary indexes
db.ledger.createIndex({ userId: 1, createdAt: -1 })
db.ledger.createIndex({ transactionType: 1 })

// Reference indexes
db.ledger.createIndex({ relatedPaymentId: 1 }, { sparse: true })
db.ledger.createIndex({ relatedInterviewId: 1 }, { sparse: true })
```

## 🔍 Query Patterns & Optimization

### Common Query Patterns

#### 1. User Dashboard Queries
```javascript
// Get user with subscription info
db.users.findOne({ _id: userId })

// Get recent interviews for dashboard
db.interviews.find({ 
  userId: userId, 
  status: "completed" 
}).sort({ createdAt: -1 }).limit(5)

// Get user analytics
db.interviews.aggregate([
  { $match: { userId: userId, status: "completed" } },
  { $group: {
    _id: null,
    totalInterviews: { $sum: 1 },
    averageScore: { $avg: "$evaluation.overallScore" },
    totalMinutes: { $sum: "$session.actualDuration" }
  }}
])
```

#### 2. Interview History Queries
```javascript
// Paginated interview history with filters
db.interviews.find({
  userId: userId,
  type: { $in: ["hr", "technical"] },
  "evaluation.overallScore": { $gte: 70 },
  createdAt: { 
    $gte: ISODate("2024-01-01"), 
    $lte: ISODate("2024-01-31") 
  }
}).sort({ createdAt: -1 }).skip(20).limit(10)
```

#### 3. Analytics Queries
```javascript
// Performance trend over time
db.interviews.aggregate([
  { $match: { 
    userId: userId, 
    status: "completed",
    createdAt: { $gte: ISODate("2024-01-01") }
  }},
  { $group: {
    _id: { 
      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
    },
    averageScore: { $avg: "$evaluation.overallScore" },
    count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])

// Skill progression analysis
db.interviews.aggregate([
  { $match: { userId: userId, status: "completed" } },
  { $group: {
    _id: null,
    avgCommunication: { $avg: "$evaluation.skillScores.communication" },
    avgTechnical: { $avg: "$evaluation.skillScores.technicalKnowledge" },
    avgProblemSolving: { $avg: "$evaluation.skillScores.problemSolving" }
  }}
])
```

#### 4. Payment & Ledger Queries
```javascript
// Get user's payment history
db.payments.find({ 
  userId: userId, 
  status: "paid" 
}).sort({ createdAt: -1 })

// Calculate current balance from ledger
db.ledger.aggregate([
  { $match: { userId: userId } },
  { $group: {
    _id: null,
    totalCredits: { 
      $sum: { 
        $cond: [{ $eq: ["$transactionType", "credit"] }, "$amount", 0] 
      }
    },
    totalDebits: { 
      $sum: { 
        $cond: [{ $eq: ["$transactionType", "debit"] }, "$amount", 0] 
      }
    }
  }},
  { $project: { 
    currentBalance: { $subtract: ["$totalCredits", "$totalDebits"] }
  }}
])
```

### Performance Optimization Strategies

#### 1. Index Optimization
```javascript
// Compound indexes for common query patterns
db.interviews.createIndex({ 
  userId: 1, 
  status: 1, 
  createdAt: -1 
})

// Partial indexes for specific conditions
db.interviews.createIndex(
  { "evaluation.overallScore": -1 },
  { partialFilterExpression: { status: "completed" } }
)
```

#### 2. Aggregation Pipeline Optimization
```javascript
// Use $match early in pipeline to reduce documents
db.interviews.aggregate([
  { $match: { userId: userId, status: "completed" } }, // Early filtering
  { $project: { // Project only needed fields
    "evaluation.overallScore": 1,
    "session.actualDuration": 1,
    createdAt: 1
  }},
  { $group: { /* aggregation logic */ }}
])
```

#### 3. Data Archiving Strategy
```javascript
// Archive old interviews (older than 2 years)
const archiveDate = new Date()
archiveDate.setFullYear(archiveDate.getFullYear() - 2)

// Move to archive collection
db.interviews.aggregate([
  { $match: { createdAt: { $lt: archiveDate } } },
  { $out: "interviews_archive" }
])

// Remove from main collection
db.interviews.deleteMany({ createdAt: { $lt: archiveDate } })
```

## 📊 Data Relationships & Constraints

### Referential Integrity

```javascript
// User deletion cascade (soft delete)
async function deleteUser(userId) {
  // Mark user as inactive instead of deleting
  await db.users.updateOne(
    { _id: userId },
    { 
      $set: { 
        isActive: false,
        email: `deleted_${Date.now()}_${email}`,
        deletedAt: new Date()
      }
    }
  )
  
  // Archive user's interviews
  await db.interviews.updateMany(
    { userId: userId },
    { $set: { archived: true } }
  )
}
```

### Data Validation Rules

```javascript
// Mongoose schema validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  subscription: {
    vapiMinutesRemaining: {
      type: Number,
      min: 0,
      default: 30
    }
  }
})

// Pre-save middleware for business logic
userSchema.pre('save', function(next) {
  // Ensure free plan users don't exceed limits
  if (this.subscription.plan === 'free' && 
      this.subscription.vapiMinutesRemaining > 30) {
    this.subscription.vapiMinutesRemaining = 30
  }
  next()
})
```

## 🔄 Data Migration & Versioning

### Schema Evolution Strategy

```javascript
// Migration script example
const migration_v1_to_v2 = {
  version: "2.0.0",
  description: "Add interviewMode field to interviews",
  up: async () => {
    await db.interviews.updateMany(
      { interviewMode: { $exists: false } },
      { $set: { "configuration.interviewMode": "webspeech" } }
    )
  },
  down: async () => {
    await db.interviews.updateMany(
      {},
      { $unset: { "configuration.interviewMode": "" } }
    )
  }
}
```

### Backup Strategy

```javascript
// Daily backup script
const backupDatabase = async () => {
  const timestamp = new Date().toISOString().split('T')[0]
  
  // Backup critical collections
  const collections = ['users', 'interviews', 'payments', 'ledger']
  
  for (const collection of collections) {
    await exec(`mongodump --uri="${MONGODB_URI}" --collection=${collection} --out=backup_${timestamp}`)
  }
}
```

This comprehensive database schema provides a solid foundation for the InterviewMate platform, ensuring data integrity, performance, and scalability.
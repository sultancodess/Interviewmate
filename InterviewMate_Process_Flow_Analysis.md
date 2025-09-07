# InterviewMate - Process Flow & Data Flow Analysis

## Application Overview
InterviewMate is an AI-powered interview practice platform with a React frontend and Node.js/Express backend. It uses MongoDB for data storage, Google Gemini AI for evaluation, and supports both Web Speech API and VAPI for voice interactions.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│    MongoDB      │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  External APIs  │    │   AI Services   │    │   File Storage  │
│ • VAPI          │    │ • Google Gemini │    │ • Resume/JD     │
│ • Razorpay      │    │ • Web Speech    │    │ • Recordings    │
│ • Google OAuth  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  googleId: String,
  profilePicture: String,
  subscription: {
    plan: 'free' | 'pro',
    vapiMinutesRemaining: Number,
    payAsYouGoBalance: Number,
    renewalDate: Date
  },
  preferences: {
    theme: 'light' | 'dark',
    notifications: { email: Boolean, push: Boolean },
    language: String
  },
  stats: {
    totalInterviews: Number,
    totalMinutesUsed: Number,
    averageScore: Number,
    lastInterviewDate: Date
  }
}
```

### Interview Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'hr' | 'technical' | 'managerial' | 'custom',
  status: 'created' | 'in_progress' | 'completed' | 'cancelled',
  candidateInfo: {
    name: String,
    role: String,
    company: String,
    experience: 'fresher' | 'mid-level' | 'senior' | 'executive'
  },
  configuration: {
    duration: Number,
    difficulty: 'easy' | 'medium' | 'hard',
    topics: [String],
    customQuestions: [String]
  },
  session: {
    startTime: Date,
    endTime: Date,
    transcript: String
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
    recommendations: [String]
  }
}
```

## Process Flow Diagrams

### 1. User Authentication Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│   Login/    │───►│   Backend   │
│  Register   │    │ Validation  │
└─────────────┘    └──────┬──────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │  JWT Token  │
       │           │ Generation  │
       │           └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Dashboard  │◄───│  Auth State │
│   (Home)    │    │   Update    │
└─────────────┘    └─────────────┘
```

### 2. Interview Creation Flow

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Interview   │
│   Setup     │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│ Form Input  │───►│ Validation  │
│ • Type      │    │ • Required  │
│ • Duration  │    │ • Limits    │
│ • Topics    │    │ • Balance   │
└─────────────┘    └──────┬──────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │   Create    │
       │           │ Interview   │
       │           │  Record     │
       │           └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│    Live     │◄───│  Generate   │
│ Interview   │    │ VAPI Config │
└─────────────┘    └─────────────┘
```

### 3. Live Interview Flow

```
┌─────────────┐
│ Interview   │
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│   Voice     │───►│   Speech    │
│ Interface   │    │Recognition  │
│ Selection   │    │   Setup     │
└─────────────┘    └──────┬──────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │ Question    │
       │           │Generation   │
       │           │(Gemini AI)  │
       │           └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│ Real-time   │◄──►│ Transcript  │
│Conversation │    │  Recording  │
└──────┬──────┘    └─────────────┘
       │
       ▼
┌─────────────┐
│ Interview   │
│   End       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Evaluation  │
│  Process    │
└─────────────┘
```

### 4. Interview Evaluation Flow

```
┌─────────────┐
│ Interview   │
│  Complete   │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│ Transcript  │───►│ Gemini AI   │
│ Processing  │    │ Analysis    │
└─────────────┘    └──────┬──────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │   Score     │
       │           │Calculation  │
       │           └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Fallback   │    │  Detailed   │
│ Evaluation  │    │  Feedback   │
│ (if AI fails)│   │ Generation  │
└──────┬──────┘    └──────┬──────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │   Update    │
       │           │ User Stats  │
       │           └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│   Report    │◄───│   Store     │
│ Generation  │    │ Evaluation  │
└─────────────┘    └─────────────┘
```

### 5. Payment & Subscription Flow

```
┌─────────────┐
│ Subscription│
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐
│ Plan        │───►│ Razorpay    │
│ Selection   │    │ Order       │
└─────────────┘    └──────┬──────┘
       │                  │
       │                  ▼
       │           ┌─────────────┐
       │           │  Payment    │
       │           │ Processing  │
       │           └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Payment    │◄───│ Signature   │
│ Verification│    │Verification │
└──────┬──────┘    └─────────────┘
       │
       ▼
┌─────────────┐
│ Subscription│
│   Update    │
└─────────────┘
```

## Data Flow Architecture

### Frontend Data Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Pages    │───►│  Contexts   │───►│   Services  │
│             │    │ • Auth      │    │ • API       │
│ • Dashboard │    │ • Interview │    │ • VAPI      │
│ • Setup     │    │             │    │ • WebSpeech │
│ • Live      │    └─────────────┘    └─────────────┘
│ • Report    │           │                   │
└─────────────┘           │                   │
       ▲                  ▼                   ▼
       │           ┌─────────────┐    ┌─────────────┐
       │           │   State     │    │   HTTP      │
       └───────────│ Management  │◄───│  Requests   │
                   └─────────────┘    └─────────────┘
```

### Backend Data Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Routes    │───►│ Controllers │───►│   Models    │
│ • /auth     │    │ • Validate  │    │ • User      │
│ • /user     │    │ • Process   │    │ • Interview │
│ • /interview│    │ • Response  │    └─────────────┘
│ • /payment  │    └─────────────┘           │
└─────────────┘           │                  │
       ▲                  ▼                  ▼
       │           ┌─────────────┐    ┌─────────────┐
       │           │ Middleware  │    │  Database   │
       └───────────│ • Auth      │◄───│  (MongoDB)  │
                   │ • Error     │    └─────────────┘
                   │ • Validation│
                   └─────────────┘
```

### External Service Integration
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───►│   Server    │───►│ External    │
│             │    │             │    │ Services    │
│ • Voice UI  │    │ • API Proxy │    │ • Gemini AI │
│ • Payment   │    │ • Auth      │    │ • VAPI      │
│ • OAuth     │    │ • Webhooks  │    │ • Razorpay  │
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                  │                   │
       │                  ▼                   ▼
       │           ┌─────────────┐    ┌─────────────┐
       │           │  Response   │◄───│  Service    │
       └───────────│ Processing  │    │  Response   │
                   └─────────────┘    └─────────────┘
```

## Key Features & Flows

### 1. Multi-Modal Voice Support
- **Web Speech API**: Free, unlimited, browser-based
- **VAPI Integration**: Premium, high-quality, paid per minute
- **Fallback System**: Graceful degradation if services fail

### 2. AI-Powered Evaluation
- **Primary**: Google Gemini AI for intelligent analysis
- **Fallback**: Rule-based evaluation system
- **Metrics**: Communication, technical knowledge, problem-solving, confidence

### 3. Subscription Management
- **Free Plan**: 30 VAPI minutes, unlimited Web Speech
- **Pro Plan**: Pay-as-you-go VAPI credits ($0.50/minute)
- **Payment**: Razorpay integration with webhook verification

### 4. Real-time Features
- **Live Transcription**: Real-time speech-to-text
- **Dynamic Questions**: AI-generated follow-up questions
- **Progress Tracking**: Session monitoring and analytics

### 5. Security & Performance
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API protection (100 requests/15min)
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error recovery

## Technology Stack Summary

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API calls

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express middleware for security

**External Services:**
- Google Gemini AI for evaluation
- VAPI for premium voice features
- Razorpay for payments
- Google OAuth for authentication

**Development:**
- ESLint for code quality
- Hot reload for development
- Environment-based configuration
- Comprehensive error handling
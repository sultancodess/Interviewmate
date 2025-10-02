# InterviewMate - AI-Powered Interview Practice Platform

InterviewMate is a comprehensive AI-powered mock interview platform that simulates real interviews through voice-based, real-time conversations with AI interviewers. It offers dynamic questioning, instant feedback, performance analytics, and professional reports to help candidates prepare for actual interviews with confidence.

## 🎯 Purpose

The platform aims to empower job seekers by delivering **realistic, professional-grade mock interviews** that:

- Mimic HR, technical, and managerial interviews
- Adapt dynamically with cross-questions and scenario-based questioning
- Provide real-time performance insights and shareable final reports
- Help users track progress and improve specific skills over time

## 🚀 Features

### 1. Authentication & User Access

- **Email/Password Login** with JWT-based authentication
- **Google OAuth Integration** for seamless sign-in
- **Password Reset** functionality
- **User Profile Management** with avatar support

### 2. User Dashboard

- **Personalized Welcome** with avatar and username
- **Quick Action Cards** for starting interviews and viewing reports
- **Performance Analytics** overview
- **Remaining Minutes Tracker** for subscription management
- **Sidebar Navigation** for easy access to all features
- **Subscription Badge** with upgrade CTA

### 3. Interview Setup (Comprehensive Form)

#### Frontend (User-facing Form)

- **Candidate Details**
  - Candidate Name
  - Upload Resume (PDF/DOC) - Optional with AI parsing
  - Upload Custom Question Set - Optional
- **Interview Context**
  - Interview Type: HR / Technical / Managerial / Custom
  - Role (e.g., Backend Developer, Data Scientist)
  - Company (e.g., TCS, Amazon)
  - Job Description - Free-text or PDF upload
- **Interview Configuration**
  - **Mode Selection:**
    - **Lite (Web Speech API)** → Basic Q&A with captions (FREE)
    - **Pro (VAPI AI)** → Real-time adaptive AI interviewer (PAID)
  - **Topics:** User can select from predefined or add custom topics
  - **Difficulty Level:** Easy / Medium / Hard
  - **Number of Questions:** 5-20 questions
  - **Duration:** 5-60 minutes

#### Backend Logic

- **Form Validation Layer** with comprehensive error handling
- **Resume + JD Parsing** using AI for personalization
- **System Prompt Generator** for both Lite and Pro modes
- **Configuration Persistence** in MongoDB
- **Minutes Validation** for subscription management

### 4. Real-Time Interview Interface

#### Frontend (Zoom/Google Meet-style Interface)

- **Audio Controls** → Mute/Unmute functionality
- **Real-time Captions** → Live transcription display
- **Interviewer Persona Selector** → HR / Technical / Managerial avatars
- **Adaptive Question Display** → Current question with follow-ups
- **Timer** → Remaining interview time
- **Progress Bar** → Questions asked vs planned
- **Professional UI** with fullscreen support

#### Backend Logic

- **Voice Interaction Layer**
  - **Lite Mode:** Browser mic → Web Speech API → Gemini AI → next question
  - **Pro Mode:** Candidate voice → VAPI → Real-time AI interviewer response
- **Real-Time Transcription Engine** with live captions
- **Adaptive Questioning** based on candidate responses
- **Cross-Questioning/Scenario Simulation** with persona-specific logic
- **Session Management** with WebSocket support

### 5. AI Evaluation & Reporting

#### Evaluation Pipeline

- **Transcript & Metadata Collection** after interview completion
- **Queue-Based Job Dispatch** for scalable processing
- **Gemini AI Evaluation** with structured rubric
- **Validation Layer** with retry mechanisms
- **Fallback System** when AI services are unavailable

#### Report Generation

- **Comprehensive PDF Reports** with professional styling
- **JSON API Response** for dashboard integration
- **Visual Charts** → Radar charts for skills, bar charts for comparisons
- **Email Delivery** with PDF attachments
- **Dashboard Integration** with detailed breakdowns

### 6. Final Report Page

- **Professional Layout** with candidate and interview information
- **Overall Score** with circular progress indicator
- **Skill-wise Analysis** with radar and bar charts
- **Strengths, Weaknesses, and Improvement Plan** in structured cards
- **Achievement Badges** for exceptional performance
- **Download PDF** functionality with high-quality generation
- **Social Sharing Options**
  - Share to LinkedIn with auto-generated summary
  - Share to Twitter with score and link
  - Copy public shareable link
- **Persistent Storage** linked to interview history

### 7. Interview History

- **Comprehensive List** of all past interviews
- **Advanced Filtering** by role, date, type, score range
- **Search Functionality** across candidate details
- **Sorting Options** by date, score, duration
- **Quick Actions**
  - View detailed report
  - Download PDF directly
  - Delete interview with confirmation
- **Bulk Operations** for managing multiple interviews
- **Pagination** for scalability
- **Performance Tracking** with visual indicators

### 8. Performance Analytics

- **Performance Trends** over time with interactive charts
- **Skill Progression** tracking across all categories
- **Interview Type Analysis** with distribution charts
- **Key Metrics Dashboard**
  - Total interviews completed
  - Average score with improvement tracking
  - Total practice time
  - Best score achieved
  - Consistency rating
- **Insights & Recommendations** based on performance data
- **Goal Setting** and achievement tracking
- **Comparative Analysis** across different time periods

### 9. User Profile & Settings

- **Profile Management**
  - Update name, email, profile picture
  - Profile picture storage with CDN support
- **Theme & UI Settings**
  - Light/Dark mode toggle
  - Language preferences
- **Subscription & Billing**
  - View current plan (Free/Pro)
  - Upgrade plan with Razorpay integration
  - View minutes balance and transaction history
  - Pay-as-you-go credit management
- **Account Management**
  - Delete account with GDPR compliance
  - Data export functionality
  - Privacy settings

### 10. Subscription & Payment System

#### Payment Integration (Razorpay)

- **Secure Payment Processing** with webhook verification
- **Multiple Payment Methods** support
- **Automatic Receipt Generation**

#### Minute-Based Credit System

- **Free Plan:** 30 VAPI minutes/month (auto-credited, non-carryover)
- **Pro Plan:** Pay-as-you-go system (₹0.50 per minute)
- **Unlimited Web Speech API** usage for all plans

#### Ledger System

- **Immutable Transaction Records** for audit compliance
- **Real-time Balance Updates** with WebSocket notifications
- **Refund/Chargeback Support** with automatic processing
- **Usage Metering** with heartbeat-based tracking

### 11. Admin Panel

- **User Management** with detailed analytics
- **Interview Monitoring** and quality control
- **System Health Monitoring** with real-time metrics
- **Payment Transaction Management**
- **Content Management** for interview templates
- **Analytics Dashboard** with business insights

## ⚙️ Technical Stack

| Layer              | Technology                   | Purpose                                      |
| ------------------ | ---------------------------- | -------------------------------------------- |
| **Frontend**       | React.js (Vite + JSX)        | Modern UI framework                          |
| **Styling**        | Tailwind CSS + Framer Motion | Responsive design + animations               |
| **Backend**        | Node.js + Express            | RESTful API server                           |
| **Database**       | MongoDB Atlas                | Document-based data storage                  |
| **Authentication** | JWT + Google OAuth           | Secure user authentication                   |
| **AI Services**    | Google Gemini AI             | Interview evaluation and question generation |
| **Voice AI**       | VAPI AI                      | Real-time voice conversations                |
| **Speech API**     | Web Speech API               | Browser-based speech recognition             |
| **Charts**         | Recharts                     | Data visualization                           |
| **PDF Generation** | jsPDF                        | Professional report generation               |
| **Payments**       | Razorpay                     | Secure payment processing                    |
| **File Storage**   | Local/Cloud Storage          | Resume and document handling                 |
| **Real-time**      | WebSockets                   | Live updates and notifications               |

## 🏗️ Architecture Overview

### Frontend Architecture

```
src/
├── components/           # Reusable UI components
│   ├── InterviewSetup/  # Interview configuration components
│   ├── Reports/         # Report display components
│   └── Layout/          # Layout and navigation components
├── pages/               # Main application pages
├── contexts/            # React Context for state management
├── services/            # API communication services
├── utils/               # Utility functions and helpers
├── constants/           # Application constants and configurations
└── hooks/               # Custom React hooks
```

### Backend Architecture

```
server/
├── routes/              # API route handlers
├── models/              # MongoDB data models
├── middleware/          # Express middleware functions
├── config/              # Configuration files
├── services/            # Business logic services
├── utils/               # Utility functions
└── scripts/             # Deployment and maintenance scripts
```

### Database Schema

#### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  googleId: String,
  profilePicture: String,
  subscription: {
    plan: 'free' | 'pro',
    vapiMinutesRemaining: Number,
    vapiMinutesUsed: Number,
    payAsYouGoBalance: Number,
    renewalDate: Date,
    razorpayCustomerId: String,
    razorpaySubscriptionId: String
  },
  preferences: {
    theme: 'light' | 'dark',
    notifications: Object,
    language: String
  },
  stats: {
    totalInterviews: Number,
    totalMinutesUsed: Number,
    averageScore: Number,
    lastInterviewDate: Date
  },
  isActive: Boolean,
  isAdmin: Boolean,
  emailVerified: Boolean
}
```

#### Interview Model

```javascript
{
  userId: ObjectId,
  type: 'hr' | 'technical' | 'managerial' | 'custom',
  status: 'created' | 'in_progress' | 'completed' | 'cancelled',
  candidateInfo: {
    name: String,
    role: String,
    company: String,
    experience: String,
    skills: [String],
    resume: Object,
    jobDescription: Object
  },
  configuration: {
    duration: Number,
    difficulty: String,
    topics: [String],
    customTopics: [String],
    customQuestions: [String],
    interviewMode: 'webspeech' | 'vapi',
    numQuestions: Number,
    language: String
  },
  session: {
    startTime: Date,
    endTime: Date,
    actualDuration: Number,
    transcript: String,
    recording: Object
  },
  evaluation: {
    overallScore: Number,
    skillScores: Object,
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    detailedFeedback: String,
    badges: [String],
    evaluatedAt: Date
  }
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Cloud Platform account (for Gemini AI)
- VAPI AI account (for premium voice features)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/interviewmate.git
   cd interviewmate
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Configuration**

   **Server Environment (.env)**

   ```bash
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewmate

   # JWT
   JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_long
   JWT_EXPIRE=7d

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash

   # VAPI AI
   VAPI_PRIVATE_API_KEY=your_vapi_private_key_here
   VAPI_PUBLIC_API_KEY=your_vapi_public_key_here
   VAPI_HR_ASSISTANT_ID=your_hr_assistant_id_here
   VAPI_TECHNICAL_ASSISTANT_ID=your_technical_assistant_id_here
   VAPI_MANAGERIAL_ASSISTANT_ID=your_managerial_assistant_id_here
   VAPI_CUSTOM_ASSISTANT_ID=your_custom_assistant_id_here

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here

   # Server
   PORT=5001
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Client Environment (.env)**

   ```bash
   # API
   VITE_API_URL=http://localhost:5001/api

   # VAPI AI (Public Keys Only)
   VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
   VITE_VAPI_HR_ASSISTANT_ID=your_hr_assistant_id_here
   VITE_VAPI_TECHNICAL_ASSISTANT_ID=your_technical_assistant_id_here
   VITE_VAPI_MANAGERIAL_ASSISTANT_ID=your_managerial_assistant_id_here
   VITE_VAPI_CUSTOM_ASSISTANT_ID=your_custom_assistant_id_here

   # Google OAuth (Public ID Only)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

   # Razorpay (Public Key Only)
   VITE_RAZORPAY_KEY_ID=your_razorpay_public_key_here

   # Feature Flags
   VITE_ENABLE_WEB_SPEECH_FALLBACK=true
   VITE_ENABLE_GOOGLE_OAUTH=true
   ```

4. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Frontend server on http://localhost:5173
   - Backend server on http://localhost:5001

### Production Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Frontend: Vercel, Netlify, or any static hosting
   - Backend: Railway, Render, or any Node.js hosting
   - Database: MongoDB Atlas (recommended)

## 🔧 Configuration

### AI Services Setup

#### Google Gemini AI

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add the key to your server environment variables

#### VAPI AI Setup

1. Sign up at [VAPI AI](https://vapi.ai)
2. Create assistants for each interview type
3. Configure the assistant IDs in your environment

### Payment Integration

#### Razorpay Setup

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Configure webhook endpoints for payment verification

### Email Configuration

#### Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use the app password in your environment variables

## 📊 Monitoring & Analytics

### Application Monitoring

- **Health Check Endpoint:** `/api/health`
- **Error Logging:** Comprehensive error tracking
- **Performance Metrics:** Response time and throughput monitoring

### Business Analytics

- **User Engagement:** Interview completion rates
- **Revenue Tracking:** Subscription and payment analytics
- **Performance Insights:** AI evaluation accuracy metrics

## 🔒 Security Features

### Authentication & Authorization

- **JWT Token Management** with secure expiration
- **Password Hashing** using bcrypt with salt rounds
- **OAuth Integration** with Google for secure sign-in
- **Role-Based Access Control** for admin features

### Data Protection

- **Input Validation** and sanitization on all endpoints
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin security
- **Environment Variable Protection** for sensitive data
- **SQL Injection Prevention** with Mongoose ODM

### Privacy Compliance

- **GDPR Compliance** with data export and deletion
- **Data Anonymization** for deleted accounts
- **Secure File Handling** with type and size validation
- **Audit Logging** for all critical operations

## 🧪 Testing

### Running Tests

```bash
# Run server tests
npm run test

# Run client linting
npm run lint

# Validate setup
npm run validate
```

### Test Coverage

- **Unit Tests** for utility functions
- **Integration Tests** for API endpoints
- **End-to-End Tests** for critical user flows

## 🚀 Performance Optimization

### Frontend Optimization

- **Code Splitting** with React.lazy()
- **Image Optimization** with lazy loading
- **Bundle Analysis** and tree shaking
- **Caching Strategies** for API responses

### Backend Optimization

- **Database Indexing** for query performance
- **Connection Pooling** for MongoDB
- **Response Compression** with gzip
- **Caching Layer** with Redis (optional)

## 📈 Scalability Considerations

### Horizontal Scaling

- **Stateless Architecture** for easy scaling
- **Load Balancer Ready** with session management
- **Microservices Architecture** potential
- **CDN Integration** for static assets

### Database Scaling

- **MongoDB Sharding** for large datasets
- **Read Replicas** for improved performance
- **Data Archiving** for old interviews
- **Backup Strategies** with automated scheduling

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Submit a pull request with detailed description

### Code Standards

- **ESLint Configuration** for consistent code style
- **Prettier Integration** for code formatting
- **Commit Message Standards** with conventional commits
- **Documentation Requirements** for new features

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgotpassword` - Password reset request
- `PUT /api/auth/resetpassword/:token` - Reset password

### Interview Endpoints

- `POST /api/interview/create` - Create new interview
- `GET /api/interview/history` - Get interview history
- `GET /api/interview/:id` - Get specific interview
- `PUT /api/interview/:id` - Update interview
- `POST /api/interview/:id/evaluate` - Evaluate interview
- `DELETE /api/interview/:id` - Delete interview
- `GET /api/interview/analytics` - Get analytics data

### User Management Endpoints

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/subscription` - Get subscription details
- `PUT /api/user/subscription` - Update subscription
- `PUT /api/user/password` - Change password

### Payment Endpoints

- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Get payment history
- `POST /api/payment/cancel-subscription` - Cancel subscription

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5001
npm run kill-port

# Or use a different port
PORT=5002 npm run dev
```

#### MongoDB Connection Issues

- Verify your MongoDB URI
- Check network connectivity
- Ensure IP whitelist includes your address

#### AI Service Errors

- Verify API keys are correctly set
- Check service quotas and limits
- Review error logs for specific issues

#### Payment Integration Issues

- Verify Razorpay credentials
- Check webhook URL configuration
- Review payment flow logs

## 📞 Support

### Getting Help

- **Documentation:** Check this README and inline code comments
- **Issues:** Create a GitHub issue with detailed description
- **Discussions:** Use GitHub Discussions for questions
- **Email:** Contact support@interviewmate.com

### Reporting Bugs

When reporting bugs, please include:

- Steps to reproduce the issue
- Expected vs actual behavior
- Browser/environment information
- Error messages and logs
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing
- **VAPI AI** for real-time voice conversation capabilities
- **Razorpay** for secure payment processing
- **MongoDB Atlas** for reliable database hosting
- **Vercel/Netlify** for seamless deployment options

---

**InterviewMate** - Empowering job seekers with AI-powered interview practice. Built with ❤️ for the developer community.

For more information, visit our [website](https://interviewmate.com) or follow us on [Twitter](https://twitter.com/interviewmate).

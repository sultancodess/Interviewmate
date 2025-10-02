# InterviewMate - API Documentation

## 🌐 API Overview

The InterviewMate API is a RESTful service built with Express.js that provides comprehensive endpoints for managing users, interviews, payments, and administrative functions. All endpoints follow REST conventions and return JSON responses.

**Base URL**: `http://localhost:5001/api` (Development)  
**Production URL**: `https://api.interviewmate.com/api`

## 🔐 Authentication

### JWT Token Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Token Structure
```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "iat": 1642680000,
  "exp": 1643284800
}
```

## 📋 API Endpoints

### 🔑 Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": null,
    "subscription": {
      "plan": "free",
      "vapiMinutesRemaining": 30,
      "vapiMinutesUsed": 0,
      "payAsYouGoBalance": 0,
      "renewalDate": "2024-02-01T00:00:00.000Z"
    },
    "preferences": {
      "theme": "light",
      "notifications": {
        "email": true,
        "push": true
      },
      "language": "en"
    },
    "stats": {
      "totalInterviews": 0,
      "totalMinutesUsed": 0,
      "averageScore": 0,
      "lastInterviewDate": null
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email",
  "errors": [
    {
      "field": "email",
      "message": "Email already in use"
    }
  ]
}
```

#### POST /auth/login
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    // User object (same as register response)
  }
}
```

#### POST /auth/google
Authenticate user with Google OAuth credential.

**Request Body:**
```json
{
  "credential": "google_jwt_credential_string"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    // User object with Google profile data
    "googleId": "google_user_id",
    "profilePicture": "https://lh3.googleusercontent.com/...",
    "emailVerified": true
  }
}
```

#### GET /auth/me
Get current authenticated user information.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    // Complete user object
  }
}
```

#### POST /auth/logout
Logout current user (invalidate token).

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

#### POST /auth/forgotpassword
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### PUT /auth/resetpassword/:resettoken
Reset password using reset token.

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "new_jwt_token",
  "user": {
    // User object
  }
}
```

### 👤 User Management Endpoints

#### GET /user/profile
Get user profile information.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    // Complete user profile
  }
}
```

#### PUT /user/profile
Update user profile information.

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "profilePicture": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    // Updated user object
  }
}
```

#### PUT /user/preferences
Update user preferences.

**Request Body:**
```json
{
  "theme": "dark",
  "notifications": {
    "email": false,
    "push": true
  },
  "language": "es"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    // Updated user object
  }
}
```

#### GET /user/subscription
Get user subscription details.

**Response (200):**
```json
{
  "success": true,
  "subscription": {
    "plan": "pro",
    "vapiMinutesRemaining": 150,
    "vapiMinutesUsed": 50,
    "payAsYouGoBalance": 25.50,
    "renewalDate": "2024-02-01T00:00:00.000Z",
    "razorpayCustomerId": "cust_razorpay_id",
    "lastPayment": {
      "amount": 49900,
      "date": "2024-01-15T10:30:00.000Z",
      "razorpayPaymentId": "pay_razorpay_id",
      "status": "paid"
    }
  },
  "stats": {
    "totalInterviews": 15,
    "totalMinutesUsed": 450,
    "averageScore": 78.5,
    "lastInterviewDate": "2024-01-15T14:30:00.000Z"
  }
}
```

#### PUT /user/password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 🎤 Interview Management Endpoints

#### GET /interview/create
Get interview creation form configuration.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userPlan": "free",
    "vapiMinutesRemaining": 30,
    "payAsYouGoBalance": 0,
    "interviewTypes": ["hr", "technical", "managerial", "custom"],
    "experienceLevels": ["fresher", "mid-level", "senior", "executive"],
    "difficulties": ["easy", "medium", "hard"],
    "durations": [5, 10, 15, 30, 45, 60]
  }
}
```

#### POST /interview/create
Create a new interview.

**Request Body:**
```json
{
  "type": "technical",
  "candidateInfo": {
    "name": "John Doe",
    "role": "Senior Software Engineer",
    "company": "Google",
    "experience": "senior",
    "skills": ["JavaScript", "React", "Node.js"]
  },
  "configuration": {
    "duration": 30,
    "difficulty": "medium",
    "topics": ["System Design", "Algorithms"],
    "customTopics": ["React Hooks"],
    "customQuestions": ["Explain virtual DOM"],
    "jobDescription": "We are looking for a senior engineer...",
    "interviewMode": "vapi",
    "numQuestions": 12,
    "language": "en"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "interview": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "type": "technical",
    "status": "created",
    "candidateInfo": {
      // Candidate information
    },
    "configuration": {
      // Interview configuration
    },
    "vapiConfig": {
      "assistantId": "33589d74-e3de-409e-bc7c-1ed23c258121",
      "firstMessage": "Good morning, John! I'm Alex...",
      "systemPrompt": "You are Alex, an expert AI interviewer...",
      "voice": {
        "provider": "elevenlabs",
        "voiceId": "josh"
      }
    },
    "createdAt": "2024-01-15T13:45:00.000Z",
    "updatedAt": "2024-01-15T13:45:00.000Z"
  }
}
```

#### GET /interview/history
Get user's interview history with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `type` (string): Filter by interview type
- `status` (string): Filter by status
- `startDate` (string): Filter from date (ISO format)
- `endDate` (string): Filter to date (ISO format)

**Example Request:**
```http
GET /interview/history?page=1&limit=5&type=technical&status=completed
```

**Response (200):**
```json
{
  "success": true,
  "interviews": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "type": "technical",
      "status": "completed",
      "candidateInfo": {
        "name": "John Doe",
        "role": "Senior Software Engineer",
        "company": "Google"
      },
      "configuration": {
        "duration": 30,
        "difficulty": "medium",
        "interviewMode": "vapi"
      },
      "session": {
        "startTime": "2024-01-15T14:00:00.000Z",
        "endTime": "2024-01-15T14:28:00.000Z",
        "actualDuration": 28
      },
      "evaluation": {
        "overallScore": 85,
        "performanceGrade": "A"
      },
      "createdAt": "2024-01-15T13:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 15,
    "pages": 3
  }
}
```

#### GET /interview/:id
Get specific interview details.

**Response (200):**
```json
{
  "success": true,
  "interview": {
    // Complete interview object with all fields
  }
}
```

#### PUT /interview/:id
Update interview details.

**Request Body:**
```json
{
  "status": "in_progress",
  "session": {
    "startTime": "2024-01-15T14:00:00.000Z"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "interview": {
    // Updated interview object
  }
}
```

#### POST /interview/:id/evaluate
Evaluate completed interview using AI.

**Request Body:**
```json
{
  "transcript": "Interviewer: Good morning, John! Tell me about yourself...\nCandidate: Thank you for having me. I'm a senior software engineer with 8 years of experience..."
}
```

**Response (200):**
```json
{
  "success": true,
  "interview": {
    // Interview object with evaluation results
  },
  "evaluation": {
    "overallScore": 85,
    "skillScores": {
      "communication": 88,
      "technicalKnowledge": 82,
      "problemSolving": 87,
      "confidence": 85,
      "clarity": 89,
      "behavioral": 83
    },
    "strengths": [
      "Excellent communication skills",
      "Strong problem-solving approach",
      "Good understanding of system design principles"
    ],
    "weaknesses": [
      "Could improve knowledge of advanced algorithms",
      "Needs more experience with microservices architecture"
    ],
    "recommendations": [
      "Practice more algorithm problems on LeetCode",
      "Study microservices design patterns",
      "Work on explaining complex concepts more simply"
    ],
    "detailedFeedback": "John demonstrated strong technical knowledge and excellent communication skills throughout the interview...",
    "badges": ["Excellent Communicator", "Problem Solver", "Technical Expert"],
    "evaluatedAt": "2024-01-15T14:30:00.000Z",
    "evaluationModel": "gemini-1.5-flash"
  },
  "message": "Interview evaluated successfully."
}
```

#### DELETE /interview/:id
Delete an interview.

**Response (200):**
```json
{
  "success": true,
  "message": "Interview deleted successfully"
}
```

#### GET /interview/analytics
Get user's interview analytics and performance data.

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalInterviews": 15,
      "averageScore": 78.5,
      "totalMinutes": 450,
      "completedInterviews": 12
    },
    "performanceTrend": [
      {
        "_id": "2024-01-10",
        "averageScore": 75,
        "count": 2
      },
      {
        "_id": "2024-01-15",
        "averageScore": 82,
        "count": 3
      }
    ],
    "skillBreakdown": {
      "communication": 85,
      "technicalKnowledge": 78,
      "problemSolving": 80,
      "confidence": 75,
      "clarity": 88,
      "behavioral": 82
    }
  }
}
```

### 🤖 AI Service Endpoints

#### POST /interview/generate-questions
Generate interview questions using AI.

**Request Body:**
```json
{
  "jobDescription": "We are looking for a Senior Software Engineer with expertise in React and Node.js...",
  "difficulty": "medium",
  "count": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "questions": [
    {
      "question": "Can you explain the difference between React functional and class components?",
      "type": "technical"
    },
    {
      "question": "How would you optimize a React application for performance?",
      "type": "technical"
    },
    {
      "question": "Describe your experience with Node.js and Express.js",
      "type": "technical"
    },
    {
      "question": "How do you handle error handling in a Node.js application?",
      "type": "technical"
    },
    {
      "question": "What's your approach to testing React components?",
      "type": "technical"
    }
  ]
}
```

#### POST /interview/generate-followup
Generate follow-up questions based on context.

**Request Body:**
```json
{
  "prompt": "The candidate mentioned they have experience with microservices architecture. Generate a follow-up question to explore this further."
}
```

**Response (200):**
```json
{
  "success": true,
  "followUp": "That's great! Can you walk me through how you would design a microservices architecture for an e-commerce platform? What services would you create and how would they communicate with each other?"
}
```

#### GET /interview/test-gemini
Test Gemini AI connection and availability.

**Response (200):**
```json
{
  "success": true,
  "message": "Gemini AI is working"
}
```

### 📁 File Upload Endpoints

#### POST /upload/resume
Upload and parse resume file.

**Request Body (multipart/form-data):**
```
file: [PDF/DOC/DOCX file]
type: "resume"
```

**Response (200):**
```json
{
  "success": true,
  "filePath": "/uploads/resumes/507f1f77bcf86cd799439012_resume.pdf",
  "filename": "john_doe_resume.pdf",
  "parsedData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "experience": [
      {
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "duration": "2020-2024",
        "description": "Led development of web applications..."
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Computer Science",
        "institution": "University of Technology",
        "year": "2018"
      }
    ],
    "summary": "Experienced software engineer with expertise in full-stack development..."
  }
}
```

#### POST /upload/job-description
Upload and parse job description file.

**Request Body (multipart/form-data):**
```
file: [PDF/DOC/DOCX/TXT file]
type: "jobDescription"
```

**Response (200):**
```json
{
  "success": true,
  "filePath": "/uploads/jds/507f1f77bcf86cd799439012_jd.pdf",
  "filename": "google_swe_jd.pdf",
  "extractedText": "We are looking for a Senior Software Engineer to join our team. The ideal candidate will have 5+ years of experience in full-stack development..."
}
```

### 💳 Payment Endpoints

#### POST /payment/create-order
Create a new payment order.

**Request Body:**
```json
{
  "planType": "minutes",
  "minutesPurchased": 100,
  "amount": 49900
}
```

**Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_razorpay_id_string",
    "amount": 49900,
    "currency": "INR",
    "status": "created"
  },
  "razorpayKeyId": "rzp_live_key_id"
}
```

#### POST /payment/verify
Verify payment after successful transaction.

**Request Body:**
```json
{
  "razorpay_order_id": "order_razorpay_id_string",
  "razorpay_payment_id": "pay_razorpay_id_string",
  "razorpay_signature": "signature_string"
}
```

**Response (200):**
```json
{
  "success": true,
  "payment": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "razorpayOrderId": "order_razorpay_id_string",
    "razorpayPaymentId": "pay_razorpay_id_string",
    "amount": 49900,
    "status": "paid",
    "planType": "minutes",
    "minutesPurchased": 100
  },
  "updatedUser": {
    "subscription": {
      "vapiMinutesRemaining": 130,
      "payAsYouGoBalance": 0
    }
  }
}
```

#### GET /payment/history
Get user's payment history.

**Response (200):**
```json
{
  "success": true,
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "amount": 49900,
      "currency": "INR",
      "status": "paid",
      "planType": "minutes",
      "minutesPurchased": 100,
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

### 🔧 Admin Endpoints

#### GET /admin/analytics
Get platform-wide analytics (Admin only).

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "users": {
      "total": 1250,
      "active": 1100,
      "new": 45,
      "freeUsers": 950,
      "proUsers": 300
    },
    "interviews": {
      "total": 5680,
      "completed": 4920,
      "inProgress": 120,
      "averageScore": 76.8
    },
    "revenue": {
      "total": 125000,
      "thisMonth": 15000,
      "lastMonth": 12000
    },
    "usage": {
      "vapiMinutesUsed": 15420,
      "webSpeechMinutesUsed": 89340
    }
  }
}
```

#### GET /admin/users
Get all users with pagination (Admin only).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name or email
- `plan` (string): Filter by subscription plan

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "subscription": {
        "plan": "pro",
        "vapiMinutesRemaining": 150
      },
      "stats": {
        "totalInterviews": 15,
        "averageScore": 78.5
      },
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "pages": 63
  }
}
```

### 🏥 Health Check Endpoints

#### GET /health
Check API health status.

**Response (200):**
```json
{
  "status": "success",
  "message": "InterviewMate API is running",
  "timestamp": "2024-01-15T15:30:00.000Z",
  "services": {
    "database": "connected",
    "geminiAI": "available",
    "vapiAI": "available",
    "razorpay": "available"
  },
  "version": "1.0.0"
}
```

## 🚨 Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ],
  "timestamp": "2024-01-15T15:30:00.000Z"
}
```

### HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Not authorized to access this route",
  "error": "JWT_INVALID",
  "timestamp": "2024-01-15T15:30:00.000Z"
}
```

#### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ],
  "timestamp": "2024-01-15T15:30:00.000Z"
}
```

#### Rate Limiting Errors
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "error": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900,
  "timestamp": "2024-01-15T15:30:00.000Z"
}
```

## 🔄 Webhooks

### VAPI Webhook
Endpoint: `POST /interview/vapi-webhook`

**Request Body:**
```json
{
  "type": "call.ended",
  "data": {
    "callId": "call_vapi_id_string",
    "duration": 1680,
    "transcript": "Full conversation transcript...",
    "metadata": {
      "interviewId": "507f1f77bcf86cd799439012"
    }
  }
}
```

### Razorpay Webhook
Endpoint: `POST /payment/webhook`

**Request Body:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_razorpay_id_string",
        "order_id": "order_razorpay_id_string",
        "amount": 49900,
        "status": "captured"
      }
    }
  }
}
```

## 📊 Rate Limiting

### Default Limits
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Analytics**: 10 requests per minute per user
- **History**: 15 requests per minute per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642681500
```

## 🧪 Testing

### Example API Test with curl

```bash
# Register a new user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testPassword123"
  }'

# Login and get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'

# Create an interview (using token from login)
curl -X POST http://localhost:5001/api/interview/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "technical",
    "candidateInfo": {
      "name": "Test Candidate",
      "role": "Software Engineer",
      "company": "Test Company",
      "experience": "mid-level"
    },
    "configuration": {
      "duration": 15,
      "difficulty": "medium",
      "topics": ["JavaScript", "React"],
      "interviewMode": "webspeech",
      "numQuestions": 8
    }
  }'
```

This comprehensive API documentation provides all the information needed to integrate with the InterviewMate platform.
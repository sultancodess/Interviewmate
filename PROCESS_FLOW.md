# InterviewMate - Process Flow Documentation

## 🔄 Complete User Journey & Process Flows

This document outlines all the key processes and user journeys in the InterviewMate platform, from user registration to interview completion and beyond.

## 🚀 User Onboarding Flow

### 1. Registration & Authentication Process

```mermaid
flowchart TD
    A[User visits InterviewMate] --> B{Has Account?}
    B -->|No| C[Registration Page]
    B -->|Yes| D[Login Page]
    
    C --> E{Registration Method}
    E -->|Email/Password| F[Fill Registration Form]
    E -->|Google OAuth| G[Google Sign-in Flow]
    
    F --> H[Server Validation]
    H --> I{Valid Data?}
    I -->|No| J[Show Validation Errors]
    J --> F
    I -->|Yes| K[Create User Account]
    
    G --> L[Google OAuth Verification]
    L --> M{OAuth Success?}
    M -->|No| N[Show OAuth Error]
    N --> C
    M -->|Yes| O[Create/Update User Account]
    
    K --> P[Generate JWT Token]
    O --> P
    P --> Q[Send Welcome Email]
    Q --> R[Redirect to Dashboard]
    
    D --> S[Login Form]
    S --> T[Server Authentication]
    T --> U{Valid Credentials?}
    U -->|No| V[Show Login Error]
    V --> S
    U -->|Yes| W[Generate JWT Token]
    W --> R
```

**Key Steps:**
1. **Landing Page**: User discovers InterviewMate
2. **Registration Choice**: Email/password or Google OAuth
3. **Account Creation**: Server validates and creates user record
4. **Welcome Process**: JWT token generation and welcome email
5. **Dashboard Access**: User redirected to main dashboard

### 2. Profile Setup & Preferences

```mermaid
flowchart TD
    A[New User Dashboard] --> B[Profile Setup Prompt]
    B --> C[Upload Profile Picture]
    C --> D[Set Preferences]
    D --> E[Theme Selection]
    E --> F[Notification Settings]
    F --> G[Language Preference]
    G --> H[Save Preferences]
    H --> I[Profile Setup Complete]
    I --> J[Show Dashboard Features]
```

## 🎯 Interview Creation & Setup Flow

### 1. Interview Setup Process

```mermaid
flowchart TD
    A[User clicks 'Start Interview'] --> B[Interview Setup Page]
    B --> C[Step 1: Candidate Details]
    
    C --> D[Enter Basic Info]
    D --> E{Upload Resume?}
    E -->|Yes| F[Upload Resume File]
    F --> G[AI Resume Parsing]
    G --> H[Auto-fill Skills]
    E -->|No| I[Manual Skill Entry]
    H --> I
    
    I --> J[Step 2: Interview Context]
    J --> K[Select Interview Type]
    K --> L{Interview Type}
    L -->|HR| M[Load HR Topics]
    L -->|Technical| N[Load Technical Topics]
    L -->|Managerial| O[Load Management Topics]
    L -->|Custom| P[Custom Configuration]
    
    M --> Q[Select Focus Topics]
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R{Upload Job Description?}
    R -->|Yes| S[Upload JD File]
    S --> T[Extract JD Content]
    T --> U[Add Custom Topics/Questions]
    R -->|No| U
    
    U --> V[Step 3: Configuration]
    V --> W[Select Interview Mode]
    W --> X{Mode Selection}
    X -->|Lite Mode| Y[Web Speech API Setup]
    X -->|Pro Mode| Z[VAPI AI Setup]
    
    Y --> AA[Set Duration & Questions]
    Z --> BB{Check Balance}
    BB -->|Insufficient| CC[Show Upgrade Prompt]
    CC --> DD[Redirect to Pricing]
    BB -->|Sufficient| AA
    
    AA --> EE[Review Configuration]
    EE --> FF[Create Interview Record]
    FF --> GG[Generate AI Prompts]
    GG --> HH{Mode Type}
    HH -->|VAPI| II[Generate VAPI Config]
    HH -->|Web Speech| JJ[Generate Question Set]
    
    II --> KK[Save Interview]
    JJ --> KK
    KK --> LL[Redirect to Live Interview]
```

**Key Components:**

#### Step 1: Candidate Details
- **Basic Information**: Name, role, company, experience level
- **Resume Upload**: Optional PDF/DOC upload with AI parsing
- **Skill Extraction**: Automatic skill detection from resume
- **Manual Override**: User can edit auto-detected information

#### Step 2: Interview Context
- **Type Selection**: HR, Technical, Managerial, or Custom
- **Topic Selection**: Predefined topics based on interview type
- **Custom Topics**: User-defined focus areas
- **Job Description**: Upload or paste JD for context
- **Custom Questions**: User-specific questions to include

#### Step 3: Configuration
- **Mode Selection**: Lite (Web Speech) vs Pro (VAPI AI)
- **Balance Check**: Verify sufficient credits for Pro mode
- **Duration Setting**: 5-60 minutes
- **Question Count**: 5-20 questions
- **Difficulty Level**: Easy, Medium, Hard

### 2. AI Configuration Generation

```mermaid
flowchart TD
    A[Interview Configuration] --> B[Generate AI Prompts]
    B --> C{Interview Type}
    
    C -->|HR| D[HR Persona: Sarah]
    C -->|Technical| E[Technical Persona: Alex]
    C -->|Managerial| F[Management Persona: Michael]
    C -->|Custom| G[Generic Persona: Jordan]
    
    D --> H[Generate HR System Prompt]
    E --> I[Generate Technical System Prompt]
    F --> J[Generate Management System Prompt]
    G --> K[Generate Custom System Prompt]
    
    H --> L[Create First Message]
    I --> L
    J --> L
    K --> L
    
    L --> M[Configure Voice Settings]
    M --> N{Interview Mode}
    N -->|VAPI| O[Set VAPI Assistant ID]
    N -->|Web Speech| P[Set Question Sequence]
    
    O --> Q[Save Configuration]
    P --> Q
    Q --> R[Ready for Live Interview]
```

## 🎤 Live Interview Process Flow

### 1. Interview Session Management

```mermaid
flowchart TD
    A[User enters Live Interview] --> B[Load Interview Configuration]
    B --> C[Initialize Interview Interface]
    C --> D[Show Interviewer Persona]
    D --> E[Display Pre-interview Instructions]
    E --> F[User clicks 'Start Interview']
    
    F --> G{Interview Mode}
    G -->|VAPI Mode| H[Initialize VAPI Service]
    G -->|Web Speech Mode| I[Initialize Web Speech API]
    
    H --> J[Connect to VAPI Assistant]
    J --> K{Connection Success?}
    K -->|No| L[Show Error & Fallback]
    L --> I
    K -->|Yes| M[Start VAPI Call]
    
    I --> N[Setup Speech Recognition]
    N --> O[Load First Question]
    O --> P[Start Question Sequence]
    
    M --> Q[VAPI Conversation Flow]
    P --> R[Web Speech Q&A Flow]
    
    Q --> S[Real-time Transcript]
    R --> S
    S --> T[Update Progress Bar]
    T --> U[Save Session Data]
    
    U --> V{Interview Complete?}
    V -->|No| W{Mode Type}
    W -->|VAPI| Q
    W -->|Web Speech| R
    V -->|Yes| X[End Interview Session]
    
    X --> Y[Stop Services]
    Y --> Z[Collect Final Transcript]
    Z --> AA[Update Interview Status]
    AA --> BB[Redirect to Evaluation]
```

### 2. VAPI Mode Flow (Pro)

```mermaid
flowchart TD
    A[VAPI Mode Selected] --> B[Check User Balance]
    B --> C{Sufficient Credits?}
    C -->|No| D[Show Insufficient Balance]
    D --> E[Redirect to Pricing]
    C -->|Yes| F[Initialize VAPI Client]
    
    F --> G[Load Assistant Configuration]
    G --> H[Set Interview Context]
    H --> I[Start VAPI Call]
    I --> J{Call Connected?}
    J -->|No| K[Show Connection Error]
    K --> L[Fallback to Web Speech]
    J -->|Yes| M[AI Interviewer Active]
    
    M --> N[Real-time Voice Conversation]
    N --> O[Live Transcript Generation]
    O --> P[Update UI with Captions]
    P --> Q[Track Speaking Time]
    Q --> R[Monitor Call Quality]
    
    R --> S{User Action}
    S -->|Mute/Unmute| T[Toggle Microphone]
    S -->|End Interview| U[Stop VAPI Call]
    S -->|Continue| N
    
    T --> N
    U --> V[Collect Call Data]
    V --> W[Calculate Usage]
    W --> X[Deduct from Balance]
    X --> Y[Save Session Data]
    Y --> Z[Proceed to Evaluation]
```

### 3. Web Speech Mode Flow (Lite)

```mermaid
flowchart TD
    A[Web Speech Mode Selected] --> B[Check Browser Support]
    B --> C{Speech API Available?}
    C -->|No| D[Show Compatibility Error]
    D --> E[Suggest Browser Upgrade]
    C -->|Yes| F[Initialize Speech Recognition]
    
    F --> G[Load Question Set]
    G --> H[Display First Question]
    H --> I[Start Speech Recognition]
    I --> J[AI Speaks Question]
    J --> K[Wait for User Response]
    
    K --> L[Capture Voice Input]
    L --> M[Convert to Text]
    M --> N[Display Live Transcript]
    N --> O{Response Complete?}
    O -->|No| L
    O -->|Yes| P[Save Response]
    
    P --> Q[Move to Next Question]
    Q --> R{More Questions?}
    R -->|Yes| S[Load Next Question]
    S --> J
    R -->|No| T[Interview Complete]
    
    T --> U[Compile Full Transcript]
    U --> V[Save Session Data]
    V --> W[Proceed to Evaluation]
```

### 4. Real-time Interface Updates

```mermaid
flowchart TD
    A[Interview Session Active] --> B[Update Timer Display]
    B --> C[Update Progress Bar]
    C --> D[Update Question Counter]
    D --> E[Update Transcript Panel]
    E --> F[Monitor Audio Levels]
    F --> G[Update Connection Status]
    G --> H[Handle User Controls]
    
    H --> I{User Action}
    I -->|Mute Toggle| J[Update Mute Status]
    I -->|Volume Control| K[Adjust Audio Level]
    I -->|Pause Interview| L[Pause Session]
    I -->|Resume Interview| M[Resume Session]
    I -->|End Interview| N[Confirm End Dialog]
    
    J --> A
    K --> A
    L --> O[Show Pause Overlay]
    M --> A
    N --> P{Confirm End?}
    P -->|No| A
    P -->|Yes| Q[End Interview Process]
```

## 🤖 AI Evaluation Process Flow

### 1. Interview Evaluation Pipeline

```mermaid
flowchart TD
    A[Interview Completed] --> B[Collect Session Data]
    B --> C[Prepare Evaluation Request]
    C --> D[Generate Evaluation Prompt]
    D --> E[Include Interview Context]
    E --> F[Add Transcript Data]
    F --> G[Set Evaluation Rubric]
    
    G --> H[Send to Gemini AI]
    H --> I{AI Service Available?}
    I -->|No| J[Use Fallback Evaluation]
    I -->|Yes| K[Process AI Response]
    
    K --> L{Valid Response?}
    L -->|No| M[Retry with Fallback]
    L -->|Yes| N[Parse Evaluation JSON]
    
    J --> O[Generate Basic Scores]
    M --> O
    N --> P[Validate Score Ranges]
    
    O --> Q[Create Evaluation Record]
    P --> Q
    Q --> R[Calculate Achievement Badges]
    R --> S[Update User Statistics]
    S --> T[Generate Performance Grade]
    T --> U[Save Evaluation Results]
    U --> V[Trigger Report Generation]
```

### 2. AI Prompt Generation

```mermaid
flowchart TD
    A[Evaluation Request] --> B[Load Interview Data]
    B --> C[Extract Key Information]
    C --> D[Candidate Profile]
    D --> E[Interview Configuration]
    E --> F[Session Transcript]
    F --> G[Job Context]
    
    G --> H[Build Structured Prompt]
    H --> I[Add Evaluation Rubric]
    I --> J{Interview Type}
    J -->|HR| K[HR-specific Criteria]
    J -->|Technical| L[Technical Criteria]
    J -->|Managerial| M[Leadership Criteria]
    J -->|Custom| N[General Criteria]
    
    K --> O[Combine Prompt Elements]
    L --> O
    M --> O
    N --> O
    
    O --> P[Add Response Format]
    P --> Q[Include Examples]
    Q --> R[Finalize Prompt]
    R --> S[Send to AI Service]
```

### 3. Evaluation Scoring System

```mermaid
flowchart TD
    A[AI Evaluation Response] --> B[Parse JSON Response]
    B --> C[Validate Score Format]
    C --> D{Valid Scores?}
    D -->|No| E[Apply Default Scores]
    D -->|Yes| F[Normalize Score Ranges]
    
    E --> G[Calculate Overall Score]
    F --> G
    G --> H[Determine Performance Grade]
    H --> I{Grade Calculation}
    I -->|90-100| J[Grade: A+]
    I -->|80-89| K[Grade: A]
    I -->|70-79| L[Grade: B]
    I -->|60-69| M[Grade: C]
    I -->|<60| N[Grade: D]
    
    J --> O[Generate Achievement Badges]
    K --> O
    L --> O
    M --> O
    N --> O
    
    O --> P{Badge Criteria}
    P -->|Communication ≥85| Q[Excellent Communicator]
    P -->|Technical ≥85| R[Technical Expert]
    P -->|Problem Solving ≥85| S[Problem Solver]
    P -->|Overall ≥90| T[Outstanding Performance]
    
    Q --> U[Compile Final Evaluation]
    R --> U
    S --> U
    T --> U
    U --> V[Save to Database]
```

## 📊 Report Generation & Sharing Flow

### 1. Report Creation Process

```mermaid
flowchart TD
    A[Evaluation Complete] --> B[Trigger Report Generation]
    B --> C[Load Report Template]
    C --> D[Populate Interview Data]
    D --> E[Add Candidate Information]
    E --> F[Include Score Breakdown]
    F --> G[Add Visual Elements]
    G --> H[Generate PDF Document]
    
    H --> I{PDF Generation Success?}
    I -->|No| J[Retry with Fallback]
    I -->|Yes| K[Save PDF to Storage]
    
    J --> L[Generate Basic PDF]
    L --> K
    K --> M[Create Public Share URL]
    M --> N[Update Report Record]
    N --> O[Send Completion Notification]
    O --> P[Display Report to User]
```

### 2. Report Sharing Flow

```mermaid
flowchart TD
    A[User clicks Share] --> B[Show Sharing Options]
    B --> C{Sharing Method}
    
    C -->|LinkedIn| D[Generate LinkedIn Post]
    C -->|Twitter| E[Generate Tweet]
    C -->|Email| F[Open Email Client]
    C -->|Copy Link| G[Copy to Clipboard]
    C -->|Download PDF| H[Download File]
    
    D --> I[Open LinkedIn Share Dialog]
    E --> J[Open Twitter Share Dialog]
    F --> K[Compose Email with Report]
    G --> L[Show Success Message]
    H --> M[Trigger PDF Download]
    
    I --> N[Track Share Event]
    J --> N
    K --> N
    L --> N
    M --> N
    
    N --> O[Update Share Analytics]
    O --> P[Increment Share Counter]
```

## 💳 Payment & Subscription Flow

### 1. Subscription Management

```mermaid
flowchart TD
    A[User needs more minutes] --> B[View Subscription Page]
    B --> C[Show Current Plan]
    C --> D[Display Available Options]
    D --> E{User Selection}
    
    E -->|Upgrade to Pro| F[Show Pro Benefits]
    E -->|Buy Minutes| G[Show Minute Packages]
    E -->|Stay Free| H[Continue with Limits]
    
    F --> I[Select Pro Plan]
    G --> J[Select Minute Package]
    H --> K[Return to Dashboard]
    
    I --> L[Calculate Pro Cost]
    J --> M[Calculate Package Cost]
    
    L --> N[Create Payment Order]
    M --> N
    N --> O[Initialize Razorpay]
    O --> P[Show Payment Interface]
```

### 2. Payment Processing Flow

```mermaid
flowchart TD
    A[Payment Interface Loaded] --> B[User enters Payment Details]
    B --> C[Razorpay Validation]
    C --> D{Payment Valid?}
    D -->|No| E[Show Payment Error]
    E --> B
    D -->|Yes| F[Process Payment]
    
    F --> G[Payment Gateway Response]
    G --> H{Payment Success?}
    H -->|No| I[Show Failure Message]
    H -->|Yes| J[Verify Payment Signature]
    
    J --> K{Signature Valid?}
    K -->|No| L[Mark as Suspicious]
    K -->|Yes| M[Update User Balance]
    
    M --> N[Create Payment Record]
    N --> O[Update Ledger]
    O --> P[Send Confirmation Email]
    P --> Q[Show Success Message]
    Q --> R[Redirect to Dashboard]
    
    I --> S[Log Payment Failure]
    L --> T[Log Security Issue]
```

### 3. Balance Management

```mermaid
flowchart TD
    A[User starts VAPI Interview] --> B[Check Current Balance]
    B --> C{Sufficient Balance?}
    C -->|No| D[Show Insufficient Balance]
    D --> E[Redirect to Pricing]
    C -->|Yes| F[Reserve Interview Cost]
    
    F --> G[Start Interview]
    G --> H[Track Usage in Real-time]
    H --> I[Monitor Call Duration]
    I --> J[Interview Ends]
    J --> K[Calculate Actual Cost]
    K --> L[Deduct from Balance]
    L --> M[Update Ledger Entry]
    M --> N[Update User Statistics]
```

## 📈 Analytics & Reporting Flow

### 1. User Analytics Generation

```mermaid
flowchart TD
    A[User visits Analytics] --> B[Load User Interview Data]
    B --> C[Calculate Performance Metrics]
    C --> D[Generate Trend Analysis]
    D --> E[Create Skill Progression]
    E --> F[Build Comparison Charts]
    F --> G[Compile Insights]
    G --> H[Generate Recommendations]
    H --> I[Display Analytics Dashboard]
```

### 2. Admin Analytics Flow

```mermaid
flowchart TD
    A[Admin accesses Analytics] --> B[Aggregate Platform Data]
    B --> C[Calculate User Metrics]
    C --> D[Analyze Interview Patterns]
    D --> E[Generate Revenue Reports]
    E --> F[Create Usage Statistics]
    F --> G[Build Performance Dashboards]
    G --> H[Export Reports]
```

## 🔄 Background Processes

### 1. Automated Tasks

```mermaid
flowchart TD
    A[Scheduled Tasks] --> B{Task Type}
    B -->|Daily| C[Reset Free User Minutes]
    B -->|Weekly| D[Generate Usage Reports]
    B -->|Monthly| E[Process Subscriptions]
    B -->|Hourly| F[Cleanup Temp Files]
    
    C --> G[Update User Balances]
    D --> H[Send Admin Reports]
    E --> I[Handle Renewals]
    F --> J[Delete Old Files]
    
    G --> K[Log Task Completion]
    H --> K
    I --> K
    J --> K
```

### 2. Data Maintenance

```mermaid
flowchart TD
    A[Data Maintenance] --> B[Archive Old Interviews]
    B --> C[Backup Database]
    C --> D[Optimize Indexes]
    D --> E[Clean Log Files]
    E --> F[Update Analytics Cache]
    F --> G[Validate Data Integrity]
```

This comprehensive process flow documentation covers all major user journeys and system processes in the InterviewMate platform, providing a clear understanding of how users interact with the system and how data flows through various components.
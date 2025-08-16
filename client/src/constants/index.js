// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000

// VAPI Configuration
export const VAPI_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_VAPI_PUBLIC_KEY,
  HR_ASSISTANT_ID: import.meta.env.VITE_VAPI_HR_ASSISTANT_ID,
  TECHNICAL_ASSISTANT_ID: import.meta.env.VITE_VAPI_TECHNICAL_ASSISTANT_ID,
  ENABLED: import.meta.env.VITE_ENABLE_VAPI_INTEGRATION === 'true'
}

// Interview Types
export const INTERVIEW_TYPES = {
  HR: 'hr',
  TECHNICAL: 'technical',
  MANAGERIAL: 'managerial',
  CUSTOM: 'custom'
}

export const INTERVIEW_TYPE_LABELS = {
  [INTERVIEW_TYPES.HR]: 'HR Interview',
  [INTERVIEW_TYPES.TECHNICAL]: 'Technical Interview',
  [INTERVIEW_TYPES.MANAGERIAL]: 'Managerial Interview',
  [INTERVIEW_TYPES.CUSTOM]: 'Custom Interview'
}

// Experience Levels
export const EXPERIENCE_LEVELS = {
  FRESHER: 'fresher',
  MID_LEVEL: 'mid-level',
  SENIOR: 'senior',
  EXECUTIVE: 'executive'
}

export const EXPERIENCE_LEVEL_LABELS = {
  [EXPERIENCE_LEVELS.FRESHER]: 'Fresher (0-1 years)',
  [EXPERIENCE_LEVELS.MID_LEVEL]: 'Mid-level (2-5 years)',
  [EXPERIENCE_LEVELS.SENIOR]: 'Senior (5+ years)',
  [EXPERIENCE_LEVELS.EXECUTIVE]: 'Executive (10+ years)'
}

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

export const DIFFICULTY_LEVEL_LABELS = {
  [DIFFICULTY_LEVELS.EASY]: 'Easy',
  [DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
  [DIFFICULTY_LEVELS.HARD]: 'Hard'
}

// Interview Status
export const INTERVIEW_STATUS = {
  CREATED: 'created',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const INTERVIEW_STATUS_LABELS = {
  [INTERVIEW_STATUS.CREATED]: 'Created',
  [INTERVIEW_STATUS.IN_PROGRESS]: 'In Progress',
  [INTERVIEW_STATUS.COMPLETED]: 'Completed',
  [INTERVIEW_STATUS.CANCELLED]: 'Cancelled'
}

// Interview Modes
export const INTERVIEW_MODES = {
  VAPI: 'vapi',
  WEB_SPEECH: 'webspeech'
}

export const INTERVIEW_MODE_LABELS = {
  [INTERVIEW_MODES.VAPI]: 'VAPI AI',
  [INTERVIEW_MODES.WEB_SPEECH]: 'Web Speech API'
}

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro'
}

export const SUBSCRIPTION_PLAN_LABELS = {
  [SUBSCRIPTION_PLANS.FREE]: 'Free Plan',
  [SUBSCRIPTION_PLANS.PRO]: 'Pro Plan'
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_RESUME_SIZE) || 5242880, // 5MB
  ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_RESUME_TYPES || 'pdf,doc,docx').split(','),
  MIME_TYPES: {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
}

// Score Ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 90, max: 100, label: 'Excellent', color: 'green' },
  GOOD: { min: 80, max: 89, label: 'Good', color: 'blue' },
  AVERAGE: { min: 70, max: 79, label: 'Average', color: 'yellow' },
  BELOW_AVERAGE: { min: 60, max: 69, label: 'Below Average', color: 'orange' },
  POOR: { min: 0, max: 59, label: 'Poor', color: 'red' }
}

// Grade Mapping
export const GRADE_MAPPING = {
  'A+': { min: 97, color: 'green' },
  'A': { min: 93, color: 'green' },
  'A-': { min: 90, color: 'green' },
  'B+': { min: 87, color: 'blue' },
  'B': { min: 83, color: 'blue' },
  'B-': { min: 80, color: 'blue' },
  'C+': { min: 77, color: 'yellow' },
  'C': { min: 73, color: 'yellow' },
  'C-': { min: 70, color: 'yellow' },
  'D+': { min: 67, color: 'orange' },
  'D': { min: 65, color: 'orange' },
  'F': { min: 0, color: 'red' }
}

// Skill Categories
export const SKILL_CATEGORIES = {
  COMMUNICATION: 'communication',
  TECHNICAL_KNOWLEDGE: 'technicalKnowledge',
  PROBLEM_SOLVING: 'problemSolving',
  CONFIDENCE: 'confidence',
  CLARITY: 'clarity',
  BEHAVIORAL: 'behavioral'
}

export const SKILL_CATEGORY_LABELS = {
  [SKILL_CATEGORIES.COMMUNICATION]: 'Communication',
  [SKILL_CATEGORIES.TECHNICAL_KNOWLEDGE]: 'Technical Knowledge',
  [SKILL_CATEGORIES.PROBLEM_SOLVING]: 'Problem Solving',
  [SKILL_CATEGORIES.CONFIDENCE]: 'Confidence',
  [SKILL_CATEGORIES.CLARITY]: 'Clarity',
  [SKILL_CATEGORIES.BEHAVIORAL]: 'Behavioral'
}

// Achievement Badges
export const ACHIEVEMENT_BADGES = {
  EXCELLENT_COMMUNICATOR: 'Excellent Communicator',
  TECHNICAL_EXPERT: 'Technical Expert',
  PROBLEM_SOLVER: 'Problem Solver',
  CONFIDENT_LEADER: 'Confident Leader',
  CLEAR_THINKER: 'Clear Thinker',
  CULTURAL_FIT: 'Cultural Fit',
  OUTSTANDING_PERFORMANCE: 'Outstanding Performance',
  FIRST_INTERVIEW: 'First Interview',
  STREAK_PERFORMER: 'Streak Performer',
  IMPROVEMENT_CHAMPION: 'Improvement Champion'
}

// Duration Options (in minutes)
export const DURATION_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' }
]

// Common Interview Topics
export const INTERVIEW_TOPICS = {
  HR: [
    'Communication',
    'Teamwork',
    'Leadership',
    'Problem Solving',
    'Cultural Fit',
    'Motivation',
    'Career Goals',
    'Conflict Resolution'
  ],
  TECHNICAL: [
    'Data Structures',
    'Algorithms',
    'System Design',
    'Coding',
    'Architecture',
    'Database Design',
    'API Development',
    'Testing'
  ],
  MANAGERIAL: [
    'Team Management',
    'Strategic Planning',
    'Decision Making',
    'Delegation',
    'Performance Management',
    'Budget Management',
    'Stakeholder Management',
    'Change Management'
  ]
}

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  EMAIL: 'email'
}

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

// Language Options
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  HI: 'hi'
}

export const LANGUAGE_LABELS = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.ES]: 'Spanish',
  [LANGUAGES.FR]: 'French',
  [LANGUAGES.DE]: 'German',
  [LANGUAGES.HI]: 'Hindi'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  INTERVIEW_DRAFT: 'interview_draft',
  THEME: 'theme',
  LANGUAGE: 'language'
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'File upload failed. Please try again.',
  PAYMENT_ERROR: 'Payment failed. Please try again.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  INTERVIEW_CREATED: 'Interview created successfully!',
  INTERVIEW_COMPLETED: 'Interview completed successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  FILE_UPLOADED: 'File uploaded successfully!'
}

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
}

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
}

// Feature Flags
export const FEATURE_FLAGS = {
  VOICE_RECORDING: import.meta.env.VITE_ENABLE_VOICE_RECORDING === 'true',
  VOICE_INTERVIEWS: import.meta.env.VITE_ENABLE_VOICE_INTERVIEWS === 'true',
  PDF_EXPORT: import.meta.env.VITE_ENABLE_PDF_EXPORT === 'true',
  SOCIAL_SHARING: import.meta.env.VITE_ENABLE_SOCIAL_SHARING === 'true',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  GOOGLE_OAUTH: import.meta.env.VITE_ENABLE_GOOGLE_OAUTH === 'true'
}

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'InterviewMate',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Interview Practice Platform',
  MAX_INTERVIEW_DURATION: parseInt(import.meta.env.VITE_MAX_INTERVIEW_DURATION) || 3600,
  MAX_QUESTIONS_PER_INTERVIEW: parseInt(import.meta.env.VITE_MAX_QUESTIONS_PER_INTERVIEW) || 20,
  DEFAULT_INTERVIEW_TYPE: import.meta.env.VITE_DEFAULT_INTERVIEW_TYPE || 'hr'
}

// Pricing Configuration
export const PRICING = {
  FREE_INTERVIEWS_PER_DAY: parseInt(import.meta.env.VITE_FREE_INTERVIEWS_PER_DAY) || 2,
  PRO_MONTHLY_PRICE: parseInt(import.meta.env.VITE_PRO_MONTHLY_PRICE) || 49900, // in paise
  PRO_YEARLY_PRICE: parseInt(import.meta.env.VITE_PRO_YEARLY_PRICE) || 399900, // in paise
  VAPI_COST_PER_MINUTE: 0.5, // in rupees
  FREE_VAPI_MINUTES: 30
}
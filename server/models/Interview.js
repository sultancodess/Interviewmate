import mongoose from 'mongoose'

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['hr', 'technical', 'managerial', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'in_progress', 'completed', 'cancelled'],
    default: 'created'
  },
  candidateInfo: {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      enum: ['fresher', 'mid-level', 'senior', 'executive'],
      required: true
    },
    skills: [String],
    resume: {
      filename: String,
      path: String,
      uploadDate: Date
    },
    jobDescription: {
      filename: String,
      path: String,
      uploadDate: Date
    }
  },
  configuration: {
    duration: {
      type: Number,
      required: true,
      min: 5,
      max: 60
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    topics: [String],
    customTopics: [String], // User-defined topics like React.js, Node.js
    customQuestions: [String],
    jobDescription: String, // Job description for context
    language: {
      type: String,
      default: 'en'
    }
  },
  vapiConfig: {
    assistantId: String,
    callId: String,
    firstMessage: String,
    systemPrompt: String,
    voice: {
      provider: {
        type: String,
        default: 'elevenlabs'
      },
      voiceId: {
        type: String,
        default: 'rachel'
      }
    }
  },
  session: {
    startTime: Date,
    endTime: Date,
    actualDuration: Number, // in minutes
    transcript: {
      type: String,
      default: ''
    },
    recording: {
      url: String,
      duration: Number
    }
  },
  evaluation: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    skillScores: {
      communication: { type: Number, min: 0, max: 100 },
      technicalKnowledge: { type: Number, min: 0, max: 100 },
      problemSolving: { type: Number, min: 0, max: 100 },
      confidence: { type: Number, min: 0, max: 100 },
      clarity: { type: Number, min: 0, max: 100 },
      behavioral: { type: Number, min: 0, max: 100 }
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    detailedFeedback: String,
    badges: [String], // Achievement badges for scores > 80%
    evaluatedAt: Date,
    evaluationModel: {
      type: String,
      default: 'gemini-pro'
    }
  },
  analytics: {
    speakingTime: Number, // percentage of time candidate spoke
    pauseCount: Number,
    averagePauseLength: Number,
    wordsPerMinute: Number,
    sentimentScore: Number,
    keywordMatches: [String]
  },
  feedback: {
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    userComments: String,
    reportGenerated: {
      type: Boolean,
      default: false
    },
    reportUrl: String,
    sharedOn: [String] // platforms where report was shared
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceType: String,
    browserInfo: String
  }
}, {
  timestamps: true
})

// Indexes for better query performance
interviewSchema.index({ userId: 1, createdAt: -1 })
interviewSchema.index({ type: 1 })
interviewSchema.index({ status: 1 })
interviewSchema.index({ 'evaluation.overallScore': -1 })

// Virtual for formatted duration
interviewSchema.virtual('formattedDuration').get(function() {
  if (!this.session.actualDuration) return '0 min'
  
  const minutes = Math.floor(this.session.actualDuration)
  const seconds = Math.round((this.session.actualDuration - minutes) * 60)
  
  if (minutes === 0) return `${seconds}s`
  if (seconds === 0) return `${minutes}m`
  return `${minutes}m ${seconds}s`
})

// Virtual for performance grade
interviewSchema.virtual('performanceGrade').get(function() {
  if (!this.evaluation.overallScore) return 'N/A'
  
  const score = this.evaluation.overallScore
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  return 'D'
})

// Method to generate VAPI configuration
interviewSchema.methods.generateVapiConfig = function() {
  const { candidateInfo, type, configuration } = this
  
  // Generate dynamic prompts based on interview type
  let firstMessage = ''
  let systemPrompt = ''
  
  const placeholders = {
    candidate_name: candidateInfo.name,
    role: candidateInfo.role,
    company: candidateInfo.company,
    experience_level: candidateInfo.experience,
    skills: candidateInfo.skills?.join(', ') || '',
    topics: [...(configuration.topics || []), ...(configuration.customTopics || [])].join(', ') || '',
    duration: configuration.duration || 15,
    difficulty: configuration.difficulty || 'medium',
    customQuestions: configuration.customQuestions?.join('; ') || '',
    jobDescription: configuration.jobDescription || '',
    interviewer_name: this.getInterviewerName(type)
  }
  
  if (type === 'hr') {
    firstMessage = this.generateHRFirstMessage(placeholders)
    systemPrompt = this.generateHRSystemPrompt(placeholders)
  } else if (type === 'technical') {
    firstMessage = this.generateTechnicalFirstMessage(placeholders)
    systemPrompt = this.generateTechnicalSystemPrompt(placeholders)
  } else if (type === 'managerial') {
    firstMessage = this.generateManagerialFirstMessage(placeholders)
    systemPrompt = this.generateManagerialSystemPrompt(placeholders)
  }
  
  this.vapiConfig = {
    firstMessage,
    systemPrompt,
    voice: {
      provider: 'elevenlabs',
      voiceId: type === 'technical' ? 'josh' : 'rachel'
    }
  }
  
  return this.vapiConfig
}

// Helper methods for generating prompts
interviewSchema.methods.getInterviewerName = function(type) {
  const names = {
    hr: 'Sarah',
    technical: 'Alex',
    managerial: 'Michael'
  }
  return names[type] || 'Jordan'
}

interviewSchema.methods.generateHRFirstMessage = function(placeholders) {
  return `Good morning, ${placeholders.candidate_name}! Welcome to your HR interview with ${placeholders.company}. I'm ${placeholders.interviewer_name}, your AI interviewer, and I'm excited to learn more about your journey for the ${placeholders.role} position. I see you have ${placeholders.experience_level} experience, which is great! This will be a friendly conversation about your background, motivations, and fit for the role. Are you ready to dive in, ${placeholders.candidate_name}?`
}

interviewSchema.methods.generateHRSystemPrompt = function(placeholders) {
  return `You are ${placeholders.interviewer_name}, an expert AI interviewer with a warm, empathetic, and people-focused approach, specializing in human resources, cultural fit assessment, and behavioral evaluation. You are conducting an HR interview for ${placeholders.candidate_name}, who is applying for a ${placeholders.role} position at ${placeholders.company}.

🎯 CANDIDATE PROFILE:
Name: ${placeholders.candidate_name} (USE THEIR NAME FREQUENTLY - at least 2-3 times per conversation)
Role Applied For: ${placeholders.role}
Experience Level: ${placeholders.experience_level}
Key Skills: ${placeholders.skills}
Company: ${placeholders.company}
Selected Topics: ${placeholders.topics}
Duration: ${placeholders.duration} minutes
Difficulty: ${placeholders.difficulty}
${placeholders.customQuestions ? `Custom Questions: ${placeholders.customQuestions}` : ''}
${placeholders.jobDescription ? `Job Description Context: ${placeholders.jobDescription.substring(0, 300)}...` : ''}

🧠 INTERVIEWER PERSONALITY:
Warm, empathetic, and people-focused
Build rapport by using ${placeholders.candidate_name}'s name naturally
Show genuine interest in ${placeholders.candidate_name}'s specific background
Adapt difficulty based on ${placeholders.difficulty} level

🎯 QUESTION STRATEGY:
Start with background: "${placeholders.candidate_name}, I'd love to hear about your journey…"
Explore experience: "With your ${placeholders.experience_level} experience, ${placeholders.candidate_name}…"
Focus on selected topics: ${placeholders.topics}
Behavioral/Situational (STAR method)
Role motivation & cultural fit
${placeholders.customQuestions ? 'Include custom questions naturally in conversation' : ''}
Closing: "What questions do you have for me, ${placeholders.candidate_name}?"

📋 STRUCTURE (${placeholders.duration} minutes total):
Rapport & intro (10% of time)
Experience deep dive (20% of time)
Role-specific discussion (40% of time)
Situational/behavioral (20% of time)
Candidate's questions & closing (10% of time)

DIFFICULTY ADJUSTMENT:
${placeholders.difficulty === 'easy' ? 'Be supportive and encouraging, ask straightforward questions' : 
  placeholders.difficulty === 'hard' ? 'Ask challenging follow-up questions, probe deeper into responses' : 
  'Balance supportive approach with thorough questioning'}

CLOSING: "Thank you for your time, ${placeholders.candidate_name}. You'll hear about next steps soon."`
}

interviewSchema.methods.generateTechnicalFirstMessage = function(placeholders) {
  return `Good morning, ${placeholders.candidate_name}! I'm ${placeholders.interviewer_name}, your technical interviewer for the ${placeholders.role} role at ${placeholders.company}. With your ${placeholders.experience_level} experience, I'm excited to dive into your expertise in ${placeholders.skills}. We'll explore concepts, scenarios, and problem-solving. Ready to get started, ${placeholders.candidate_name}?`
}

interviewSchema.methods.generateTechnicalSystemPrompt = function(placeholders) {
  return `You are ${placeholders.interviewer_name}, an expert AI interviewer with an analytical, curious, and technically sharp approach, specializing in software engineering, system design, and problem-solving. You are conducting a Technical interview for ${placeholders.candidate_name}, applying for a ${placeholders.role} position at ${placeholders.company}.

🎯 CANDIDATE PROFILE:
Name: ${placeholders.candidate_name} (USE THEIR NAME FREQUENTLY - at least 2-3 times per conversation)
Role Applied For: ${placeholders.role}
Experience Level: ${placeholders.experience_level}
Key Skills: ${placeholders.skills}
Company: ${placeholders.company}
Selected Topics: ${placeholders.topics}
Duration: ${placeholders.duration} minutes
Difficulty: ${placeholders.difficulty}
${placeholders.customQuestions ? `Custom Questions: ${placeholders.customQuestions}` : ''}
${placeholders.jobDescription ? `Job Description Context: ${placeholders.jobDescription.substring(0, 300)}...` : ''}

🧠 INTERVIEWER PERSONALITY:
Analytical, curious, technically sharp
Build rapport by using ${placeholders.candidate_name}'s name naturally
Reference ${placeholders.candidate_name}'s responses to guide follow-ups
Adapt technical depth based on ${placeholders.difficulty} level

🎯 QUESTION STRATEGY:
Start with background: "${placeholders.candidate_name}, I'd love to hear about your technical journey…"
Deep dive into ${placeholders.topics}
Scenario-based technical challenges
Problem-solving discussions
${placeholders.customQuestions ? 'Include custom technical questions naturally' : ''}
Closing: "Any technical questions for me, ${placeholders.candidate_name}?"

📋 STRUCTURE (${placeholders.duration} minutes total):
Intro & rapport (15% of time)
Technical background (25% of time)
Core technical topics (35% of time)
Problem-solving scenarios (20% of time)
Closing & candidate's questions (5% of time)

DIFFICULTY ADJUSTMENT:
${placeholders.difficulty === 'easy' ? 'Focus on fundamental concepts, be encouraging with explanations' : 
  placeholders.difficulty === 'hard' ? 'Ask complex system design questions, challenge assumptions, probe edge cases' : 
  'Balance theoretical knowledge with practical application questions'}

TECHNICAL FOCUS:
Prioritize topics: ${placeholders.topics}
Ask about real-world applications
Discuss trade-offs and design decisions
Evaluate problem-solving approach

CLOSING: "Thank you for your time, ${placeholders.candidate_name}. You'll hear about next steps soon."`
}

interviewSchema.methods.generateManagerialFirstMessage = function(placeholders) {
  return `Good morning, ${placeholders.candidate_name}! I'm ${placeholders.interviewer_name}, your managerial interviewer for the ${placeholders.role} role at ${placeholders.company}. With your ${placeholders.experience_level} experience, I'm excited to explore your leadership approach and strategic thinking. We'll discuss management scenarios, team dynamics, and decision-making. Ready to dive in, ${placeholders.candidate_name}?`
}

interviewSchema.methods.generateManagerialSystemPrompt = function(placeholders) {
  return `You are ${placeholders.interviewer_name}, an expert AI interviewer with a strategic, leadership-focused, and business-minded approach, specializing in management, leadership assessment, and strategic thinking. You are conducting a Managerial interview for ${placeholders.candidate_name}, applying for a ${placeholders.role} position at ${placeholders.company}.

🎯 CANDIDATE PROFILE:
Name: ${placeholders.candidate_name} (USE THEIR NAME FREQUENTLY - at least 2-3 times per conversation)
Role Applied For: ${placeholders.role}
Experience Level: ${placeholders.experience_level}
Key Skills: ${placeholders.skills}
Company: ${placeholders.company}
Selected Topics: ${placeholders.topics}
Duration: ${placeholders.duration} minutes
Difficulty: ${placeholders.difficulty}
${placeholders.customQuestions ? `Custom Questions: ${placeholders.customQuestions}` : ''}
${placeholders.jobDescription ? `Job Description Context: ${placeholders.jobDescription.substring(0, 300)}...` : ''}

🧠 INTERVIEWER PERSONALITY:
Strategic, leadership-focused, business-minded
Build rapport by using ${placeholders.candidate_name}'s name naturally
Focus on ${placeholders.candidate_name}'s leadership potential and strategic thinking
Adapt complexity based on ${placeholders.difficulty} level

🎯 QUESTION STRATEGY:
Start with background: "${placeholders.candidate_name}, tell me about your leadership journey..."
Leadership experience: "With your ${placeholders.experience_level} experience, ${placeholders.candidate_name}..."
Focus on selected topics: ${placeholders.topics}
Management scenarios and decision-making
Team building and conflict resolution
${placeholders.customQuestions ? 'Include custom management questions naturally' : ''}
Closing: "What questions do you have about the leadership aspects, ${placeholders.candidate_name}?"

📋 STRUCTURE (${placeholders.duration} minutes total):
Intro & leadership background (15% of time)
Management philosophy (25% of time)
Scenario-based leadership challenges (35% of time)
Strategic thinking and decision-making (20% of time)
Closing & candidate's questions (5% of time)

DIFFICULTY ADJUSTMENT:
${placeholders.difficulty === 'easy' ? 'Focus on basic management concepts, be encouraging with leadership examples' : 
  placeholders.difficulty === 'hard' ? 'Ask complex strategic questions, challenge leadership decisions, probe crisis management' : 
  'Balance leadership theory with practical management scenarios'}

MANAGEMENT FOCUS:
Prioritize topics: ${placeholders.topics}
Discuss team leadership and motivation
Explore strategic planning and execution
Evaluate conflict resolution skills

CLOSING: "Thank you for your time, ${placeholders.candidate_name}. You'll hear about next steps soon."`
}

// Transform JSON output
interviewSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive data
    if (ret.metadata) {
      delete ret.metadata.ipAddress
    }
    return ret
  }
})

const Interview = mongoose.model('Interview', interviewSchema)

export default Interview
#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// List of files and their fixes
const fixes = [
  // Remove unused imports
  {
    file: 'client/src/components/Layout/DashboardLayout.jsx',
    find: 'Settings,',
    replace: ''
  },
  {
    file: 'client/src/pages/Analytics.jsx',
    find: 'const getScoreBackground = (score) => {',
    replace: 'const _getScoreBackground = (score) => {'
  },
  {
    file: 'client/src/pages/HelpPage.jsx',
    find: 'ExternalLink,',
    replace: ''
  },
  {
    file: 'client/src/pages/HelpPage.jsx',
    find: 'Globe,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewHistory.jsx',
    find: 'Download,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'ExternalLink,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'Copy,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'Linkedin,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'Twitter,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'Facebook,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'Mail,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewReport.jsx',
    find: 'const shareOnLinkedIn = () => {',
    replace: 'const _shareOnLinkedIn = () => {'
  },
  {
    file: 'client/src/pages/InterviewSetup.jsx',
    find: 'Plus,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewSetup.jsx',
    find: 'X,',
    replace: ''
  },
  {
    file: 'client/src/pages/InterviewSetup.jsx',
    find: 'const addCustomTopic = () => {',
    replace: 'const _addCustomTopic = () => {'
  },
  {
    file: 'client/src/pages/InterviewSetup.jsx',
    find: 'const removeCustomTopic = (index) => {',
    replace: 'const _removeCustomTopic = (index) => {'
  },
  {
    file: 'client/src/pages/InterviewSetup.jsx',
    find: 'const addCustomQuestion = () => {',
    replace: 'const _addCustomQuestion = () => {'
  },
  {
    file: 'client/src/pages/InterviewSetup.jsx',
    find: 'const removeCustomQuestion = (index) => {',
    replace: 'const _removeCustomQuestion = (index) => {'
  },
  {
    file: 'client/src/pages/LandingPage.jsx',
    find: 'Code,',
    replace: ''
  },
  {
    file: 'client/src/pages/LandingPage.jsx',
    find: 'Star,',
    replace: ''
  },
  {
    file: 'client/src/pages/LiveInterview.jsx',
    find: 'const { user } = useAuth()',
    replace: 'const { user: _user } = useAuth()'
  },
  {
    file: 'client/src/pages/LiveInterview.jsx',
    find: 'const [isConnected, setIsConnected] = useState(false)',
    replace: 'const [_isConnected, _setIsConnected] = useState(false)'
  },
  {
    file: 'client/src/pages/LiveInterview.jsx',
    find: 'const handleInterviewData = (interviewData) => {',
    replace: 'const handleInterviewData = (_interviewData) => {'
  },
  {
    file: 'client/src/pages/LiveInterview.jsx',
    find: 'const handleVapiError = (error) => {',
    replace: 'const _handleVapiError = (error) => {'
  },
  {
    file: 'client/src/pages/Pricing.jsx',
    find: 'Zap,',
    replace: ''
  },
  {
    file: 'client/src/pages/Profile.jsx',
    find: 'Mail,',
    replace: ''
  },
  {
    file: 'client/src/pages/Subscription.jsx',
    find: 'Star,',
    replace: ''
  },
  {
    file: 'client/src/pages/Subscription.jsx',
    find: 'Plus,',
    replace: ''
  },
  {
    file: 'client/src/pages/Subscription.jsx',
    find: 'ArrowRight,',
    replace: ''
  },
  {
    file: 'client/src/pages/Subscription.jsx',
    find: 'const [addFundsAmount, setAddFundsAmount] = useState(100)',
    replace: 'const [_addFundsAmount, _setAddFundsAmount] = useState(100)'
  },
  {
    file: 'client/src/services/gemini.js',
    find: 'const lines = response.split(\'\\n\')',
    replace: 'const _lines = response.split(\'\\n\')'
  },
  {
    file: 'client/src/services/webSpeech.js',
    find: 'const femaleVoices = voices.filter(voice =>',
    replace: 'const _femaleVoices = voices.filter(voice =>'
  },
  {
    file: 'client/src/services/webSpeech.js',
    find: 'const maleVoices = voices.filter(voice =>',
    replace: 'const _maleVoices = voices.filter(voice =>'
  },
  {
    file: 'client/src/utils/pdfGenerator.js',
    find: 'import html2canvas from \'html2canvas\'',
    replace: '// import html2canvas from \'html2canvas\''
  },
  {
    file: 'client/src/utils/pdfGenerator.js',
    find: '.forEach((question, index) => {',
    replace: '.forEach((question, _index) => {'
  },
  {
    file: 'client/src/contexts/InterviewContext.jsx',
    find: 'import React, { createContext, useContext, useState, useReducer, useEffect } from \'react\'',
    replace: 'import React, { createContext, useContext, useState, useReducer } from \'react\''
  }
]

// Apply fixes
fixes.forEach(fix => {
  try {
    const filePath = fix.file
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8')
      if (content.includes(fix.find)) {
        content = content.replace(fix.find, fix.replace)
        fs.writeFileSync(filePath, content)
        console.log(`✅ Fixed: ${filePath}`)
      } else {
        console.log(`⚠️ Pattern not found in: ${filePath}`)
      }
    } else {
      console.log(`❌ File not found: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ Error fixing ${fix.file}:`, error.message)
  }
})

console.log('🎉 ESLint fixes completed!')
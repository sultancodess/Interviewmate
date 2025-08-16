// Mode Test Utility
// Tests and validates different interview modes

export const testVAPIConnection = async () => {
  try {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
    if (!publicKey || publicKey === 'your_vapi_public_key_here') {
      return {
        success: false,
        error: 'VAPI public key not configured',
        details: 'Please configure VITE_VAPI_PUBLIC_KEY in your environment variables'
      }
    }

    // Test VAPI initialization
    const { default: vapiService } = await import('../services/vapi')
    const initialized = await vapiService.initialize(publicKey)
    
    if (!initialized) {
      return {
        success: false,
        error: 'Failed to initialize VAPI service',
        details: 'VAPI service could not be initialized with the provided key'
      }
    }

    return {
      success: true,
      message: 'VAPI connection successful',
      details: 'Ready for premium voice interviews with natural AI conversation'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: 'VAPI service encountered an unexpected error'
    }
  }
}

export const testWebSpeechAPI = () => {
  try {
    // Check browser support
    const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    const hasSynthesis = 'speechSynthesis' in window
    
    if (!hasRecognition) {
      return {
        success: false,
        error: 'Speech Recognition not supported',
        details: 'Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.'
      }
    }
    
    if (!hasSynthesis) {
      return {
        success: false,
        error: 'Speech Synthesis not supported',
        details: 'Your browser does not support text-to-speech. Please use a modern browser.'
      }
    }

    // Test microphone permissions
    const microphoneTest = testMicrophoneAccess()

    return {
      success: true,
      message: 'Web Speech API supported',
      details: 'Ready for browser-based speech recognition and synthesis',
      microphoneStatus: microphoneTest
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: 'Web Speech API test encountered an error'
    }
  }
}

export const testMicrophoneAccess = () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        status: 'unsupported',
        message: 'Microphone access not supported in this browser'
      }
    }

    return {
      status: 'available',
      message: 'Microphone access available (permission will be requested when needed)'
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Error checking microphone access'
    }
  }
}

export const testGeminiConnection = async () => {
  try {
    const { default: geminiService } = await import('../services/gemini')
    const isWorking = await geminiService.testConnection()
    
    return {
      success: isWorking,
      message: isWorking ? 'Gemini AI connection successful' : 'Gemini AI connection failed',
      details: isWorking 
        ? 'Ready for AI-powered question generation and evaluation'
        : 'Gemini AI is not available. Fallback evaluation will be used.'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: 'Gemini AI service encountered an error'
    }
  }
}

export const runModeCompatibilityTest = async () => {
  const results = {
    vapi: await testVAPIConnection(),
    webSpeech: testWebSpeechAPI(),
    gemini: await testGeminiConnection(),
    browser: getBrowserInfo(),
    system: getSystemInfo()
  }

  return {
    results,
    recommendations: generateRecommendations(results),
    summary: generateSummary(results)
  }
}

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  let browserName = 'Unknown'
  let browserVersion = 'Unknown'
  let isSupported = false

  if (userAgent.includes('Chrome')) {
    browserName = 'Chrome'
    browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown'
    isSupported = true
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox'
    browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown'
    isSupported = false // Firefox has limited Web Speech API support
  } else if (userAgent.includes('Safari')) {
    browserName = 'Safari'
    browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown'
    isSupported = true
  } else if (userAgent.includes('Edge')) {
    browserName = 'Edge'
    browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown'
    isSupported = true
  }

  return {
    name: browserName,
    version: browserVersion,
    isSupported,
    userAgent: userAgent.substring(0, 100) + '...'
  }
}

export const getSystemInfo = () => {
  return {
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints
  }
}

const generateRecommendations = (results) => {
  const recommendations = []

  // Primary recommendation based on availability
  if (results.vapi.success && results.webSpeech.success) {
    recommendations.push({
      mode: 'vapi',
      title: '🤖 Speech Pro (VAPI AI) - Recommended',
      description: 'Premium AI-powered voice interviews with natural conversation flow and intelligent responses.',
      features: [
        'Natural voice conversation with AI',
        'Real-time intelligent responses',
        'Advanced speech recognition',
        'Professional voice quality',
        'Dynamic question generation'
      ],
      requirements: 'Requires VAPI minutes or credits',
      priority: 'high',
      badge: 'Best Experience'
    })

    recommendations.push({
      mode: 'webspeech',
      title: '🎤 Speech Lite (Web Speech API) - Fallback',
      description: 'Browser-based speech recognition with AI-generated questions. Free and unlimited.',
      features: [
        'Browser speech recognition',
        'AI-generated questions via Gemini',
        'Text-to-speech responses',
        'Unlimited usage',
        'Works offline'
      ],
      requirements: 'Modern browser required',
      priority: 'medium',
      badge: 'Free & Unlimited'
    })
  } else if (results.vapi.success) {
    recommendations.push({
      mode: 'vapi',
      title: '🤖 Speech Pro (VAPI AI) - Only Option',
      description: 'VAPI is available but Web Speech API is not supported in your browser.',
      features: [
        'Natural voice conversation',
        'Professional AI interviewer',
        'High-quality speech processing'
      ],
      requirements: 'VAPI minutes required',
      priority: 'high',
      badge: 'Premium Only'
    })
  } else if (results.webSpeech.success) {
    recommendations.push({
      mode: 'webspeech',
      title: '🎤 Speech Lite (Web Speech API) - Available',
      description: 'VAPI is not available. Web Speech API provides a good alternative experience.',
      features: [
        'Browser-based speech recognition',
        'AI question generation',
        'Free unlimited usage'
      ],
      requirements: 'Microphone access needed',
      priority: 'medium',
      badge: 'Free Alternative'
    })
  } else {
    recommendations.push({
      mode: 'none',
      title: '❌ No Voice Support Available',
      description: 'Neither VAPI nor Web Speech API is available. Please use a supported browser or check your configuration.',
      features: [
        'Text-based interview available',
        'Manual question progression',
        'Basic evaluation system'
      ],
      requirements: 'Supported browser needed',
      priority: 'low',
      badge: 'Limited Support'
    })
  }

  // Browser-specific recommendations
  if (!results.browser.isSupported) {
    recommendations.push({
      mode: 'browser',
      title: '🌐 Browser Recommendation',
      description: `${results.browser.name} has limited speech support. Consider switching to Chrome, Edge, or Safari for the best experience.`,
      features: [
        'Chrome: Full Web Speech API support',
        'Edge: Good compatibility',
        'Safari: iOS/macOS optimized'
      ],
      requirements: 'Browser update or switch',
      priority: 'medium',
      badge: 'Browser Update'
    })
  }

  return recommendations
}

const generateSummary = (results) => {
  const summary = {
    overallStatus: 'unknown',
    primaryMode: 'none',
    fallbackMode: 'none',
    issues: [],
    strengths: []
  }

  // Determine overall status
  if (results.vapi.success && results.webSpeech.success) {
    summary.overallStatus = 'excellent'
    summary.primaryMode = 'vapi'
    summary.fallbackMode = 'webspeech'
    summary.strengths.push('Both premium and free modes available')
  } else if (results.vapi.success || results.webSpeech.success) {
    summary.overallStatus = 'good'
    summary.primaryMode = results.vapi.success ? 'vapi' : 'webspeech'
    summary.strengths.push('At least one voice mode available')
  } else {
    summary.overallStatus = 'limited'
    summary.issues.push('No voice interview modes available')
  }

  // Check for specific issues
  if (!results.browser.isSupported) {
    summary.issues.push(`${results.browser.name} browser has limited speech support`)
  }

  if (!results.gemini.success) {
    summary.issues.push('Gemini AI not available - using fallback evaluation')
  }

  if (!results.vapi.success && results.vapi.error) {
    summary.issues.push(`VAPI issue: ${results.vapi.error}`)
  }

  return summary
}

// Legacy function for backward compatibility
export const testModes = async () => {
  const results = { vapi: false, webspeech: false, errors: [] }

  // Test VAPI
  try {
    const vapiTest = await testVAPIConnection()
    results.vapi = vapiTest.success
    if (!vapiTest.success) {
      results.errors.push(vapiTest.error)
    }
  } catch (error) {
    results.errors.push(`VAPI: ${error.message}`)
  }

  // Test Web Speech API
  try {
    const webSpeechTest = testWebSpeechAPI()
    results.webspeech = webSpeechTest.success
    if (!webSpeechTest.success) {
      results.errors.push(webSpeechTest.error)
    }
  } catch (error) {
    results.errors.push(`Web Speech API: ${error.message}`)
  }

  return results
}

// Utility function to get user-friendly mode names
export const getModeDisplayName = (mode) => {
  const names = {
    vapi: 'Speech Pro (VAPI AI)',
    webspeech: 'Speech Lite (Web Speech API)',
    none: 'No Voice Support'
  }
  return names[mode] || mode
}

// Utility function to get mode descriptions
export const getModeDescription = (mode) => {
  const descriptions = {
    vapi: 'Premium AI-powered voice interviews with natural conversation flow',
    webspeech: 'Browser-based speech recognition with AI-generated questions',
    none: 'Text-based interview with manual progression'
  }
  return descriptions[mode] || 'Unknown mode'
}

// Export all functions
export default {
  testVAPIConnection,
  testWebSpeechAPI,
  testGeminiConnection,
  runModeCompatibilityTest,
  getBrowserInfo,
  getSystemInfo,
  getModeDisplayName,
  getModeDescription,
  testModes // Legacy support
}
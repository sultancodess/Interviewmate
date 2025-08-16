// VAPI Configuration Validator
export const validateVapiConfig = () => {
  const config = {
    publicKey: import.meta.env.VITE_VAPI_PUBLIC_KEY,
    hrAssistantId: import.meta.env.VITE_VAPI_HR_ASSISTANT_ID,
    technicalAssistantId: import.meta.env.VITE_VAPI_TECHNICAL_ASSISTANT_ID,
    isEnabled: import.meta.env.VITE_ENABLE_VAPI_INTEGRATION === 'true'
  }

  const issues = []
  
  if (!config.isEnabled) {
    issues.push('VAPI integration is disabled')
  }
  
  if (!config.publicKey || config.publicKey === 'your_vapi_public_key_here') {
    issues.push('VAPI public key is not configured')
  }
  
  if (!config.hrAssistantId) {
    issues.push('HR assistant ID is not configured')
  }
  
  if (!config.technicalAssistantId) {
    issues.push('Technical assistant ID is not configured')
  }

  return {
    isValid: issues.length === 0,
    config,
    issues
  }
}

export const logVapiStatus = () => {
  const validation = validateVapiConfig()
  
  if (validation.isValid) {
    console.log('✅ VAPI configuration is valid')
  } else {
    console.warn('⚠️ VAPI configuration issues:', validation.issues)
  }
  
  return validation
}

export const getVapiAssistantId = (interviewType) => {
  const validation = validateVapiConfig()
  
  if (!validation.isValid) {
    console.warn('VAPI not properly configured, using fallback')
    return null
  }
  
  const assistantIds = {
    hr: validation.config.hrAssistantId,
    technical: validation.config.technicalAssistantId
  }
  
  return assistantIds[interviewType] || assistantIds.hr
}

export const isVapiAvailable = () => {
  const validation = validateVapiConfig()
  return validation.isValid && validation.config.isEnabled
}
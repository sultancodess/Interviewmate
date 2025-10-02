/**
 * Google OAuth Utilities
 * Handles Cross-Origin-Opener-Policy issues and provides fallbacks
 */

export const initializeGoogleAuth = (clientId, callback) => {
  return new Promise((resolve, reject) => {
    try {
      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'))
        return
      }

      // Initialize with COOP-friendly settings
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false,
        itp_support: true,
        // COOP-friendly settings
        ux_mode: 'popup',
        context: 'signin',
        state_cookie_domain: window.location.hostname
      })

      resolve(true)
    } catch (error) {
      console.error('Google Auth initialization error:', error)
      reject(error)
    }
  })
}

export const handleCOOPError = () => {
  console.warn('Cross-Origin-Opener-Policy blocked Google OAuth popup')
  
  // Provide user-friendly message
  return {
    success: false,
    message: 'Google sign-in temporarily unavailable due to browser security settings. Please use email/password login.',
    fallback: true
  }
}

export const renderGoogleButton = (containerId, options = {}) => {
  try {
    const container = document.getElementById(containerId)
    if (!container || !window.google) {
      throw new Error('Container or Google services not available')
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      width: 300,
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      type: 'standard'
    }

    const buttonOptions = { ...defaultOptions, ...options }
    
    container.innerHTML = '' // Clear previous content
    window.google.accounts.id.renderButton(container, buttonOptions)
    
    return true
  } catch (error) {
    console.error('Google button render error:', error)
    return false
  }
}

export const promptGoogleSignIn = () => {
  return new Promise((resolve) => {
    try {
      window.google.accounts.id.prompt((notification) => {
        resolve({
          success: !notification.isNotDisplayed() && !notification.isSkippedMoment(),
          notification
        })
      })
    } catch (error) {
      console.error('Google prompt error:', error)
      resolve({ success: false, error })
    }
  })
}
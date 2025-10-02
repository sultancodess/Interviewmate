import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const GoogleOAuthButton = ({
  onSuccess,
  onError,
  text = "Continue with Google",
}) => {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [showGoogleButton, setShowGoogleButton] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          setGoogleLoaded(true);
        }
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services");
        toast.error("Failed to load Google sign-in");
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  useEffect(() => {
    if (
      googleLoaded &&
      window.google &&
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    ) {
      try {
        // Initialize Google Identity Services with COOP-friendly settings
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
          itp_support: true,
          // Add COOP-friendly settings
          ux_mode: 'popup', // Use popup mode instead of redirect
          context: 'signin'
        });
      } catch (error) {
        console.error("Failed to initialize Google Identity Services:", error);
        toast.error("Google sign-in initialization failed");
      }
    }
  }, [googleLoaded]);

  const handleCredentialResponse = async (response) => {
    if (!response.credential) {
      toast.error("Google sign-in failed - no credential received");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Google credential received, attempting login...");
      const result = await googleLogin(response.credential);

      if (result.success) {
        toast.success("Successfully signed in with Google!");
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        console.error("Google login failed:", result.message);
        toast.error(result.message || "Google sign-in failed");
        if (onError) {
          onError(result);
        }
      }
    } catch (error) {
      console.error("Google OAuth error:", error);
      toast.error("Google sign-in failed - please try again");
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
      setShowGoogleButton(false); // Hide Google button after attempt
    }
  };

  const handleGoogleSignIn = () => {
    if (!googleLoaded || !window.google) {
      toast.error("Google sign-in not available");
      return;
    }

    if (showGoogleButton) {
      // Hide the Google button and show our custom button
      setShowGoogleButton(false);
      return;
    }

    try {
      // Use One Tap prompt with COOP-friendly settings
      window.google.accounts.id.prompt((notification) => {
        console.log('Google One Tap notification:', notification)
        
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to button rendering
          setShowGoogleButton(true)
          
          setTimeout(() => {
            const buttonContainer = document.getElementById('google-signin-button')
            if (buttonContainer) {
              buttonContainer.innerHTML = ''
              
              try {
                window.google.accounts.id.renderButton(buttonContainer, {
                  theme: 'outline',
                  size: 'large',
                  width: 300,
                  text: 'continue_with',
                  shape: 'rectangular',
                  logo_alignment: 'left',
                  type: 'standard'
                })
              } catch (renderError) {
                console.error('Button render error:', renderError)
                setShowGoogleButton(false)
                toast.error('Google sign-in temporarily unavailable')
              }
            }
          }, 100)
        }
      })
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
      setShowGoogleButton(false);
    }
  };

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full p-4 text-center text-gray-500 border border-gray-200 rounded-md">
        Google OAuth not configured
      </div>
    );
  }

  return (
    <div className="w-full">
      {!showGoogleButton && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || !googleLoaded}
          className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{text}</span>
            </>
          )}
        </button>
      )}

      {/* Container for Google button rendering */}
      <div
        id="google-signin-button"
        className={`w-full ${showGoogleButton ? "block" : "hidden"}`}
        ref={buttonRef}
      ></div>

      {showGoogleButton && (
        <button
          type="button"
          onClick={() => setShowGoogleButton(false)}
          className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Use custom sign-in instead
        </button>
      )}
    </div>
  );
};

export default GoogleOAuthButton;

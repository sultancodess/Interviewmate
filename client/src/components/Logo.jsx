import React from 'react'

const Logo = ({ 
  size = 'md', 
  showText = true, 
  className = '', 
  textColor = 'text-gray-900',
  variant = 'default' 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }

  const textSizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  }

  const LogoSVG = ({ className: svgClassName }) => (
    <svg 
      className={svgClassName}
      viewBox="0 0 41 41" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20.1014 40.3232C31.1472 40.3232 40.1014 31.3689 40.1014 20.3232C40.1014 9.27754 31.1472 0.323242 20.1014 0.323242C9.05573 0.323242 0.10144 9.27754 0.10144 20.3232C0.10144 31.3689 9.05573 40.3232 20.1014 40.3232ZM23.1884 15.7758C24.8932 14.0709 24.8932 11.3068 23.1884 9.6019C21.4835 7.89702 18.7194 7.89702 17.0145 9.6019C15.3097 11.3068 15.3097 14.0709 17.0145 15.7758L20.1014 18.8627L23.1884 15.7758ZM24.6489 23.4102C26.3538 25.1151 29.1179 25.1151 30.8228 23.4102C32.5276 21.7053 32.5276 18.9412 30.8228 17.2363C29.1179 15.5315 26.3538 15.5315 24.6489 17.2363L21.562 20.3233L24.6489 23.4102ZM23.1884 31.0446C24.8932 29.3397 24.8932 26.5756 23.1884 24.8707L20.1014 21.7838L17.0145 24.8707C15.3097 26.5756 15.3097 29.3397 17.0145 31.0446C18.7194 32.7495 21.4835 32.7495 23.1884 31.0446ZM9.38007 23.4102C7.67523 21.7053 7.67523 18.9412 9.38007 17.2363C11.085 15.5315 13.8491 15.5315 15.554 17.2363L18.6409 20.3233L15.554 23.4102C13.8491 25.1151 11.085 25.1151 9.38007 23.4102Z" 
        fill="currentColor"
        className="text-blue-600"
      />
    </svg>
  )

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center ${className}`}>
        <LogoSVG className={sizeClasses[size]} />
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoSVG className={sizeClasses[size]} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} ${textColor} leading-tight`}>
            InterviewMate
          </span>
          {size === 'xl' || size === '2xl' ? (
            <span className="text-xs text-gray-500 -mt-1">
              AI-Powered Interview Practice
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Logo
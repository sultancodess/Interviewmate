import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = '', 
  className = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        />
        {text && (
          <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
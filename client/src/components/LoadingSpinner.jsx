import React from 'react'
import { Loader } from 'lucide-react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader className={`${sizeClasses[size]} animate-spin text-blue-500 mb-2`} />
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
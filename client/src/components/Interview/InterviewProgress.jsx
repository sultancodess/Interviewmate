import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Square
} from 'lucide-react'

const InterviewProgress = ({ 
  duration, 
  totalDuration, 
  questionCount, 
  totalQuestions, 
  status,
  currentQuestion,
  onStatusChange 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(totalDuration * 60 - duration)

  useEffect(() => {
    setTimeRemaining(Math.max(0, totalDuration * 60 - duration))
  }, [duration, totalDuration])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return Math.min((duration / (totalDuration * 60)) * 100, 100)
  }

  const getQuestionProgress = () => {
    return Math.min((questionCount / totalQuestions) * 100, 100)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'connecting':
        return 'text-yellow-600 bg-yellow-100'
      case 'paused':
        return 'text-orange-600 bg-orange-100'
      case 'ended':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Play className="w-4 h-4" />
      case 'connecting':
        return <AlertCircle className="w-4 h-4 animate-pulse" />
      case 'paused':
        return <Pause className="w-4 h-4" />
      case 'ended':
        return <Square className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Interview Progress</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{status}</span>
        </div>
      </div>

      {/* Time Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Progress</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-mono font-bold text-lg">{formatTime(duration)}</span>
            <span className="text-gray-400"> / {formatTime(totalDuration * 60)}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Started</span>
          <span>{Math.round(getProgressPercentage())}% Complete</span>
          <span>Time Remaining: {formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Question Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Questions</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-bold">{questionCount}</span>
            <span className="text-gray-400"> / {totalQuestions}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getQuestionProgress()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Question 1</span>
          <span>{Math.round(getQuestionProgress())}% Complete</span>
          <span>Question {totalQuestions}</span>
        </div>
      </div>

      {/* Current Question */}
      {currentQuestion && status === 'connected' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{questionCount}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Current Question</h4>
              <p className="text-sm text-blue-800">{currentQuestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interview Milestones */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Milestones</h4>
        <div className="flex items-center space-x-6 text-xs">
          <div className={`flex items-center space-x-1 ${questionCount >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="w-3 h-3" />
            <span>Started</span>
          </div>
          <div className={`flex items-center space-x-1 ${questionCount >= Math.floor(totalQuestions * 0.25) ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="w-3 h-3" />
            <span>25% Complete</span>
          </div>
          <div className={`flex items-center space-x-1 ${questionCount >= Math.floor(totalQuestions * 0.5) ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="w-3 h-3" />
            <span>Halfway</span>
          </div>
          <div className={`flex items-center space-x-1 ${questionCount >= Math.floor(totalQuestions * 0.75) ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="w-3 h-3" />
            <span>75% Complete</span>
          </div>
          <div className={`flex items-center space-x-1 ${questionCount >= totalQuestions ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle className="w-3 h-3" />
            <span>Finished</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewProgress
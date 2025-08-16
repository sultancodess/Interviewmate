import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService, handleApiResponse } from '../services/api'
import toast from 'react-hot-toast'

const InterviewContext = createContext()

export const useInterview = () => {
  const context = useContext(InterviewContext)
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }
  return context
}

export const InterviewProvider = ({ children }) => {
  const [currentInterview, setCurrentInterview] = useState(null)
  const [interviewHistory, setInterviewHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const createInterview = async (interviewData) => {
    try {
      setLoading(true)
      const result = await handleApiResponse(() => apiService.interview.create(interviewData))
      
      if (result.success) {
        setCurrentInterview(result.data.interview)
        toast.success('Interview created successfully!')
        return { success: true, interview: result.data.interview }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to create interview'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const getInterview = async (interviewId) => {
    try {
      setLoading(true)
      const result = await handleApiResponse(() => apiService.interview.getById(interviewId))
      
      if (result.success) {
        setCurrentInterview(result.data.interview)
        return { success: true, interview: result.data.interview }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to fetch interview'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const updateInterview = async (interviewId, updateData) => {
    try {
      const result = await handleApiResponse(() => apiService.interview.update(interviewId, updateData))
      
      if (result.success) {
        setCurrentInterview(result.data.interview)
        return { success: true, interview: result.data.interview }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to update interview'
      return { success: false, message }
    }
  }

  const evaluateInterview = async (interviewId, transcript) => {
    try {
      setLoading(true)
      const result = await handleApiResponse(() => apiService.interview.evaluate(interviewId, transcript))
      
      if (result.success) {
        setCurrentInterview(result.data.interview)
        toast.success('Interview evaluated successfully!')
        return { success: true, evaluation: result.data.evaluation }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to evaluate interview'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const getInterviewHistory = async (params = {}) => {
    try {
      setLoading(true)
      const result = await handleApiResponse(() => apiService.interview.getHistory(params))
      
      if (result.success) {
        setInterviewHistory(result.data.interviews)
        return { 
          success: true, 
          interviews: result.data.interviews,
          pagination: result.data.pagination 
        }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to fetch interview history'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const deleteInterview = async (interviewId) => {
    try {
      const result = await handleApiResponse(() => apiService.interview.delete(interviewId))
      
      if (result.success) {
        setInterviewHistory(prev => prev.filter(interview => interview._id !== interviewId))
        toast.success('Interview deleted successfully!')
        return { success: true }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to delete interview'
      return { success: false, message }
    }
  }

  const getAnalytics = async () => {
    try {
      const result = await handleApiResponse(() => apiService.interview.getAnalytics())
      
      if (result.success) {
        return { success: true, analytics: result.data.analytics }
      } else {
        return { success: false, message: result.error }
      }
    } catch (error) {
      const message = error.message || 'Failed to fetch analytics'
      return { success: false, message }
    }
  }

  const value = {
    currentInterview,
    interviewHistory,
    loading,
    createInterview,
    getInterview,
    updateInterview,
    evaluateInterview,
    getInterviewHistory,
    deleteInterview,
    getAnalytics,
    setCurrentInterview
  }

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  )
}
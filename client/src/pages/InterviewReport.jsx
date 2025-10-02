/**
 * InterviewReport Page
 * 
 * This page displays a comprehensive interview report with:
 * - Professional, polished report layout
 * - Overall score with circular progress indicator
 * - Skill-wise analysis with charts
 * - Strengths, weaknesses, and improvement plan
 * - Achievement badges
 * - Download PDF functionality
 * - Social sharing options
 * - Persistent storage and history access
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInterview } from '../contexts/InterviewContext'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import InterviewReportCard from '../components/Reports/InterviewReportCard'
import SocialShare from '../components/SocialShare'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'
import { generatePDF } from '../utils/pdfGenerator'

const InterviewReport = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getInterview } = useInterview()
  
  // State
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  /**
   * Load interview data
   */
  useEffect(() => {
    if (id) {
      loadInterview()
    }
  }, [id])

  /**
   * Generate shareable URL
   */
  useEffect(() => {
    if (interview) {
      // Generate a shareable URL (in production, this would be a public link)
      const baseUrl = window.location.origin
      setShareUrl(`${baseUrl}/report/public/${interview._id}`)
    }
  }, [interview])

  /**
   * Load interview data
   */
  const loadInterview = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getInterview(id)
      
      if (result.success) {
        setInterview(result.interview)
        
        // Check if interview is completed and has evaluation
        if (result.interview.status !== 'completed') {
          setError('Interview is not completed yet')
        } else if (!result.interview.evaluation) {
          setError('Interview evaluation is not available')
        }
      } else {
        setError(result.message || 'Failed to load interview report')
      }
    } catch (error) {
      console.error('Failed to load interview:', error)
      setError('Failed to load interview report')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle PDF download
   */
  const handleDownloadPDF = async () => {
    if (!interview) return

    try {
      setGeneratingPDF(true)
      toast.loading('Generating PDF report...', { id: 'pdf-generation' })
      
      // Generate PDF using the utility function
      const pdfBlob = await generatePDF(interview)
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `interview-report-${interview.candidateInfo.name}-${new Date(interview.createdAt).toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' })
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' })
    } finally {
      setGeneratingPDF(false)
    }
  }

  /**
   * Handle share modal
   */
  const handleShare = () => {
    setShowShareModal(true)
  }

  /**
   * Copy share URL to clipboard
   */
  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
      toast.error('Failed to copy link')
    }
  }

  /**
   * Share via email
   */
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Interview Report - ${interview.candidateInfo.name}`)
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to share my interview report with you.\n\nCandidate: ${interview.candidateInfo.name}\nRole: ${interview.candidateInfo.role}\nCompany: ${interview.candidateInfo.company}\nOverall Score: ${interview.evaluation.overallScore}%\n\nView the full report: ${shareUrl}\n\nBest regards`
    )
    
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  /**
   * Share on LinkedIn
   */
  const shareOnLinkedIn = () => {
    const text = encodeURIComponent(
      `Just completed an AI-powered interview practice session! Scored ${interview.evaluation.overallScore}% overall. Great way to prepare for real interviews. #InterviewPrep #CareerDevelopment #AI`
    )
    const url = encodeURIComponent(shareUrl)
    
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`, '_blank')
  }

  /**
   * Share on Twitter
   */
  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Just aced my AI interview practice with ${interview.evaluation.overallScore}% score! 🚀 Great prep for the real thing. Check out @InterviewMate for AI-powered interview practice! #InterviewPrep #AI`
    )
    const url = encodeURIComponent(shareUrl)
    
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading interview report..." />
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Report Not Available</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={loadInterview}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/history"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to History</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Interview Report</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {interview && interview.evaluation && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Interview completed successfully! Your detailed report is ready.
              </span>
            </div>
          </div>
        )}

        {/* Report Card */}
        <InterviewReportCard
          interview={interview}
          onDownloadPDF={handleDownloadPDF}
          onShare={handleShare}
        />

        {/* Additional Actions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/interview/setup"
              className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Practice Again</h4>
                <p className="text-sm text-gray-600">Start another interview session</p>
              </div>
            </Link>
            
            <Link
              to="/analytics"
              className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-600">Track your progress over time</p>
              </div>
            </Link>
            
            <Link
              to="/history"
              className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">All Reports</h4>
                <p className="text-sm text-gray-600">View your interview history</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Your Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Share URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyShareUrl}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Social Share Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share On
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  
                  <button
                    onClick={shareOnTwitter}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <span className="text-sm">Twitter</span>
                  </button>
                  
                  <button
                    onClick={shareViaEmail}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default InterviewReport
import React, { useState } from 'react'
import { X, Linkedin, Copy, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const LinkedInShare = ({ interview, onClose }) => {
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState('')

  const defaultMessage = `🎉 Just completed an AI-powered interview practice session on InterviewMate!

📊 Results:
• Role: ${interview.candidateInfo.role} at ${interview.candidateInfo.company}
• Score: ${interview.evaluation?.overallScore || 'N/A'}%
• Type: ${interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
• Duration: ${interview.formattedDuration || interview.configuration.duration + 'm'}

InterviewMate's AI interviewer helped me practice and improve my interview skills. The detailed feedback and analytics are incredibly valuable for professional development.

#InterviewPrep #CareerDevelopment #AI #ProfessionalGrowth #InterviewSkills`

  const shareMessage = customMessage || defaultMessage

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(shareMessage)}`
    window.open(linkedInUrl, '_blank', 'width=600,height=600')
    onClose()
  }

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage)
      setCopied(true)
      toast.success('Message copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Linkedin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share on LinkedIn</h2>
              <p className="text-sm text-gray-600">Share your interview success with your network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidateInfo.name)}&background=3b82f6&color=fff`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-2">
                    {interview.candidateInfo.name}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {shareMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customize your message (optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="8"
              placeholder="Write your own message or leave blank to use the default..."
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {shareMessage.length} characters
              </p>
              {customMessage && (
                <button
                  onClick={() => setCustomMessage('')}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Reset to default
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLinkedInShare}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              Share on LinkedIn
            </button>
            
            <button
              onClick={handleCopyMessage}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">💡 Sharing Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Share your achievements to inspire others</li>
              <li>• Tag relevant companies or connections</li>
              <li>• Use hashtags to reach a wider audience</li>
              <li>• Consider sharing insights about your learning experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkedInShare
import React, { useState } from 'react'
import { 
  X, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Mail, 
  Copy, 
  ExternalLink,
  Share2,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const SocialShare = ({ interview, onClose, isOpen }) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const shareData = {
    title: `🎉 Just completed an AI interview practice session!`,
    text: `I scored ${interview.evaluation?.overallScore}% on my ${interview.type} interview practice with InterviewMate AI! 🚀`,
    url: window.location.href,
    hashtags: ['InterviewPrep', 'AI', 'CareerGrowth', 'InterviewMate']
  }

  const linkedInText = `🎉 Just completed an AI-powered ${interview.type} interview practice session with InterviewMate!

📊 My Results:
• Overall Score: ${interview.evaluation?.overallScore}%
• Grade: ${interview.performanceGrade}
• Role: ${interview.candidateInfo.role}
• Company: ${interview.candidateInfo.company}

The AI feedback was incredibly detailed and helped me identify key areas for improvement. This platform is a game-changer for interview preparation! 

#InterviewPrep #AI #CareerGrowth #InterviewMate #JobSearch #ProfessionalDevelopment`

  const twitterText = `🎉 Just aced my AI interview practice! Scored ${interview.evaluation?.overallScore}% on @InterviewMate 

🚀 ${interview.type} interview for ${interview.candidateInfo.role} role
📈 Grade: ${interview.performanceGrade}

AI-powered feedback is incredible! Perfect prep for real interviews.

#InterviewPrep #AI #CareerGrowth`

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(linkedInText)}`
    window.open(url, '_blank', 'width=600,height=600')
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareData.url)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`
    window.open(url, '_blank', 'width=600,height=600')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareData.title)
    const body = encodeURIComponent(`${shareData.text}\n\nCheck out my interview report: ${shareData.url}\n\nTry InterviewMate for yourself: ${process.env.REACT_APP_CLIENT_URL || 'https://interviewmate.com'}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Sharing failed')
        }
      }
    } else {
      copyToClipboard(shareData.url)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Share Your Success</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {interview.candidateInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{interview.candidateInfo.name}</p>
                <p className="text-sm text-gray-600">InterviewMate Achievement</p>
              </div>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed">
              {shareData.text}
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
              <span>🎯 {interview.candidateInfo.role}</span>
              <span>🏢 {interview.candidateInfo.company}</span>
              <span>📅 {new Date(interview.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Share on social media</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareToLinkedIn}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="font-medium">LinkedIn</span>
              </button>

              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center space-x-2 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="font-medium">Twitter</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span className="font-medium">Facebook</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="font-medium">Email</span>
              </button>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Or copy link</h4>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareData.url}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600"
              />
              <button
                onClick={() => copyToClipboard(shareData.url)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quick share</h4>
              <button
                onClick={nativeShare}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="font-medium">Share via...</span>
              </button>
            </div>
          )}

          {/* Custom Messages */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Custom messages</h4>
            
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(linkedInText)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">LinkedIn Post</p>
                    <p className="text-xs text-gray-600">Professional detailed message</p>
                  </div>
                  <Copy className="h-4 w-4 text-gray-400" />
                </div>
              </button>

              <button
                onClick={() => copyToClipboard(twitterText)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Twitter Tweet</p>
                    <p className="text-xs text-gray-600">Short and engaging message</p>
                  </div>
                  <Copy className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Sharing Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Share your success to inspire others</li>
              <li>• Tag relevant companies or recruiters</li>
              <li>• Use hashtags to reach more people</li>
              <li>• Mention specific skills you improved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialShare
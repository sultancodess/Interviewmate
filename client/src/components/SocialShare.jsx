import React, { useState } from 'react'
import { Share2, Linkedin, Twitter, Facebook, Mail, Copy, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const SocialShare = ({ interview, onClose }) => {
  const [copied, setCopied] = useState(false)

  const shareUrl = window.location.href
  const shareTitle = `I just completed an interview practice session on InterviewMate!`
  const shareText = `🎉 Just scored ${interview?.evaluation?.overallScore || 0}% on my ${interview?.type || 'practice'} interview! 

💪 Key achievements:
${interview?.evaluation?.strengths?.slice(0, 2).map(strength => `• ${strength}`).join('\n') || '• Great interview practice'}

🚀 Improving my interview skills with AI-powered practice. Ready for my next opportunity!

#InterviewPrep #CareerDevelopment #JobSearch #InterviewSkills`

  const handleShare = (platform) => {
    let url = ''
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
        break
      default:
        return
    }
    
    if (platform === 'email') {
      window.location.href = url
    } else {
      window.open(url, '_blank', 'width=600,height=600')
    }
    
    onClose()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        })
        onClose()
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Share Your Success</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Share your interview success with your network and inspire others!
          </p>

          {/* Social Platforms */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Linkedin className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">LinkedIn</span>
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Twitter className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium">Twitter</span>
            </button>

            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Facebook className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Facebook</span>
            </button>

            <button
              onClick={() => handleShare('email')}
              className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Mail className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium">Email</span>
            </button>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium">Copy Link</span>
                </>
              )}
            </button>

            {/* Native Share (if supported) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Share</span>
              </button>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
            <div className="text-xs text-gray-600 line-clamp-3">
              {shareText.substring(0, 150)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialShare
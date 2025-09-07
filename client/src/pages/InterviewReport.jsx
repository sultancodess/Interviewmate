import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useInterview } from '../contexts/InterviewContext'
// Removed framer-motion - using simple animations
import LinkedInShare from '../components/LinkedInShare'
import SocialShare from '../components/SocialShare'
import { 
  Award, 
  TrendingUp, 
  Download, 
  Share2, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Target,
  MessageSquare,
  Clock,
  Star,
  Brain,
  Zap,
  Sparkles,
  Trophy,
  BarChart3,
  User,
  Calendar,
  FileText,
  
  
  
  
  
  
  Loader
} from 'lucide-react'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { generateInterviewReport, generateQuickReport } from '../utils/pdfGenerator'
import toast from 'react-hot-toast'

const InterviewReport = () => {
  const { id } = useParams()
  const { getInterview } = useInterview()
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLinkedInShare, setShowLinkedInShare] = useState(false)
  const [showSocialShare, setShowSocialShare] = useState(false)

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const result = await getInterview(id)
        if (result.success) {
          setInterview(result.interview)
        } else {
          toast.error('Interview report not found')
        }
      } catch (error) {
        console.error('Failed to fetch interview:', error)
        toast.error('Failed to load interview report')
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [id])

  const generatePDF = async () => {
    if (!interview) return

    try {
      toast.loading('Generating PDF report...', { id: 'pdf-generation' })
      
      const result = await generateInterviewReport(interview)
      
      if (result.success) {
        toast.success(`PDF report generated: ${result.fileName}`, { id: 'pdf-generation' })
      } else {
        toast.error(`Failed to generate PDF: ${result.message}`, { id: 'pdf-generation' })
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF report', { id: 'pdf-generation' })
    }
  }

  const generateQuickPDF = async () => {
    if (!interview) return

    try {
      toast.loading('Generating quick report...', { id: 'quick-pdf' })
      
      const result = await generateQuickReport(interview)
      
      if (result.success) {
        toast.success(`Quick report generated: ${result.fileName}`, { id: 'quick-pdf' })
      } else {
        toast.error(`Failed to generate quick report: ${result.error}`, { id: 'quick-pdf' })
      }
    } catch (error) {
      console.error('Quick PDF generation error:', error)
      toast.error('Failed to generate quick report', { id: 'quick-pdf' })
    }
  }

  const _shareOnLinkedIn = () => {
    setShowLinkedInShare(true)
  }

  const shareReport = async () => {
    setShowSocialShare(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-10 h-10 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-400/20 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Report</h2>
          <p className="text-gray-600">Analyzing your interview performance...</p>
        </div>
      </div>
    )
  }

  if (!interview || !interview.evaluation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Report Not Available</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This interview hasn't been evaluated yet or the report is not available. 
            Please try again later or contact support if the issue persists.
          </p>
          <div className="space-y-3">
            <Link 
              to="/dashboard" 
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Back to Dashboard
            </Link>
            <Link 
              to="/interview/setup" 
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Start New Interview
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { evaluation } = interview

  // Prepare data for charts
  const skillsData = [
    { skill: 'Communication', score: evaluation.skillScores?.communication || 0 },
    { skill: 'Technical', score: evaluation.skillScores?.technicalKnowledge || 0 },
    { skill: 'Problem Solving', score: evaluation.skillScores?.problemSolving || 0 },
    { skill: 'Confidence', score: evaluation.skillScores?.confidence || 0 },
    { skill: 'Clarity', score: evaluation.skillScores?.clarity || 0 },
    { skill: 'Behavioral', score: evaluation.skillScores?.behavioral || 0 }
  ]

  const radarData = skillsData.map(item => ({
    subject: item.skill,
    score: item.score,
    fullMark: 100
  }))

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100'
    if (grade === 'B') return 'text-blue-600 bg-blue-100'
    if (grade === 'C') return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header with Logo */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ⭐ InterviewMate
                  </h1>
                  <p className="text-xs text-gray-500">AI-Powered Interview Practice</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/history" className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Link>
              <button 
                onClick={shareReport} 
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Success
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={generateQuickPDF} 
                  className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Quick PDF
                </button>
                <button 
                  onClick={generatePDF} 
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Full Report PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interview Complete! 🎉
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {interview.candidateInfo.role} at {interview.candidateInfo.company}
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{interview.formattedDuration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="capitalize">{interview.type} Interview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-2xl ${getScoreColor(evaluation.overallScore)} relative`}>
                <Award className="h-8 w-8" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Score</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {evaluation.overallScore}%
            </p>
            <p className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${getGradeColor(interview.performanceGrade)}`}>
              Grade {interview.performanceGrade}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-blue-100 text-blue-600">
                <Clock className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Duration</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{interview.formattedDuration}</p>
            <p className="text-sm text-gray-500">
              {interview.configuration.duration} min planned
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-purple-100 text-purple-600">
                <Brain className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Interview Type</h3>
            <p className="text-2xl font-bold text-gray-900 capitalize mb-1">{interview.type}</p>
            <p className="text-sm text-gray-500 capitalize">
              {interview.configuration.difficulty} level
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-green-100 text-green-600">
                <Trophy className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Achievements</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{evaluation.badges?.length || 0}</p>
            <p className="text-sm text-gray-500">Badges Earned</p>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Skills Breakdown</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Detailed Scores</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {evaluation.badges && evaluation.badges.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">🏆 Achievements Unlocked</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluation.badges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-white/80 backdrop-blur-md text-gray-800 px-4 py-3 rounded-xl border border-yellow-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">💪 Key Strengths</h3>
            </div>
            <div className="space-y-4">
              {evaluation.strengths?.map((strength, index) => (
                <div 
                  key={index}
                  className="flex items-start bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/30"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">🎯 Growth Opportunities</h3>
            </div>
            <div className="space-y-4">
              {evaluation.weaknesses?.map((weakness, index) => (
                <div 
                  key={index}
                  className="flex items-start bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">🤖 AI-Powered Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.recommendations?.map((recommendation, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-blue-200/30 rounded-xl p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed AI Feedback */}
        {evaluation.detailedFeedback && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">📝 Detailed AI Analysis</h3>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200/50">
              <p className="text-gray-700 leading-relaxed text-lg">{evaluation.detailedFeedback}</p>
            </div>
          </div>
        )}

        {/* Next Steps & Actions */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">🚀 Ready for Your Next Challenge?</h3>
              <p className="text-lg opacity-90">Continue your interview preparation journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link 
                to="/interview/setup" 
                className="group bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold mb-1">Practice Again</h4>
                  <p className="text-sm opacity-80">Take another interview</p>
                </div>
              </Link>
              
              <Link 
                to="/history" 
                className="group bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold mb-1">View Progress</h4>
                  <p className="text-sm opacity-80">Track your improvement</p>
                </div>
              </Link>
              
              <button 
                onClick={shareReport}
                className="group bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                    <Share2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold mb-1">Share Success</h4>
                  <p className="text-sm opacity-80">Social media & more</p>
                </div>
              </button>
              
              <button 
                onClick={generatePDF}
                className="group bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                    <Download className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold mb-1">Download Report</h4>
                  <p className="text-sm opacity-80">Save as PDF</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShare 
        interview={interview}
        isOpen={showSocialShare}
        onClose={() => setShowSocialShare(false)}
      />

      {/* LinkedIn Share Modal */}
      {showLinkedInShare && (
        <LinkedInShare 
          interview={interview}
          onClose={() => setShowLinkedInShare(false)}
        />
      )}
    </div>
  )
}

export default InterviewReport

/**
 * InterviewReportCard Component
 * 
 * This component displays a comprehensive interview report with:
 * - Overall score with circular progress indicator
 * - Skill-wise radar and bar charts
 * - Strengths, weaknesses, and improvement plan
 * - Achievement badges
 * - Download PDF and sharing options
 * - Professional, polished layout
 */

import React, { useState } from 'react'
import { 
  Download, 
  Share2, 
  Trophy, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Star,
  Award,
  BarChart3,
  Target,
  Lightbulb,
  Calendar,
  Clock,
  User,
  Building2
} from 'lucide-react'
import {
  SKILL_CATEGORY_LABELS,
  PERFORMANCE_GRADES,
  ACHIEVEMENT_BADGES,
  INTERVIEW_TYPE_LABELS
} from '../../constants'

const InterviewReportCard = ({ interview, onDownloadPDF, onShare }) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  if (!interview || !interview.evaluation) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluation Available</h3>
        <p className="text-gray-600">This interview hasn't been evaluated yet.</p>
      </div>
    )
  }

  const { evaluation, candidateInfo, type, createdAt, session } = interview
  const { overallScore, skillScores, strengths, weaknesses, recommendations, badges } = evaluation

  // Get performance grade
  const getPerformanceGrade = (score) => {
    for (const [grade, config] of Object.entries(PERFORMANCE_GRADES)) {
      if (score >= config.min && score <= config.max) {
        return { grade: config.label, color: config.color }
      }
    }
    return { grade: 'N/A', color: '#6B7280' }
  }

  const performanceGrade = getPerformanceGrade(overallScore)

  // Circular progress component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={performanceGrade.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{overallScore}%</span>
          <span className="text-sm text-gray-600">{performanceGrade.grade}</span>
        </div>
      </div>
    )
  }

  // Skill bar component
  const SkillBar = ({ skill, score, label }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Interview Report</h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{candidateInfo.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building2 className="w-4 h-4" />
                <span>{candidateInfo.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100 mb-1">
              {INTERVIEW_TYPE_LABELS[type]} Interview
            </div>
            <div className="text-sm text-blue-100">
              {candidateInfo.role}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Duration: {session?.actualDuration || 'N/A'} minutes
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onShare}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'skills', label: 'Skills Analysis', icon: Target },
            { id: 'feedback', label: 'Feedback', icon: Lightbulb },
            { id: 'achievements', label: 'Achievements', icon: Award }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Score */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h3>
              <CircularProgress percentage={overallScore} />
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Performance Grade</div>
                <div 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${performanceGrade.color}20`,
                    color: performanceGrade.color 
                  }}
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  {performanceGrade.grade}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Strengths</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {strengths?.length || 0}
                  </div>
                  <div className="text-sm text-green-700">Key strengths identified</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-900">Improvements</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {recommendations?.length || 0}
                  </div>
                  <div className="text-sm text-orange-700">Recommendations given</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Badges</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {badges?.length || 0}
                  </div>
                  <div className="text-sm text-purple-700">Achievement badges earned</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Top Skill</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600 mb-1">
                    {skillScores && Object.entries(skillScores).reduce((a, b) => 
                      skillScores[a[0]] > skillScores[b[0]] ? a : b
                    )[0] ? SKILL_CATEGORY_LABELS[Object.entries(skillScores).reduce((a, b) => 
                      skillScores[a[0]] > skillScores[b[0]] ? a : b
                    )[0]] : 'N/A'}
                  </div>
                  <div className="text-sm text-blue-700">
                    {skillScores && Math.max(...Object.values(skillScores))}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Analysis Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skill Scores */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Breakdown</h3>
              <div className="space-y-4">
                {skillScores && Object.entries(skillScores).map(([skill, score]) => (
                  <SkillBar
                    key={skill}
                    skill={skill}
                    score={score}
                    label={SKILL_CATEGORY_LABELS[skill] || skill}
                  />
                ))}
              </div>
            </div>

            {/* Radar Chart Placeholder */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Radar</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Radar chart visualization</p>
                <p className="text-sm text-gray-500 mt-2">
                  Install chart library to enable visualization
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Strengths
              </h3>
              <div className="space-y-3">
                {strengths?.map((strength, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">{strength}</p>
                  </div>
                )) || (
                  <p className="text-gray-500">No strengths identified</p>
                )}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                Areas for Improvement
              </h3>
              <div className="space-y-3">
                {weaknesses?.map((weakness, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-800">{weakness}</p>
                  </div>
                )) || (
                  <p className="text-gray-500">No areas for improvement identified</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                Improvement Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations?.map((recommendation, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">{recommendation}</p>
                  </div>
                )) || (
                  <p className="text-gray-500">No recommendations available</p>
                )}
              </div>
            </div>

            {/* Detailed Feedback */}
            {evaluation.detailedFeedback && (
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Feedback</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-800 leading-relaxed">{evaluation.detailedFeedback}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievement Badges</h3>
            {badges && badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{badge}</h4>
                    <p className="text-sm text-gray-600">
                      Earned for exceptional performance in this area
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Badges Earned</h4>
                <p className="text-gray-600">
                  Keep practicing to earn achievement badges for exceptional performance!
                </p>
              </div>
            )}

            {/* Badge Requirements */}
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Badge Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ACHIEVEMENT_BADGES).map(([key, badge]) => (
                  <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        badges?.includes(badge) 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {badges?.includes(badge) ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Award className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{badge}</h5>
                        <p className="text-sm text-gray-600">Score 85%+ in related skill</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewReportCard
import React, { useState, useEffect } from 'react'
import { useInterview } from '../contexts/InterviewContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Target,
  Calendar,
  Users,
  Code,
  Brain,
  Zap
} from 'lucide-react'

const Analytics = () => {
  const { getAnalytics } = useInterview()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await getAnalytics()
        if (result.success) {
          setAnalytics(result.analytics)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading analytics..." />
        </div>
      </DashboardLayout>
    )
  }

  const overview = analytics?.overview || {}
  const skillBreakdown = analytics?.skillBreakdown || {}
  const performanceTrend = analytics?.performanceTrend || []

  const skillCategories = [
    { key: 'communication', name: 'Communication', icon: Users, color: 'bg-blue-500' },
    { key: 'technicalKnowledge', name: 'Technical Knowledge', icon: Code, color: 'bg-green-500' },
    { key: 'problemSolving', name: 'Problem Solving', icon: Brain, color: 'bg-purple-500' },
    { key: 'confidence', name: 'Confidence', icon: Zap, color: 'bg-yellow-500' },
    { key: 'clarity', name: 'Clarity', icon: Target, color: 'bg-red-500' },
    { key: 'behavioral', name: 'Behavioral', icon: Trophy, color: 'bg-indigo-500' }
  ]

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
          <p className="text-lg text-gray-600">Track your interview performance and improvement over time</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalInterviews || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.averageScore ? `${Math.round(overview.averageScore)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Practice Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.totalMinutes ? `${Math.round(overview.totalMinutes)}m` : '0m'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{overview.completedInterviews || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Skills Breakdown</h2>
            </div>

            <div className="space-y-4">
              {skillCategories.map((skill) => {
                const score = skillBreakdown[skill.key] || 0
                const roundedScore = Math.round(score)
                
                return (
                  <div key={skill.key} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`p-2 rounded-lg ${skill.color} text-white mr-3`}>
                        <skill.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                          <span className={`text-sm font-bold ${getScoreColor(roundedScore)}`}>
                            {roundedScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              roundedScore >= 80 ? 'bg-green-500' :
                              roundedScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, roundedScore))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {Object.keys(skillBreakdown).length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No skill data available yet</p>
                <p className="text-sm text-gray-400">Complete some interviews to see your skill breakdown</p>
              </div>
            )}
          </div>

          {/* Performance Trend */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Performance Trend</h2>
            </div>

            {performanceTrend.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance trend chart</p>
                    <p className="text-sm text-gray-400">Chart visualization will be displayed here</p>
                  </div>
                </div>
                
                {/* Recent Performance Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Best Score</p>
                    <p className="text-lg font-bold text-green-600">
                      {Math.max(...performanceTrend.map(p => p.averageScore || 0))}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Recent Average</p>
                    <p className="text-lg font-bold text-blue-600">
                      {Math.round(performanceTrend.slice(-3).reduce((acc, p) => acc + (p.averageScore || 0), 0) / Math.min(3, performanceTrend.length))}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No trend data available yet</p>
                <p className="text-sm text-gray-400">Complete more interviews to see your progress over time</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <Brain className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Strengths</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {Object.entries(skillBreakdown)
                  .filter(([_, score]) => score >= 80)
                  .map(([skill, score]) => (
                    <li key={skill} className="flex items-center">
                      <Trophy className="w-3 h-3 text-yellow-500 mr-2" />
                      {skillCategories.find(s => s.key === skill)?.name || skill}: {Math.round(score)}%
                    </li>
                  ))}
                {Object.entries(skillBreakdown).filter(([_, score]) => score >= 80).length === 0 && (
                  <li className="text-gray-500 italic">Complete more interviews to identify strengths</li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Areas for Improvement</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {Object.entries(skillBreakdown)
                  .filter(([_, score]) => score < 70)
                  .map(([skill, score]) => (
                    <li key={skill} className="flex items-center">
                      <Target className="w-3 h-3 text-red-500 mr-2" />
                      {skillCategories.find(s => s.key === skill)?.name || skill}: {Math.round(score)}%
                    </li>
                  ))}
                {Object.entries(skillBreakdown).filter(([_, score]) => score < 70).length === 0 && (
                  <li className="text-gray-500 italic">Great job! No major areas for improvement identified</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Analytics
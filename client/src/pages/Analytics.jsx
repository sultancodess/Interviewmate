/**
 * Analytics Page
 * 
 * This page provides comprehensive analytics and insights including:
 * - Performance trends over time
 * - Skill progression tracking
 * - Interview type analysis
 * - Comparative performance metrics
 * - Goal setting and achievement tracking
 * - Detailed charts and visualizations
 */

import React, { useState, useEffect, useMemo } from 'react'
import { useInterview } from '../contexts/InterviewContext'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Trophy,
  Target,
  Clock,
  Users,
  Code,
  Building2,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import {
  INTERVIEW_TYPE_LABELS,
  SKILL_CATEGORY_LABELS,
  PERFORMANCE_GRADES
} from '../constants'

const Analytics = () => {
  const { user } = useAuth()
  const { getAnalytics, getInterviewHistory } = useInterview()
  
  // State
  const [analytics, setAnalytics] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('30') // days
  const [selectedMetric, setSelectedMetric] = useState('overallScore')
  const [showFilters, setShowFilters] = useState(false)

  /**
   * Load analytics data
   */
  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load analytics and interview history
      const [analyticsResult, historyResult] = await Promise.all([
        getAnalytics(),
        getInterviewHistory({ limit: 100 }) // Get more data for analytics
      ])
      
      if (analyticsResult.success) {
        setAnalytics(analyticsResult.analytics)
      }
      
      if (historyResult.success) {
        setInterviews(historyResult.interviews || [])
      }
      
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Filter interviews by time range
   */
  const filteredInterviews = useMemo(() => {
    if (!interviews.length) return []
    
    const days = parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return interviews.filter(interview => 
      new Date(interview.createdAt) >= cutoffDate &&
      interview.status === 'completed' &&
      interview.evaluation
    )
  }, [interviews, timeRange])

  /**
   * Calculate performance trends
   */
  const performanceTrend = useMemo(() => {
    if (!filteredInterviews.length) return []
    
    // Group interviews by date
    const groupedByDate = filteredInterviews.reduce((acc, interview) => {
      const date = new Date(interview.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(interview)
      return acc
    }, {})
    
    // Calculate daily averages
    return Object.entries(groupedByDate)
      .map(([date, dayInterviews]) => ({
        date,
        averageScore: Math.round(
          dayInterviews.reduce((sum, i) => sum + (i.evaluation?.overallScore || 0), 0) / dayInterviews.length
        ),
        count: dayInterviews.length
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredInterviews])

  /**
   * Calculate skill progression
   */
  const skillProgression = useMemo(() => {
    if (!filteredInterviews.length) return {}
    
    const skills = Object.keys(SKILL_CATEGORY_LABELS)
    const progression = {}
    
    skills.forEach(skill => {
      const skillScores = filteredInterviews
        .map(interview => interview.evaluation?.skillScores?.[skill])
        .filter(score => score !== undefined)
        .map((score, index) => ({ score, index }))
      
      if (skillScores.length > 0) {
        const latest = skillScores[skillScores.length - 1]?.score || 0
        const earliest = skillScores[0]?.score || 0
        const average = Math.round(skillScores.reduce((sum, s) => sum + s.score, 0) / skillScores.length)
        const trend = latest - earliest
        
        progression[skill] = {
          current: latest,
          average,
          trend,
          trendDirection: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable'
        }
      }
    })
    
    return progression
  }, [filteredInterviews])

  /**
   * Calculate interview type distribution
   */
  const interviewTypeDistribution = useMemo(() => {
    if (!filteredInterviews.length) return []
    
    const distribution = filteredInterviews.reduce((acc, interview) => {
      const type = interview.type
      if (!acc[type]) {
        acc[type] = { count: 0, totalScore: 0 }
      }
      acc[type].count++
      acc[type].totalScore += interview.evaluation?.overallScore || 0
      return acc
    }, {})
    
    return Object.entries(distribution).map(([type, data]) => ({
      type,
      label: INTERVIEW_TYPE_LABELS[type],
      count: data.count,
      averageScore: Math.round(data.totalScore / data.count),
      percentage: Math.round((data.count / filteredInterviews.length) * 100)
    }))
  }, [filteredInterviews])

  /**
   * Calculate key metrics
   */
  const keyMetrics = useMemo(() => {
    if (!filteredInterviews.length) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        totalTime: 0,
        improvementRate: 0,
        bestScore: 0,
        consistency: 0
      }
    }
    
    const scores = filteredInterviews.map(i => i.evaluation?.overallScore || 0)
    const totalTime = filteredInterviews.reduce((sum, i) => sum + (i.session?.actualDuration || 0), 0)
    
    // Calculate improvement rate (comparing first half vs second half)
    const midPoint = Math.floor(filteredInterviews.length / 2)
    const firstHalf = scores.slice(0, midPoint)
    const secondHalf = scores.slice(midPoint)
    
    const firstHalfAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0
    const secondHalfAvg = secondHalf.length ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0
    const improvementRate = secondHalfAvg - firstHalfAvg
    
    // Calculate consistency (standard deviation)
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length
    const consistency = 100 - Math.sqrt(variance) // Higher is more consistent
    
    return {
      totalInterviews: filteredInterviews.length,
      averageScore: Math.round(avgScore),
      totalTime: Math.round(totalTime),
      improvementRate: Math.round(improvementRate),
      bestScore: Math.max(...scores),
      consistency: Math.round(Math.max(0, consistency))
    }
  }, [filteredInterviews])

  /**
   * Get trend icon
   */
  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4 text-green-500" />
    if (trend < 0) return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  /**
   * Get performance grade color
   */
  const getGradeColor = (score) => {
    for (const [grade, config] of Object.entries(PERFORMANCE_GRADES)) {
      if (score >= config.min && score <= config.max) {
        return config.color
      }
    }
    return '#6B7280'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading analytics..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
              <p className="text-gray-600 mt-1">
                Track your progress and identify areas for improvement
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
              
              <button
                onClick={loadAnalytics}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.totalInterviews}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">in last {timeRange} days</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.averageScore}%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {getTrendIcon(keyMetrics.improvementRate)}
              <span className={`ml-1 ${
                keyMetrics.improvementRate > 0 ? 'text-green-600' : 
                keyMetrics.improvementRate < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {keyMetrics.improvementRate > 0 ? '+' : ''}{keyMetrics.improvementRate}% improvement
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Practice Time</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.totalTime}m</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">
                {Math.round(keyMetrics.totalTime / Math.max(keyMetrics.totalInterviews, 1))}m avg per interview
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.bestScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">
                Consistency: {keyMetrics.consistency}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Score over time</span>
              </div>
            </div>
            
            {performanceTrend.length > 0 ? (
              <div className="space-y-4">
                {/* Simple line chart representation */}
                <div className="h-48 flex items-end space-x-2">
                  {performanceTrend.map((point, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ 
                          height: `${(point.averageScore / 100) * 100}%`,
                          minHeight: '4px'
                        }}
                        title={`${point.date}: ${point.averageScore}%`}
                      />
                      <div className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
                        {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No data available for the selected time range</p>
                </div>
              </div>
            )}
          </div>

          {/* Interview Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Interview Types</h3>
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            
            {interviewTypeDistribution.length > 0 ? (
              <div className="space-y-4">
                {interviewTypeDistribution.map((item, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
                  const color = colors[index % colors.length]
                  
                  return (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${color}`} />
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{item.count} interviews</div>
                        <div className="text-xs text-gray-500">{item.averageScore}% avg</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No interview data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skill Progression */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Skill Progression</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Track improvement across skills</span>
            </div>
          </div>
          
          {Object.keys(skillProgression).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillProgression).map(([skill, data]) => (
                <div key={skill} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {SKILL_CATEGORY_LABELS[skill]}
                    </h4>
                    {getTrendIcon(data.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium" style={{ color: getGradeColor(data.current) }}>
                        {data.current}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-medium text-gray-900">{data.average}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trend:</span>
                      <span className={`font-medium ${
                        data.trend > 0 ? 'text-green-600' : 
                        data.trend < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {data.trend > 0 ? '+' : ''}{data.trend}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.current}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Skill Data Available</h4>
              <p className="text-gray-600">
                Complete more interviews to see your skill progression analysis
              </p>
            </div>
          )}
        </div>

        {/* Insights and Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Your Strengths
              </h4>
              <div className="space-y-2">
                {Object.entries(skillProgression)
                  .filter(([_, data]) => data.current >= 80)
                  .slice(0, 3)
                  .map(([skill, data]) => (
                    <div key={skill} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm text-green-800">
                        {SKILL_CATEGORY_LABELS[skill]}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {data.current}%
                      </span>
                    </div>
                  ))}
                {Object.entries(skillProgression).filter(([_, data]) => data.current >= 80).length === 0 && (
                  <p className="text-sm text-gray-600">Keep practicing to identify your strengths!</p>
                )}
              </div>
            </div>
            
            {/* Areas for Improvement */}
            <div>
              <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Focus Areas
              </h4>
              <div className="space-y-2">
                {Object.entries(skillProgression)
                  .filter(([_, data]) => data.current < 70)
                  .slice(0, 3)
                  .map(([skill, data]) => (
                    <div key={skill} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm text-orange-800">
                        {SKILL_CATEGORY_LABELS[skill]}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {data.current}%
                      </span>
                    </div>
                  ))}
                {Object.entries(skillProgression).filter(([_, data]) => data.current < 70).length === 0 && (
                  <p className="text-sm text-gray-600">Great job! All skills are performing well.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Items */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Recommended Actions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {keyMetrics.totalInterviews < 5 && (
                <li>• Complete more interviews to get better insights into your performance</li>
              )}
              {keyMetrics.improvementRate < 0 && (
                <li>• Focus on consistent practice to improve your scores</li>
              )}
              {keyMetrics.consistency < 70 && (
                <li>• Work on maintaining consistent performance across interviews</li>
              )}
              {Object.values(skillProgression).some(data => data.current < 60) && (
                <li>• Practice specific skills that are scoring below 60%</li>
              )}
              {interviewTypeDistribution.length < 2 && (
                <li>• Try different interview types to broaden your experience</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Analytics
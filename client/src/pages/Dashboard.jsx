import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useInterview } from '../contexts/InterviewContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Play, 
  BarChart3, 
  Clock, 
  Trophy, 
  TrendingUp,
  Users,
  Code,
  Calendar,
  ArrowRight,
  Zap,
  Globe,
  Brain
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { getInterviewHistory, getAnalytics } = useInterview()
  const [recentInterviews, setRecentInterviews] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch recent interviews
        const historyResult = await getInterviewHistory({ limit: 5 })
        if (historyResult.success) {
          setRecentInterviews(historyResult.data?.interviews || historyResult.interviews || [])
        } else {
          console.log('No interview history found:', historyResult.message)
          setRecentInterviews([])
        }

        // Fetch analytics
        const analyticsResult = await getAnalytics()
        if (analyticsResult.success) {
          setAnalytics(analyticsResult.data?.analytics || analyticsResult.analytics || {
            overview: {
              totalInterviews: 0,
              averageScore: 0,
              totalMinutes: 0,
              completedInterviews: 0
            },
            performanceTrend: [],
            skillBreakdown: {}
          })
        } else {
          console.log('No analytics found:', analyticsResult.message)
          setAnalytics({
            overview: {
              totalInterviews: 0,
              averageScore: 0,
              totalMinutes: 0,
              completedInterviews: 0
            },
            performanceTrend: [],
            skillBreakdown: {}
          })
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        // Set default empty state
        setRecentInterviews([])
        setAnalytics({
          overview: {
            totalInterviews: 0,
            averageScore: 0,
            totalMinutes: 0,
            completedInterviews: 0
          },
          performanceTrend: [],
          skillBreakdown: {}
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, getInterviewHistory, getAnalytics])

  const quickActions = [
    {
      title: 'HR Interview',
      description: 'Practice behavioral and cultural fit questions',
      icon: Users,
      color: 'bg-blue-500',
      href: '/interview/setup?type=hr'
    },
    {
      title: 'Technical Interview',
      description: 'Test your coding and technical knowledge',
      icon: Code,
      color: 'bg-green-500',
      href: '/interview/setup?type=technical'
    }
  ]

  const stats = [
    {
      name: 'Total Interviews',
      value: analytics?.overview?.totalInterviews || 0,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      name: 'Average Score',
      value: analytics?.overview?.averageScore ? `${Math.round(analytics.overview.averageScore)}%` : '0%',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      name: 'Practice Time',
      value: analytics?.overview?.totalMinutes ? `${Math.round(analytics.overview.totalMinutes)}m` : '0m',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      name: 'Completed',
      value: analytics?.overview?.completedInterviews || 0,
      icon: BarChart3,
      color: 'text-purple-600'
    }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-4">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Avatar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-gray-600">
                Ready to practice your interview skills? Let's get started.
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Status with Badge */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="font-semibold text-gray-900">
                  {user?.subscription?.plan === 'free' ? 'Free Plan' : 'Pro Plan'}
                </h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  user?.subscription?.plan === 'free' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.subscription?.plan === 'free' ? 'FREE' : 'PRO'}
                </span>
              </div>
              
              {/* Remaining Minutes Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-gray-600">VAPI Minutes:</span>
                    <div className="font-medium text-gray-900">
                      {user?.subscription?.vapiMinutesRemaining || 0} remaining
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <div>
                    <span className="text-gray-600">Web Speech:</span>
                    <div className="font-medium text-gray-900">Unlimited</div>
                  </div>
                </div>
                {user?.subscription?.plan === 'pro' && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <div>
                      <span className="text-gray-600">Balance:</span>
                      <div className="font-medium text-gray-900">
                        ${user?.subscription?.payAsYouGoBalance?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {user?.subscription?.plan === 'free' && (
              <Link
                to="/subscription"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                Upgrade CTA
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Start Practicing</h2>
                <Link
                  to="/interview/setup"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View all options
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                        <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                          <Play className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Start Practice</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Custom Interview Option */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Custom Interview</h4>
                    <p className="text-sm text-gray-600">Create a personalized interview with your own questions and topics</p>
                  </div>
                  <Link
                    to="/interview/setup"
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Interviews</h2>
              <Link
                to="/history"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {recentInterviews.length > 0 ? (
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div key={interview._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      interview.type === 'hr' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {interview.type === 'hr' ? <Users className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {interview.candidateInfo.role} at {interview.candidateInfo.company}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(interview.createdAt).toLocaleDateString()} • 
                        {interview.evaluation?.overallScore ? ` ${interview.evaluation.overallScore}%` : ' Pending'}
                      </p>
                    </div>
                    {interview.status === 'completed' && (
                      <Link
                        to={`/interview/report/${interview._id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No interviews yet</p>
                <Link
                  to="/interview/setup"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Your First Interview
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Performance Trend */}
        {analytics?.performanceTrend && analytics.performanceTrend.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Trend</h2>
              <Link
                to="/analytics"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                View detailed analytics
                <TrendingUp className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance chart will be displayed here</p>
                <p className="text-sm text-gray-400">Install chart library to enable visualization</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
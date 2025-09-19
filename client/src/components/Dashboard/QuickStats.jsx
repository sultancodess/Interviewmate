import React from 'react'
import { 
  Calendar, 
  Trophy, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react'

const QuickStats = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Interviews',
      value: analytics?.overview?.totalInterviews || 0,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100',
      trend: analytics?.trends?.interviews || 0
    },
    {
      name: 'Average Score',
      value: analytics?.overview?.averageScore ? `${Math.round(analytics.overview.averageScore)}%` : '0%',
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100',
      trend: analytics?.trends?.score || 0
    },
    {
      name: 'Practice Time',
      value: analytics?.overview?.totalMinutes ? `${Math.round(analytics.overview.totalMinutes)}m` : '0m',
      icon: Clock,
      color: 'text-green-600 bg-green-100',
      trend: analytics?.trends?.time || 0
    },
    {
      name: 'Completed',
      value: analytics?.overview?.completedInterviews || 0,
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-100',
      trend: analytics?.trends?.completed || 0
    }
  ]

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {getTrendIcon(stat.trend)}
              <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                {stat.trend > 0 ? '+' : ''}{stat.trend}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats
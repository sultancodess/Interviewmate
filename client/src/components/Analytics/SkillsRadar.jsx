import React from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts'

const SkillsRadar = ({ skillBreakdown, title = "Skills Assessment", height = 400 }) => {
  if (!skillBreakdown || Object.keys(skillBreakdown).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm">No skills data available</p>
            <p className="text-xs text-gray-400">Complete interviews to see your skill breakdown</p>
          </div>
        </div>
      </div>
    )
  }

  // Transform skill breakdown data for radar chart
  const radarData = [
    {
      skill: 'Communication',
      score: Math.round(skillBreakdown.communication || 0),
      fullMark: 100
    },
    {
      skill: 'Technical',
      score: Math.round(skillBreakdown.technicalKnowledge || 0),
      fullMark: 100
    },
    {
      skill: 'Problem Solving',
      score: Math.round(skillBreakdown.problemSolving || 0),
      fullMark: 100
    },
    {
      skill: 'Confidence',
      score: Math.round(skillBreakdown.confidence || 0),
      fullMark: 100
    },
    {
      skill: 'Clarity',
      score: Math.round(skillBreakdown.clarity || 0),
      fullMark: 100
    },
    {
      skill: 'Behavioral',
      score: Math.round(skillBreakdown.behavioral || 0),
      fullMark: 100
    }
  ]

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const averageScore = Math.round(
    radarData.reduce((sum, item) => sum + item.score, 0) / radarData.length
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
          <div className="text-sm text-gray-500">Average</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickCount={6}
              />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Skill Breakdown</h4>
          {radarData.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                <span className={`text-sm font-bold ${getScoreColor(skill.score)}`}>
                  {skill.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    skill.score >= 80 ? 'bg-green-500' :
                    skill.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${skill.score}%` }}
                ></div>
              </div>
            </div>
          ))}
          
          {/* Performance Indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Performance Indicators</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Strengths:</span>
                <span className="font-medium text-green-600">
                  {radarData.filter(s => s.score >= 80).length} skills
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Needs Work:</span>
                <span className="font-medium text-red-600">
                  {radarData.filter(s => s.score < 60).length} skills
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Top Skill:</span>
                <span className="font-medium text-blue-600">
                  {radarData.reduce((max, skill) => skill.score > max.score ? skill : max).skill}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsRadar
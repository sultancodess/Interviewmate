/**
 * InterviewHistory Page
 * 
 * This page displays a comprehensive list of all past interviews with:
 * - Table/List UI with interview details
 * - Infinite scroll or pagination for scalability
 * - Filters and search functionality
 * - Quick actions (View Report, Download PDF, Delete)
 * - Performance tracking and analytics
 * - Responsive design for all devices
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useInterview } from '../contexts/InterviewContext'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  BarChart3,
  Users,
  Code,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  SortAsc,
  SortDesc
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  INTERVIEW_TYPE_LABELS,
  INTERVIEW_STATUS_LABELS,
  PERFORMANCE_GRADES,
  INTERVIEW_MODES,
  INTERVIEW_MODE_LABELS
} from '../constants'
import { downloadPDF } from '../utils/pdfGenerator'

const InterviewHistory = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getInterviewHistory, deleteInterview } = useInterview()
  
  // State
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: '',
    scoreRange: '',
    mode: ''
  })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)
  
  // UI state
  const [selectedInterviews, setSelectedInterviews] = useState([])
  const [viewMode, setViewMode] = useState('table') // table or grid
  const [downloadingPDF, setDownloadingPDF] = useState({})

  /**
   * Load interviews with current filters and pagination
   */
  const loadInterviews = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true)
        setError(null)
      }
      
      const params = {
        page,
        limit: pagination.limit,
        search: searchTerm,
        sortBy,
        sortOrder,
        ...filters
      }
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })
      
      const result = await getInterviewHistory(params)
      
      if (result.success) {
        const newInterviews = result.interviews || []
        
        if (append) {
          setInterviews(prev => [...prev, ...newInterviews])
        } else {
          setInterviews(newInterviews)
        }
        
        setPagination(result.pagination || {
          page: 1,
          limit: 10,
          total: newInterviews.length,
          pages: 1
        })
      } else {
        setError(result.message || 'Failed to load interview history')
      }
    } catch (error) {
      console.error('Failed to load interviews:', error)
      setError('Failed to load interview history')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filters, sortBy, sortOrder, pagination.limit])

  /**
   * Initial load
   */
  useEffect(() => {
    loadInterviews()
  }, [])

  /**
   * Reload when filters change
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadInterviews()
    }, 300) // Debounce search
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm, filters, sortBy, sortOrder])

  /**
   * Handle search input
   */
  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  /**
   * Handle filter change
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  /**
   * Handle sort change
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      type: '',
      status: '',
      dateRange: '',
      scoreRange: '',
      mode: ''
    })
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  /**
   * Handle interview deletion
   */
  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return
    }
    
    try {
      const result = await deleteInterview(interviewId)
      
      if (result.success) {
        setInterviews(prev => prev.filter(interview => interview._id !== interviewId))
        toast.success('Interview deleted successfully')
      } else {
        toast.error(result.message || 'Failed to delete interview')
      }
    } catch (error) {
      console.error('Failed to delete interview:', error)
      toast.error('Failed to delete interview')
    }
  }

  /**
   * Handle PDF download
   */
  const handleDownloadPDF = async (interview) => {
    if (!interview.evaluation) {
      toast.error('No evaluation available for this interview')
      return
    }
    
    try {
      setDownloadingPDF(prev => ({ ...prev, [interview._id]: true }))
      
      await downloadPDF(interview)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Failed to download PDF:', error)
      toast.error('Failed to download PDF')
    } finally {
      setDownloadingPDF(prev => ({ ...prev, [interview._id]: false }))
    }
  }

  /**
   * Handle bulk actions
   */
  const handleBulkDelete = async () => {
    if (selectedInterviews.length === 0) return
    
    if (!window.confirm(`Are you sure you want to delete ${selectedInterviews.length} interviews? This action cannot be undone.`)) {
      return
    }
    
    try {
      const promises = selectedInterviews.map(id => deleteInterview(id))
      await Promise.all(promises)
      
      setInterviews(prev => prev.filter(interview => !selectedInterviews.includes(interview._id)))
      setSelectedInterviews([])
      toast.success(`${selectedInterviews.length} interviews deleted successfully`)
    } catch (error) {
      console.error('Failed to delete interviews:', error)
      toast.error('Failed to delete some interviews')
    }
  }

  /**
   * Toggle interview selection
   */
  const toggleInterviewSelection = (interviewId) => {
    setSelectedInterviews(prev => 
      prev.includes(interviewId)
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    )
  }

  /**
   * Select all interviews
   */
  const toggleSelectAll = () => {
    if (selectedInterviews.length === interviews.length) {
      setSelectedInterviews([])
    } else {
      setSelectedInterviews(interviews.map(interview => interview._id))
    }
  }

  /**
   * Get performance grade
   */
  const getPerformanceGrade = (score) => {
    if (!score) return { grade: 'N/A', color: '#6B7280' }
    
    for (const [grade, config] of Object.entries(PERFORMANCE_GRADES)) {
      if (score >= config.min && score <= config.max) {
        return { grade: config.label, color: config.color }
      }
    }
    return { grade: 'N/A', color: '#6B7280' }
  }

  /**
   * Format date
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * Get interview type icon
   */
  const getInterviewTypeIcon = (type) => {
    const icons = {
      hr: Users,
      technical: Code,
      managerial: Building2,
      custom: User
    }
    return icons[type] || User
  }

  // Filtered and sorted interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter(interview => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = 
          interview.candidateInfo.name.toLowerCase().includes(searchLower) ||
          interview.candidateInfo.role.toLowerCase().includes(searchLower) ||
          interview.candidateInfo.company.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }
      
      return true
    })
  }, [interviews, searchTerm])

  // Loading state
  if (loading && interviews.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading interview history..." />
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
              <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
              <p className="text-gray-600 mt-1">
                Track your progress and review past interview performances
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => loadInterviews()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              
              <Link
                to="/interview/setup"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>New Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviews.filter(i => i.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviews.length > 0 
                    ? Math.round(interviews.reduce((acc, i) => acc + (i.evaluation?.overallScore || 0), 0) / interviews.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(interviews.reduce((acc, i) => acc + (i.session?.actualDuration || 0), 0))}m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Bulk Actions */}
            {selectedInterviews.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedInterviews.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              {/* Interview Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  {Object.entries(INTERVIEW_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              {/* Mode Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <select
                  value={filters.mode}
                  onChange={(e) => handleFilterChange('mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Modes</option>
                  {Object.entries(INTERVIEW_MODE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              {/* Score Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score Range</label>
                <select
                  value={filters.scoreRange}
                  onChange={(e) => handleFilterChange('scoreRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Scores</option>
                  <option value="90-100">90-100% (Excellent)</option>
                  <option value="80-89">80-89% (Good)</option>
                  <option value="70-79">70-79% (Average)</option>
                  <option value="60-69">60-69% (Below Average)</option>
                  <option value="0-59">0-59% (Poor)</option>
                </select>
              </div>
              
              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Interviews Table */}
        {filteredInterviews.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedInterviews.length === interviews.length && interviews.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {sortBy === 'createdAt' && (
                          sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interview Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('evaluation.overallScore')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Score</span>
                        {sortBy === 'evaluation.overallScore' && (
                          sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview) => {
                    const TypeIcon = getInterviewTypeIcon(interview.type)
                    const performanceGrade = getPerformanceGrade(interview.evaluation?.overallScore)
                    
                    return (
                      <tr key={interview._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedInterviews.includes(interview._id)}
                            onChange={() => toggleInterviewSelection(interview._id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{formatDate(interview.createdAt)}</div>
                            <div className="text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{interview.session?.actualDuration || 0}m</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <TypeIcon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {INTERVIEW_TYPE_LABELS[interview.type]}
                              </div>
                              <div className="text-sm text-gray-500">
                                {interview.configuration?.interviewMode === 'vapi' ? 'Pro Mode' : 'Lite Mode'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {interview.candidateInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {interview.candidateInfo.role} at {interview.candidateInfo.company}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {interview.evaluation?.overallScore ? (
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: performanceGrade.color }}
                              >
                                {performanceGrade.grade}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {interview.evaluation.overallScore}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not evaluated</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                            interview.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {INTERVIEW_STATUS_LABELS[interview.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {interview.status === 'completed' && interview.evaluation && (
                              <Link
                                to={`/interview/report/${interview._id}`}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="View Report"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}
                            
                            {interview.evaluation && (
                              <button
                                onClick={() => handleDownloadPDF(interview)}
                                disabled={downloadingPDF[interview._id]}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 disabled:opacity-50"
                                title="Download PDF"
                              >
                                {downloadingPDF[interview._id] ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteInterview(interview._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete Interview"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => loadInterviews(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => loadInterviews(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {((pagination.page - 1) * pagination.limit) + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{pagination.total}</span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => loadInterviews(pagination.page - 1)}
                          disabled={pagination.page <= 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          const pageNum = i + 1
                          return (
                            <button
                              key={pageNum}
                              onClick={() => loadInterviews(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pagination.page === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        
                        <button
                          onClick={() => loadInterviews(pagination.page + 1)}
                          disabled={pagination.page >= pagination.pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Interviews Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'No interviews match your current filters. Try adjusting your search criteria.'
                : 'You haven\'t completed any interviews yet. Start your first interview to see your history here.'
              }
            </p>
            <div className="flex items-center justify-center space-x-3">
              {searchTerm || Object.values(filters).some(f => f) ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              ) : null}
              <Link
                to="/interview/setup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Your First Interview
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default InterviewHistory
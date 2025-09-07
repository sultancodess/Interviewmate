import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/Layout/DashboardLayout'
import { 
  CreditCard, 
  CheckCircle, 
  Brain, 
  Globe, 
  Zap, 
  
  
  
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Subscription = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [_addFundsAmount, _setAddFundsAmount] = useState(10)

  const currentPlan = user?.subscription?.plan || 'free'
  const vapiMinutesRemaining = user?.subscription?.vapiMinutesRemaining || 0
  const payAsYouGoBalance = user?.subscription?.payAsYouGoBalance || 0

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started with interview practice',
      features: [
        '30 VAPI AI minutes per month',
        'Unlimited Web Speech API usage',
        'Basic interview types (HR & Technical)',
        'Performance reports and analytics',
        'Interview history storage',
        'Email support'
      ],
      badge: 'Current Plan',
      badgeColor: 'bg-gray-100 text-gray-800',
      buttonText: 'Current Plan',
      buttonDisabled: true
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$0.50',
      period: '/minute',
      description: 'Pay-as-you-go for premium AI interview experience',
      features: [
        'Pay-per-minute VAPI AI usage',
        'Unlimited Web Speech API usage',
        'All interview types and customizations',
        'Advanced performance analytics',
        'Priority customer support',
        'Custom question libraries',
        'Detailed skill assessments',
        'Export reports to PDF'
      ],
      badge: 'Most Popular',
      badgeColor: 'bg-blue-100 text-blue-800',
      buttonText: 'Add Funds',
      buttonDisabled: false
    }
  ]

  const fundingOptions = [
    { amount: 5, bonus: 0, label: '$5.00' },
    { amount: 10, bonus: 0, label: '$10.00' },
    { amount: 25, bonus: 2, label: '$25.00 + $2 bonus' },
    { amount: 50, bonus: 5, label: '$50.00 + $5 bonus' },
    { amount: 100, bonus: 15, label: '$100.00 + $15 bonus' }
  ]

  const handleAddFunds = async (amount) => {
    setLoading(true)
    try {
      // This would integrate with Razorpay payment gateway
      toast.success(`Added $${amount} to your account!`)
      // Update user balance in context
    } catch (error) {
      toast.error('Failed to add funds. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getUsageStats = () => {
    const totalMinutes = 30 // Free plan allocation
    const usedMinutes = totalMinutes - vapiMinutesRemaining
    const usagePercentage = (usedMinutes / totalMinutes) * 100

    return {
      usedMinutes,
      totalMinutes,
      usagePercentage: Math.min(100, Math.max(0, usagePercentage))
    }
  }

  const stats = getUsageStats()

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-lg text-gray-600">Manage your subscription and add funds for premium features</p>
        </div>

        {/* Current Usage */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Usage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* VAPI Minutes */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">VAPI AI Minutes</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {vapiMinutesRemaining}/{stats.totalMinutes}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${100 - stats.usagePercentage}%` }}
                />
              </div>
              <p className="text-xs text-blue-700">
                {vapiMinutesRemaining} minutes remaining this month
              </p>
            </div>

            {/* Web Speech API */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">Web Speech API</span>
                </div>
                <span className="text-sm font-bold text-green-600">Unlimited</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full w-full" />
              </div>
              <p className="text-xs text-green-700">Always available and free</p>
            </div>

            {/* Pro Balance */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-gray-900">Pro Balance</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">
                  ${payAsYouGoBalance.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (payAsYouGoBalance / 50) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-yellow-700">
                ~{Math.floor(payAsYouGoBalance * 2)} VAPI minutes available
              </p>
            </div>
          </div>
        </div>

        {/* Add Funds (Pro Plan) */}
        {currentPlan === 'pro' || payAsYouGoBalance > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Funds</h2>
                <p className="text-gray-600">Add money to your account for VAPI AI usage ($0.50 per minute)</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-2xl font-bold text-green-600">${payAsYouGoBalance.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {fundingOptions.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => handleAddFunds(option.amount + option.bonus)}
                  disabled={loading}
                  className="relative p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50"
                >
                  {option.bonus > 0 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      +${option.bonus}
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">${option.amount}</div>
                    {option.bonus > 0 && (
                      <div className="text-sm text-green-600">+${option.bonus} bonus</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      ~{(option.amount + option.bonus) * 2} minutes
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">How it works</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• VAPI AI costs $0.50 per minute of interview time</li>
                    <li>• Funds never expire and roll over month to month</li>
                    <li>• Web Speech API remains free and unlimited</li>
                    <li>• Get bonus credits on larger purchases</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Plan Comparison */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Comparison</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-2xl p-6 ${
                  currentPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.buttonDisabled || loading}
                  onClick={() => plan.id === 'pro' && handleAddFunds(10)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.buttonDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing History</h2>
          
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No billing history yet</p>
            <p className="text-sm text-gray-400">Your payment history will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Subscription
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { CreditCard } from 'lucide-react'
import { Shield } from 'lucide-react'
import { Check } from 'lucide-react'
import { Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const PaymentModal = ({ isOpen, onClose, plan, vapiMinutes = 0 }) => {
  const { user, updateSubscription } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handlePayment = async () => {
    setLoading(true)

    try {
      let amount, description
      
      if (plan) {
        // Subscription payment
        amount = plan === 'pro' ? 49900 : 0 // ₹499 in paise
        description = `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`
      } else if (vapiMinutes) {
        // VAPI minutes payment
        amount = vapiMinutes * 50 // ₹0.50 per minute in paise
        description = `${vapiMinutes} VAPI Minutes`
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'InterviewMate',
        description: description,
        image: '/logo.png',
        handler: async (response) => {
          try {
            if (plan) {
              const result = await updateSubscription({
                plan: plan,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              })
              
              if (result.success) {
                toast.success(`Successfully upgraded to ${plan} plan!`)
                onClose()
              } else {
                toast.error('Payment verification failed')
              }
            } else if (vapiMinutes) {
              // Handle VAPI minutes purchase
              toast.success(`Successfully added ${vapiMinutes} VAPI minutes!`)
              onClose()
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        notes: {
          userId: user?.id,
          plan: plan,
          vapiMinutes: vapiMinutes
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error('Failed to initialize payment')
      setLoading(false)
    }
  }

  const getPlanDetails = () => {
    if (plan === 'pro') {
      return {
        name: 'Pro Plan',
        price: '₹499',
        period: '/month',
        features: [
          'Pay-as-you-go VAPI minutes',
          'Advanced AI evaluation',
          'Priority processing',
          'LinkedIn integration',
          'Custom interview scenarios',
          'Priority support'
        ]
      }
    } else if (vapiMinutes) {
      return {
        name: `${vapiMinutes} VAPI Minutes`,
        price: `₹${vapiMinutes * 0.5}`,
        period: '',
        features: [
          'Premium voice interaction',
          'Natural conversation flow',
          'Advanced speech recognition',
          'Never expires',
          'Use anytime'
        ]
      }
    }
    return null
  }

  const details = getPlanDetails()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {plan ? <CreditCard className="h-6 w-6 text-blue-600" /> : <Zap className="h-6 w-6 text-yellow-600" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
              <p className="text-sm text-gray-600">Secure payment powered by Razorpay</p>
            </div>
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
          {details && (
            <>
              {/* Plan Details */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{details.name}</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    {details.price}
                    <span className="text-lg text-gray-600">{details.period}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">What's included:</h5>
                <ul className="space-y-2">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h6 className="text-sm font-medium text-green-900 mb-1">Secure Payment</h6>
                    <p className="text-sm text-green-800">
                      Your payment is processed securely by Razorpay. We don't store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay {details.price}
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
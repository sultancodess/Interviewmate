import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/Layout/DashboardLayout'
import { CheckCircle, Brain, Globe, Zap, Star } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
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
      cta: 'Get Started Free',
      href: '/register',
      popular: false,
      icon: Globe
    },
    {
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
      cta: 'Upgrade to Pro',
      href: '/subscription',
      popular: true,
      icon: Brain
    }
  ]

  const faqs = [
    {
      question: 'What is the difference between VAPI AI and Web Speech API?',
      answer: 'VAPI AI provides premium, low-latency voice conversations with advanced AI understanding, while Web Speech API is browser-based and completely free but with basic functionality.'
    },
    {
      question: 'Do VAPI minutes expire?',
      answer: 'Free plan minutes reset monthly. Pro plan funds never expire and roll over indefinitely.'
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes! You can upgrade to Pro anytime by adding funds. Free features remain available regardless of your Pro balance.'
    },
    {
      question: 'Is there a commitment or contract?',
      answer: 'No contracts! Pro plan is pay-as-you-go, and you can use the free plan forever without any commitments.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure Razorpay integration.'
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade only when you need premium features. No hidden fees, no surprises.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <plan.icon className={`w-12 h-12 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1 text-lg">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`block w-full text-center py-4 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free Plan</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">VAPI AI Minutes</td>
                  <td className="py-4 px-6 text-center">30/month</td>
                  <td className="py-4 px-6 text-center">Pay-per-use</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Web Speech API</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Interview Types</td>
                  <td className="py-4 px-6 text-center">HR & Technical</td>
                  <td className="py-4 px-6 text-center">All Types + Custom</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Performance Analytics</td>
                  <td className="py-4 px-6 text-center">Basic</td>
                  <td className="py-4 px-6 text-center">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">PDF Export</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Priority Support</td>
                  <td className="py-4 px-6 text-center">-</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Practicing?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals improving their interview skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/subscription"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Subscription Options
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Pricing
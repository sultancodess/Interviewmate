import React, { useState } from 'react'
import DashboardLayout from '../components/Layout/DashboardLayout'
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Brain,
  Globe,
  Mic,
  BarChart3
} from 'lucide-react'

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    {
      title: 'Getting Started',
      icon: Book,
      color: 'bg-blue-500',
      articles: [
        'How to create your first interview',
        'Understanding VAPI AI vs Web Speech API',
        'Setting up your profile',
        'Choosing the right interview type'
      ]
    },
    {
      title: 'Interview Features',
      icon: Mic,
      color: 'bg-green-500',
      articles: [
        'Customizing interview questions',
        'Using voice commands during interviews',
        'Understanding interview modes',
        'Managing interview duration'
      ]
    },
    {
      title: 'Performance & Analytics',
      icon: BarChart3,
      color: 'bg-purple-500',
      articles: [
        'Reading your performance report',
        'Understanding skill scores',
        'Tracking improvement over time',
        'Exporting reports to PDF'
      ]
    },
    {
      title: 'Billing & Subscription',
      icon: MessageCircle,
      color: 'bg-yellow-500',
      articles: [
        'Understanding pricing plans',
        'Adding funds to Pro account',
        'Managing your subscription',
        'Billing and payment issues'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How does InterviewMate work?',
      answer: 'InterviewMate uses AI to conduct realistic interview simulations. You can choose between VAPI AI for premium natural conversations or Web Speech API for free unlimited practice. The AI asks relevant questions based on your role and experience level, then provides detailed feedback on your performance.'
    },
    {
      question: 'What is the difference between VAPI AI and Web Speech API modes?',
      answer: 'VAPI AI offers premium, low-latency voice conversations with advanced AI understanding and natural flow. Web Speech API is browser-based, completely free, and unlimited but with more basic functionality. Both modes provide valuable interview practice.'
    },
    {
      question: 'How accurate is the AI feedback?',
      answer: 'Our AI uses advanced language models to analyze your responses for communication skills, technical knowledge, confidence, and other key factors. While not perfect, it provides valuable insights and improvement suggestions based on industry best practices.'
    },
    {
      question: 'Can I practice specific interview types?',
      answer: 'Yes! You can choose from HR interviews (behavioral, cultural fit), Technical interviews (coding, system design), or create custom interviews with your own questions and topics.'
    },
    {
      question: 'Do I need special equipment?',
      answer: 'Just a computer or mobile device with a microphone and internet connection. Most modern devices have built-in microphones that work perfectly with InterviewMate.'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a free plan with 30 VAPI AI minutes per month plus unlimited Web Speech API usage. Pro plan is pay-as-you-go at $0.50 per VAPI minute with no monthly fees or commitments.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! There are no contracts or commitments. Free plan is always available, and Pro plan funds never expire. You can stop using the service anytime without penalties.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption and security practices. Your interview data is stored securely and never shared with third parties. You can delete your account and data anytime.'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of InterviewMate
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Search for help articles..."
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your First Interview</h3>
            <p className="text-gray-600 mb-4">Learn how to set up and conduct your first AI interview session</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Get Started →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Reports</h3>
            <p className="text-gray-600 mb-4">Learn how to read and improve from your performance analytics</p>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Learn More →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">Need personal help? Our support team is here to assist you</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Contact Us →
            </button>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${category.color} text-white mr-4`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <button className="text-gray-600 hover:text-blue-600 text-left transition-colors">
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400">Try different keywords or browse categories above</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Chat
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Average response time: 2-4 hours during business days
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HelpPage
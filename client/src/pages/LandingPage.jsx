import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { 
  Brain, 
  Mic, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Play,
  Globe,
  Zap,
  Star,
  Award,
  Target,
  TrendingUp,
  Shield,
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Mock Interviews',
      description: 'Experience realistic, professional-grade mock interviews that mimic HR, technical, and managerial interviews with dynamic questioning.'
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Voice Conversations',
      description: 'Engage in natural voice-based conversations with AI interviewers that adapt dynamically with cross-questions and scenario-based questioning.'
    },
    {
      icon: TrendingUp,
      title: 'Instant Performance Insights',
      description: 'Get real-time performance analytics and comprehensive feedback to track your progress and improve specific skills over time.'
    },
    {
      icon: FileText,
      title: 'Professional Reports',
      description: 'Receive detailed, shareable final reports with skill breakdowns, strengths, weaknesses, and personalized improvement plans.'
    },
    {
      icon: Target,
      title: 'Adaptive Questioning',
      description: 'AI adapts to your responses with follow-up questions, scenario simulations, and persona-specific interview styles.'
    },
    {
      icon: Award,
      title: 'Multiple Interview Types',
      description: 'Practice HR behavioral interviews, technical coding challenges, and managerial strategy discussions.'
    }
  ]

  const interviewTypes = [
    {
      icon: Users,
      title: 'HR Interviews',
      description: 'Behavioral questions, cultural fit assessment, and soft skills evaluation',
      topics: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Career Goals']
    },
    {
      icon: Brain,
      title: 'Technical Interviews',
      description: 'Coding challenges, system design, and technical knowledge assessment',
      topics: ['Data Structures', 'Algorithms', 'System Design', 'Programming', 'Databases']
    },
    {
      icon: Target,
      title: 'Managerial Interviews',
      description: 'Leadership scenarios, strategic thinking, and management skills',
      topics: ['Strategy', 'Team Management', 'Decision Making', 'Conflict Resolution']
    }
  ]

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '30 VAPI AI minutes/month',
        'Unlimited Web Speech API',
        'Basic interview types',
        'Performance reports',
        'Interview history'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$0.50',
      period: '/minute',
      description: 'Pay-as-you-go premium experience',
      features: [
        'Pay-per-minute VAPI AI',
        'Unlimited Web Speech API',
        'All interview types',
        'Advanced analytics',
        'Priority support',
        'Custom questions'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'InterviewMate helped me practice system design questions and improved my confidence. The AI feedback was incredibly detailed and actionable.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Microsoft',
      content: 'The behavioral interview practice was game-changing. I felt so much more prepared for my actual interviews after using this platform.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Amazon',
      content: 'The technical interview simulations were spot-on. The AI asked follow-up questions just like real interviewers do.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <Logo size="md" showText={true} />
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                🚀 AI-Powered Interview Practice Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your Next
              <span className="text-blue-600"> Interview</span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-600">with AI Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              InterviewMate simulates real interviews through voice-based, real-time conversations with AI interviewers. 
              Get dynamic questioning, instant feedback, and professional reports to ace your next interview.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Free Practice
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                30 free VAPI minutes
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Unlimited Web Speech API
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose InterviewMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides the most realistic interview practice experience with professional-grade features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Practice All Interview Types
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From HR behavioral questions to technical coding challenges and managerial scenarios
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {interviewTypes.map((type, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <type.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{type.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Modes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Two Powerful Interview Modes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose between premium VAPI AI or free Web Speech API based on your needs
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* VAPI Mode */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  PREMIUM
                </span>
              </div>
              <div className="flex items-center mb-6">
                <Brain className="h-10 w-10 text-blue-600 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">VAPI AI Mode</h3>
                  <p className="text-blue-600 font-medium">Ultra-realistic conversations</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Experience the most natural and responsive AI interviewer with advanced voice technology and real-time adaptation.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Ultra-low latency responses (&lt;500ms)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Natural conversation flow with interruptions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced AI understanding & context awareness</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Professional voice quality & personas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Dynamic follow-up questions</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  💎 30 free minutes/month • $0.50/minute for additional usage
                </p>
              </div>
            </div>

            {/* Web Speech API Mode */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-200 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  FREE FOREVER
                </span>
              </div>
              <div className="flex items-center mb-6">
                <Globe className="h-10 w-10 text-green-600 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Web Speech API</h3>
                  <p className="text-green-600 font-medium">Unlimited practice</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Unlimited interview practice using your browser's built-in speech recognition with AI-powered question generation.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Completely free forever</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited usage with no restrictions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Browser-based speech recognition</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>AI-generated questions & feedback</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Perfect for continuous practice</span>
                </li>
              </ul>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  🎯 Always available as backup • No cost ever • No limits
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See how InterviewMate helped professionals land their dream jobs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade only when you need premium features
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white p-8 rounded-2xl shadow-lg border-2 ${
                  plan.popular ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
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
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview skills with InterviewMate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Your Free Practice
              <Zap className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Logo size="lg" showText={true} textColor="text-white" />
              <p className="text-gray-400 mt-4 max-w-md">
                AI-powered mock interview platform that helps job seekers practice and improve their interview skills with realistic conversations and professional feedback.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InterviewMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
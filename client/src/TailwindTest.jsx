import React from 'react'
import { Brain } from 'lucide-react'
import { Check } from 'lucide-react'
import { Star } from 'lucide-react'

const TailwindTest = () => {
  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ⭐ InterviewMate - Tailwind Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500 rounded-lg mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">AI-Powered</h3>
            </div>
            <p className="text-gray-600">Advanced AI technology for realistic interview practice.</p>
          </div>
          
          <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-500 rounded-lg mr-4">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Verified</h3>
            </div>
            <p className="text-gray-600">Trusted by thousands of successful candidates.</p>
          </div>
          
          <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-lg mr-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Premium</h3>
            </div>
            <p className="text-white/90">Get the best interview practice experience.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="btn-primary text-lg px-8 py-4">
            Primary Button
          </button>
          <button className="btn-secondary text-lg px-8 py-4">
            Secondary Button
          </button>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Form Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            ✅ Tailwind CSS is working correctly!
          </p>
        </div>
      </div>
    </div>
  )
}

export default TailwindTest
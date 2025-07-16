'use client'

import { useState, useEffect } from 'react'
import { isDemoMode } from '@/lib/services/mockAuthApi'
import { Info, X, Phone, CheckCircle, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DemoInstructions() {
  const [isDemo, setIsDemo] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    const demoMode = isDemoMode()
    setIsDemo(demoMode)
    
    // Show instructions only on first visit in demo mode
    const hasSeenInstructions = localStorage.getItem('demo_instructions_seen')
    if (demoMode && hasSeenInstructions) {
      setShowInstructions(false)
    }
  }, [])

  const handleDismiss = () => {
    setShowInstructions(false)
    localStorage.setItem('demo_instructions_seen', 'true')
  }

  if (!isDemo || !showInstructions) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-white transform -skew-y-6 scale-110"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mt-1">
                <Info className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">🧪 Demo Mode Active - Test the Registration Flow!</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 mt-0.5 text-blue-200" />
                    <div>
                      <p className="font-medium">1. Fill the Form</p>
                      <p className="text-blue-100">Enter any valid details. Phone validation works for 50+ countries!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 mt-0.5 text-purple-200" />
                    <div>
                      <p className="font-medium">2. Get OTP Code</p>
                      <p className="text-blue-100">OTP will appear in a browser alert (normally sent via SMS)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-200" />
                    <div>
                      <p className="font-medium">3. Complete Flow</p>
                      <p className="text-blue-100">Enter OTP to complete registration and see success page</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-white bg-opacity-15 rounded-lg">
                  <p className="text-xs">
                    <strong>💡 Pro Tip:</strong> Try different countries to see phone formatting and validation in action. 
                    Use the demo toggle (bottom right) to switch between demo and production modes.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 
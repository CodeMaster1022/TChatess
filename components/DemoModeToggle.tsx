'use client'

import { useState, useEffect } from 'react'
import { isDemoMode, enableDemoMode, disableDemoMode, getMockData } from '@/lib/services/mockAuthApi'
import { TestTube, Database, Users, Key, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react'

export default function DemoModeToggle() {
  const [isDemo, setIsDemo] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  useEffect(() => {
    setIsDemo(isDemoMode())
  }, [])

  const handleToggle = () => {
    if (isDemo) {
      disableDemoMode()
      setIsDemo(false)
    } else {
      enableDemoMode()
      setIsDemo(true)
    }
  }

  const mockData = getMockData()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm">
        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TestTube className={`w-5 h-5 ${isDemo ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="font-medium text-gray-900">Demo Mode</span>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDemo ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDemo ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Status Indicator */}
        <div className={`flex items-center space-x-2 text-sm ${isDemo ? 'text-blue-600' : 'text-gray-600'}`}>
          {isDemo ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>
            {isDemo ? 'Using mock backend for testing' : 'Using real backend API'}
          </span>
        </div>

        {/* Demo Instructions */}
        {isDemo && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Demo Mode Active</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• OTP codes will be shown in browser alerts</li>
              <li>• All data is stored in browser memory</li>
              <li>• Registration flow works without backend</li>
              <li>• Phone validation fully functional</li>
            </ul>
          </div>
        )}

        {/* Production Mode SMS Status */}
        {!isDemo && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Production Mode
            </h4>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• Real SMS will be sent via GoInfinito</li>
              <li>• OTP codes sent to actual phone numbers</li>
              <li>• Frontend-only storage (temporary)</li>
              <li>• Ready for backend integration</li>
            </ul>
          </div>
        )}

        {/* Debug Info Toggle */}
        {isDemo && (
          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </button>
        )}

        {/* Debug Information */}
        {isDemo && showDebugInfo && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Database className="w-4 h-4 mr-1" />
              Mock Data
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Users:
                </span>
                <span className="font-mono">{mockData.users.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Key className="w-3 h-3 mr-1" />
                  Active OTPs:
                </span>
                <span className="font-mono">{mockData.otpCodes.size}</span>
              </div>
            </div>

            {mockData.users.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 mb-1">Registered Users:</p>
                <div className="space-y-1">
                  {mockData.users.map((user, idx) => (
                    <div key={idx} className="text-xs text-gray-600 bg-white p-1 rounded">
                      {user.email}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mockData.otpCodes.size > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 mb-1">Active OTP Codes:</p>
                <div className="space-y-1">
                  {Array.from(mockData.otpCodes.entries()).map(([phone, data], idx) => (
                    <div key={idx} className="text-xs text-gray-600 bg-white p-1 rounded font-mono">
                      {phone}: {data.code}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 
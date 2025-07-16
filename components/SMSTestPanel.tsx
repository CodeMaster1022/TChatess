'use client'

import { useState } from 'react'
import { validatePhoneNumber, formatPhoneNumber } from '@/lib/utils/phoneValidation'
import { MessageSquare, Send, CheckCircle, AlertCircle, Phone, Globe } from 'lucide-react'

// Simple country list for SMS testing
const testCountries = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' }
]

export default function SMSTestPanel() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(testCountries[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; otpId?: string } | null>(null)

  const handleSendTest = async () => {
    if (!phoneNumber.trim()) {
      setResult({ success: false, message: 'Please enter a phone number' })
      return
    }

    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber, selectedCountry.code)
    if (!validation.isValid) {
      setResult({ success: false, message: validation.error || 'Invalid phone number' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Combine country code and phone number for backend API
      const fullPhoneNumber = `${selectedCountry.dialCode.replace('+', '')}${phoneNumber.replace(/\D/g, '')}`
      
      // Send OTP using backend API
      const response = await fetch('https://api.chatess.com/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: fullPhoneNumber,
          sender_name: "ChatESS"
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult({
          success: true,
          message: `OTP sent successfully via backend! Check phone ${fullPhoneNumber}`,
          otpId: data.otp_id
        })
      } else {
        setResult({
          success: false,
          message: data.detail || 'Failed to send OTP'
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Error sending OTP'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry.code)
    setPhoneNumber(formatted)
    setResult(null) // Clear previous results
  }

  const phoneValidation = validatePhoneNumber(phoneNumber, selectedCountry.code)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">SMS Test Panel</h3>
      </div>
      
      <div className="space-y-4">
        {/* Country Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = testCountries.find(c => c.code === e.target.value)
              if (country) setSelectedCountry(country)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {testCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name} ({country.dialCode})
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="flex">
            <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
              <span className="text-lg mr-2">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
              className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 ${
                phoneNumber && !phoneValidation.isValid 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>
          
          {/* Phone Validation Feedback */}
          {phoneNumber && (
            <div className="mt-1">
              {phoneValidation.isValid ? (
                <p className="text-green-600 text-xs flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid phone number
                </p>
              ) : (
                <p className="text-red-600 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {phoneValidation.error}
                </p>
              )}
            </div>
          )}
        </div>



        {/* Send Button */}
        <button
          onClick={handleSendTest}
          disabled={isLoading || !phoneNumber || !phoneValidation.isValid}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Test OTP</span>
            </>
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className={`p-3 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start space-x-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? 'Success!' : 'Error'}
                </p>
                <p className={`text-xs ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </p>
                {result.otpId && (
                  <p className="text-xs text-green-700 mt-1 font-mono">
                    ID: {result.otpId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> This will send a real OTP to the provided number using your GoInfinito SMS gateway credentials. 
            Make sure to test with your own phone number first.
          </p>
        </div>
      </div>
    </div>
  )
} 
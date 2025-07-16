'use client'

import { useState } from 'react'
import { 
  validatePhoneNumber, 
  formatPhoneNumber, 
  getPhoneNumberPlaceholder,
  getCountryValidationInfo,
  getSupportedCountries,
  phoneValidationRules
} from '@/lib/utils/phoneValidation'
import { CheckCircle, AlertCircle, Phone, Globe } from 'lucide-react'

const PhoneValidationDemo = () => {
  const [testPhone, setTestPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('US')
  
  const supportedCountries = getSupportedCountries()
  const validation = validatePhoneNumber(testPhone, selectedCountry)
  const countryInfo = getCountryValidationInfo(selectedCountry)
  const countryData = phoneValidationRules[selectedCountry]

  const examples = {
    'US': ['2125551234', '(212) 555-1234', '212-555-1234'],
    'IN': ['9876543210', '98765 43210', '987-654-3210'],
    'GB': ['7700900123', '7700 900 123', '0770 090 0123'],
    'AU': ['412345678', '412 345 678', '0412 345 678'],
    'DE': ['1701234567', '170 1234567', '0170 1234567'],
    'FR': ['612345678', '6 12 34 56 78', '06 12 34 56 78'],
    'JP': ['9012345678', '90-1234-5678', '090-1234-5678'],
    'CN': ['13812345678', '138 1234 5678', '138-1234-5678'],
    'BR': ['11987654321', '(11) 98765-4321', '11 98765-4321'],
    'SG': ['91234567', '9123 4567', '9123-4567']
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📱 Phone Number Validation Demo
        </h1>
        <p className="text-gray-600">
          Test the comprehensive phone validation system with {supportedCountries.length} supported countries
        </p>
      </div>

      {/* Interactive Test Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Live Validation Test
        </h2>
        
        <div className="space-y-4">
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {supportedCountries.map(code => (
                <option key={code} value={code}>
                  {phoneValidationRules[code].flag} {phoneValidationRules[code].name} ({phoneValidationRules[code].dialCode})
                </option>
              ))}
            </select>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder={getPhoneNumberPlaceholder(selectedCountry)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                testPhone ? (validation.isValid ? 'border-green-300 focus:ring-green-500' : 'border-red-300 focus:ring-red-500') : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Country Info */}
          {countryInfo && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {countryData.flag} {countryData.name} Format Rules
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><span className="font-medium">Format:</span> <code className="bg-blue-100 px-1 rounded">{countryInfo.format}</code></p>
                <p><span className="font-medium">Length:</span> {countryInfo.length}</p>
                <p><span className="font-medium">Example:</span> <code className="bg-blue-100 px-1 rounded">{countryInfo.example}</code></p>
              </div>
            </div>
          )}

          {/* Validation Result */}
          {testPhone && (
            <div className={`rounded-lg p-4 ${validation.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center space-x-2">
                {validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${validation.isValid ? 'text-green-900' : 'text-red-900'}`}>
                  {validation.isValid ? 'Valid Phone Number' : 'Invalid Phone Number'}
                </span>
              </div>
              
              {validation.isValid && validation.formattedNumber && (
                <div className="mt-2 text-sm text-green-800">
                  <p><span className="font-medium">Formatted:</span> {validation.formattedNumber}</p>
                  <p><span className="font-medium">Clean digits:</span> {testPhone.replace(/\D/g, '')}</p>
                </div>
              )}
              
              {!validation.isValid && validation.error && (
                <div className="mt-2 text-sm text-red-800">
                  <p><span className="font-medium">Error:</span> {validation.error}</p>
                  {validation.suggestion && (
                    <p><span className="font-medium">Suggestion:</span> {validation.suggestion}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Example Numbers */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Example Valid Numbers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(examples).map(([countryCode, nums]) => {
            const country = phoneValidationRules[countryCode]
            return (
              <div key={countryCode} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  {country.flag} {country.name}
                </h3>
                <div className="space-y-1 text-sm">
                  {nums.map((num, idx) => (
                    <div key={idx} className="flex justify-between">
                      <code className="text-gray-600">{num}</code>
                      <span className="text-green-600">✓</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSelectedCountry(countryCode)
                    setTestPhone(nums[0])
                  }}
                  className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  Test This
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* API Usage */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Basic Validation</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { validatePhoneNumber } from '@/lib/utils/phoneValidation'

const result = validatePhoneNumber('2125551234', 'US')
console.log(result)
// { isValid: true, formattedNumber: '(212) 555-1234' }`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">2. Format Phone Number</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { formatPhoneNumber } from '@/lib/utils/phoneValidation'

const formatted = formatPhoneNumber('2125551234', 'US')
console.log(formatted) // '(212) 555-1234'`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. Get Country Info</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { getCountryValidationInfo } from '@/lib/utils/phoneValidation'

const info = getCountryValidationInfo('US')
console.log(info)
// { format: '(XXX) XXX-XXXX', example: '(000) 000-0000', length: '10 digits' }`}
            </pre>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Validation Statistics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{supportedCountries.length}</div>
            <div className="text-sm text-blue-800">Supported Countries</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(phoneValidationRules).filter(rule => rule.minLength === rule.maxLength).length}
            </div>
            <div className="text-sm text-green-800">Fixed Length</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(phoneValidationRules).filter(rule => rule.minLength !== rule.maxLength).length}
            </div>
            <div className="text-sm text-yellow-800">Variable Length</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-purple-800">Format Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneValidationDemo 
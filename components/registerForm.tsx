'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { register, sendOTP, clearError, resetRegistrationFlow } from "@/lib/features/auth/authSlice"
import OTPVerification from './OTPVerification'
import { 
  User, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ChevronDown,
  Globe,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { 
  validatePhoneNumber, 
  formatPhoneNumber as formatPhone, 
  getPhoneNumberPlaceholder,
  getCountryValidationInfo,
  isCountrySupported 
} from '@/lib/utils/phoneValidation'
import { randomUUID } from 'crypto'

// Country data with flags and dial codes
const countries = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰' },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭' },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷' },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱' },
  { name: 'Czech Republic', code: 'CZ', dialCode: '+420', flag: '🇨🇿' },
  { name: 'Hungary', code: 'HU', dialCode: '+36', flag: '🇭🇺' },
  { name: 'Romania', code: 'RO', dialCode: '+40', flag: '🇷🇴' },
  { name: 'Bulgaria', code: 'BG', dialCode: '+359', flag: '🇧🇬' },
  { name: 'Croatia', code: 'HR', dialCode: '+385', flag: '🇭🇷' },
  { name: 'Slovenia', code: 'SI', dialCode: '+386', flag: '🇸🇮' },
  { name: 'Slovakia', code: 'SK', dialCode: '+421', flag: '🇸🇰' },
  { name: 'Lithuania', code: 'LT', dialCode: '+370', flag: '🇱🇹' },
  { name: 'Latvia', code: 'LV', dialCode: '+371', flag: '🇱🇻' },
  { name: 'Estonia', code: 'EE', dialCode: '+372', flag: '🇪🇪' },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹' },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { name: 'UAE', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼' },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭' },
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲' },
  { name: 'Jordan', code: 'JO', dialCode: '+962', flag: '🇯🇴' },
  { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: '🇱🇧' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦' },
  { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳' },
  { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
  { name: 'Peru', code: 'PE', dialCode: '+51', flag: '🇵🇪' },
  { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾' },
  { name: 'Paraguay', code: 'PY', dialCode: '+595', flag: '🇵🇾' },
  { name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴' },
  { name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺' },
].sort((a, b) => a.name.localeCompare(b.name))

export default function RegisterForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { 
    isLoading, 
    error, 
    registrationStep,
    otpVerified
  } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    acceptTerms: false
  })
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Reset registration flow when component mounts
  useEffect(() => {
    dispatch(resetRegistrationFlow())
  }, [dispatch])

  // Handle successful registration completion
  useEffect(() => {
    if (registrationStep === 'completed') {
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 2000)
    }
  }, [registrationStep, router])

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    // Required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required'
    if (!formData.password) errors.password = 'Password is required'
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    if (!formData.acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Advanced phone number validation
    if (formData.phoneNumber) {
      const phoneValidation = validatePhoneNumber(formData.phoneNumber, selectedCountry.code)
      if (!phoneValidation.isValid) {
        errors.phoneNumber = phoneValidation.error || 'Invalid phone number'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    // Step 1: Validate all form values
    if (!validateForm()) {
      return
    }

    try {
      // Step 2: Send OTP for phone verification (do NOT register yet)
      await dispatch(sendOTP({
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        countryCode: selectedCountry.dialCode,
        // Store form data for later registration
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
          countryCode: selectedCountry.dialCode
        }
      })).unwrap()

      // Flow continues to OTP verification step
      // Registration will happen AFTER OTP verification in handleOTPSuccess

    } catch (error) {
      // Error is handled by Redux
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Use the comprehensive formatting utility
    return formatPhone(value, selectedCountry.code)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({...formData, phoneNumber: formatted})
    // Clear validation error when user starts typing
    if (validationErrors.phoneNumber) {
      setValidationErrors({...validationErrors, phoneNumber: ''})
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({...formData, [field]: value})
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({...validationErrors, [field]: ''})
    }
  }

  const handleBackToForm = () => {
    dispatch(resetRegistrationFlow())
  }

  const handleOTPSuccess = async () => {
    // Step 3: After OTP verification, now register the user
    try {
      await dispatch(register({
        username: formData.firstName + ' ' + formData.lastName,
        tenant_id: randomUUID(),
        email: formData.email,
        password: formData.password,
      })).unwrap()

      // Registration complete - redirect will be handled by useEffect
    } catch (error) {
      // Error is handled by Redux
      console.error('Registration failed after OTP verification:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-medical-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ArrowLeft size={20} className="mr-2" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">ChatESS</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {registrationStep === 'form' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-medical-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600">
                    Join ChatESS to get instant medical report analysis and treatment guidance.
                  </p>
                </div>

                {/* Global Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 ${
                          validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-600 text-xs mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 ${
                          validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-600 text-xs mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 ${
                          validationErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* Fancy Phone Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="flex">
                        {/* Country Code Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-[120px]"
                          >
                            <span className="text-lg mr-2">{selectedCountry.flag}</span>
                            <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
                            <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                          </button>
                          
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                              <div className="p-3 border-b border-gray-200">
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
                                  />
                                  <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCountries.map((country, index) => (
                                  <button
                                    key={`${country.code}-${index}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country)
                                      setShowCountryDropdown(false)
                                      setSearchTerm('')
                                    }}
                                    className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <span className="text-lg mr-3">{country.flag}</span>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{country.name}</div>
                                      <div className="text-xs text-gray-500">{country.dialCode}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder={getPhoneNumberPlaceholder(selectedCountry.code)}
                          className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none text-sm focus:ring-2 focus:ring-medical-500 ${
                            validationErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {validationErrors.phoneNumber && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.phoneNumber}</p>
                    )}
                    {!validationErrors.phoneNumber && formData.phoneNumber && (
                      (() => {
                        const validation = validatePhoneNumber(formData.phoneNumber, selectedCountry.code)
                        if (validation.isValid) {
                          return (
                            <p className="text-green-600 text-xs mt-1 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valid {selectedCountry.name} phone number
                            </p>
                          )
                        }
                        return null
                      })()
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      <p>We'll send you a verification code via SMS</p>
                      {(() => {
                        const info = getCountryValidationInfo(selectedCountry.code)
                        if (info) {
                          return (
                            <p className="mt-1">
                              Expected format: <span className="font-mono">{info.format}</span> ({info.length})
                            </p>
                          )
                        }
                        return null
                      })()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full px-3 py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 ${
                          validationErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-3 py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 ${
                          validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="h-4 w-4 text-medical-600 focus:ring-medical-500 border-gray-300 rounded mt-1"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-medical-600 hover:text-medical-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-medical-600 hover:text-medical-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {validationErrors.acceptTerms && (
                    <p className="text-red-600 text-xs">{validationErrors.acceptTerms}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-medical-600 text-white py-3 rounded-lg font-semibold hover:bg-medical-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-medical-600 hover:text-medical-500 font-medium">
                      Sign in
                    </a>
                  </p>
                </div>
              </motion.div>
            )}

            {registrationStep === 'otp' && (
              <OTPVerification 
                onBack={handleBackToForm}
                onSuccess={handleOTPSuccess}
              />
            )}
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center px-8">
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose ChatESS?
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-medical-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Instant Analysis</h4>
                    <p className="text-gray-600">Get comprehensive analysis of your medical reports in seconds</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-medical-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Treatment Guidance</h4>
                    <p className="text-gray-600">Receive personalized treatment recommendations based on your results</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-medical-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Secure & Private</h4>
                    <p className="text-gray-600">HIPAA-compliant platform ensuring your medical data is protected</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-medical-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">Health Tracking</h4>
                    <p className="text-gray-600">Monitor your health trends and progress over time</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-medical-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-medical-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Secure</h4>
                    <p className="text-sm text-gray-600">Your medical data is encrypted and protected</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showCountryDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCountryDropdown(false)}
        />
      )}
    </div>
  )
} 
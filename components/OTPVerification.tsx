'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { verifyOTP, sendOTP, clearError } from "@/lib/features/auth/authSlice"
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { 
  CheckCircle,
  RotateCcw,
  Phone,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'

interface OTPVerificationProps {
  onBack: () => void
  onSuccess: () => void
}

export default function OTPVerification({ onBack, onSuccess }: OTPVerificationProps) {
  const dispatch = useAppDispatch()
  const { 
    isLoading, 
    error, 
    pendingRegistrationData,
    otpVerified 
  } = useAppSelector((state) => state.auth)
  
  const [otp, setOtp] = useState("")
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Auto-submit OTP when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6 && pendingRegistrationData) {
      handleVerifyOTP()
    }
  }, [otp])

  // Handle successful verification
  useEffect(() => {
    if (otpVerified) {
      onSuccess()
    }
  }, [otpVerified, onSuccess])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleVerifyOTP = async () => {
    if (!pendingRegistrationData || otp.length !== 6) return

    try {
      await dispatch(verifyOTP({
        phoneNumber: pendingRegistrationData.phoneNumber,
        countryCode: pendingRegistrationData.countryCode,
        otp,
        email: pendingRegistrationData.email
      })).unwrap()
    } catch (error) {
      // Error is handled by Redux
      setOtp("") // Clear OTP on error
    }
  }

  const handleResendOTP = async () => {
    if (!pendingRegistrationData || !canResend) return

    try {
      await dispatch(sendOTP({
        phoneNumber: pendingRegistrationData.phoneNumber,
        countryCode: pendingRegistrationData.countryCode
      })).unwrap()
      
      setResendTimer(30)
      setCanResend(false)
      setOtp("")
      dispatch(clearError())
    } catch (error) {
      // Error is handled by Redux
    }
  }

  if (!pendingRegistrationData) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-medical-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verify Your Phone
        </h2>
        <p className="text-gray-600 mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-lg font-semibold text-gray-900">
          {pendingRegistrationData.countryCode} {pendingRegistrationData.phoneNumber}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          disabled={isLoading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-medical-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-medical-600"></div>
            <span className="text-sm">Verifying...</span>
          </div>
        </div>
      )}

      {/* Resend OTP */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">
          Didn't receive the code?
        </p>
        
        {canResend ? (
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 text-medical-600 hover:text-medical-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resend Code</span>
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Resend code in {resendTimer}s
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Form</span>
        </button>

        <button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isLoading}
          className="bg-medical-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-medical-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Verify
        </button>
      </div>

      {/* Success state */}
      {otpVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Phone Verified!
            </h3>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  User, 
  Stethoscope, 
  Brain, 
  Shield, 
  Zap,
  ArrowRight,
  X,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  Menu
} from 'lucide-react'
import { useKeycloak } from "@/lib/context/KeycloakContext"


export default function Home() {
  const [showContactModal, setShowContactModal] = useState(false)
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { keycloak, initialized, isActivated } = useKeycloak()
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    hospitalClinic: '',
    phoneNumber: '',
    notes: ''
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  
  const handleLogin = () => {
    keycloak.login()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.login-dropdown')) {
        setShowLoginDropdown(false)
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false)
      }
    }

    if (showLoginDropdown || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLoginDropdown, showMobileMenu])

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's empty (optional field)
    if (phone.trim() === '') {
      return '';
    }
    
    // Check if it has at least 7 digits and at most 15 digits
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return 'Phone number must be between 7 and 15 digits';
    }
    
    // Check if it contains only valid characters (digits, spaces, dashes, parentheses, plus)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(phone)) {
      return 'Phone number contains invalid characters';
    }
    
    return '';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    setPhoneError(phoneValidation);
    
    if (phoneValidation) {
      return; // Don't submit if phone validation fails
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('https://api.chatess.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowContactModal(false);
        setFormData({ fullName: '', workEmail: '', hospitalClinic: '', phoneNumber: '', notes: '' });
        setSubmitStatus('success');
        setPhoneError(''); // Clear any previous errors
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const scrollToEnterprise = () => {
    document.getElementById('Hospitals & Clinics')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-600">ChatESS</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Features
                </a>
                <div className="relative login-dropdown">
                  <a 
                    href="https://logistics.chatess.com/login"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </a>
                </div>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Contact Sales
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="mobile-menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="md:hidden mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a 
                  href="https://logistics.chatess.com/login"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </a>
                <a 
                  href="#features"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Features
                </a>
                <button 
                  onClick={() => {
                    setShowContactModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              AI-Powered Medical Diagnostics for{' '}
              <span className="text-primary-600">Faster, Smarter</span> Treatment Decisions
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Empowering physicians and individuals with intelligent lab report analysis and treatment guidance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto"
            >
              <button 
                onClick={scrollToEnterprise}
                className="bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                <Building2 size={20} />
                <span className="whitespace-nowrap">For Hospitals & Clinics</span>
                <ArrowRight size={20} />
              </button>
              
              <button
                onClick={scrollToEnterprise}
                className="bg-white text-primary-600 border-2 border-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                <User size={20} />
                <span className="whitespace-nowrap">For Individuals</span>
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dual Card Layout */}
      <section id="Hospitals & Clinics" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Choose Your Path to Better Healthcare
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a healthcare provider or an individual, we have the right solution for you.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* Enterprise Card */}
            <motion.div 
              // initial={{ opacity: 0, x: -50 }}
              // whileInView={{ opacity: 1, x: 0 }}
              // transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Built for Hospitals & Clinics Use
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Dashboard with multiple users</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">EMR Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Custom model tuning</span>
                </div>
              </div>

              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full bg-primary-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors min-h-[48px] touch-manipulation"
              >
                Request Demo
              </button>
            </motion.div>

            {/* Individual Card */}
            <motion.div 
              // initial={{ opacity: 0, x: 50 }}
              // whileInView={{ opacity: 1, x: 0 }}
              // transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-medical-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Built for Personal Health
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Upload reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Instant analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-600 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Track your health</span>
                </div>
              </div>

              <a 
                href="https://stage.shiper.io"
                className="w-full bg-medical-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-medical-700 transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                Start with ChatESS
                <ArrowRight size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose ChatESS?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology designed specifically for medical diagnostics
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-4 sm:p-6"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Advanced machine learning algorithms analyze your medical reports with precision</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-4 sm:p-6"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-medical-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">HIPAA-compliant platform ensuring your medical data is always protected</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-4 sm:p-6 md:col-span-2 lg:col-span-1"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Get comprehensive analysis and treatment recommendations in seconds</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Request Demo</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.workEmail}
                  onChange={(e) => setFormData({...formData, workEmail: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital/Clinic *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospitalClinic}
                  onChange={(e) => setFormData({...formData, hospitalClinic: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits, spaces, dashes, parentheses, and plus signs
                    const phoneRegex = /^[\d\s\-\(\)\+]*$/;
                    if (phoneRegex.test(value) || value === '') {
                      setFormData({...formData, phoneNumber: value});
                      // Clear error when user starts typing
                      if (phoneError) {
                        setPhoneError('');
                      }
                    }
                  }}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base ${
                    phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes/Message
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-base"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-primary-600 text-white py-3 sm:py-4 rounded-lg font-semibold transition-colors min-h-[48px] touch-manipulation ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Submit Status Modal */}
      {submitStatus !== 'idle' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto text-center"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{submitStatus === 'success' ? 'Thank You!' : 'Submission Failed'}</h3>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              {submitStatus === 'success' ? (
                <p className="text-gray-700 text-base sm:text-lg">Thank you! Our sales team will contact you soon.</p>
              ) : (
                <p className="text-gray-700 text-base sm:text-lg">Failed to send email. Please try again later.</p>
              )}
            </div>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="w-full bg-primary-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors min-h-[48px] touch-manipulation"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">ChatESS</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                AI-powered medical diagnostics for faster, smarter treatment decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#Hospitals & Clinics" className="hover:text-white transition-colors">Hospitals & Clinics</a></li>
                <li><a href="#Hospitals & Clinics" className="hover:text-white transition-colors">Individuals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="break-all">example@example.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0" />
                  <span>123456789</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2025 ChatESS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 

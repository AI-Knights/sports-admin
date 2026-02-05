'use client'

import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { useResendOtpMutation, useVerifyOtpMutation } from '@/store/api/auth/auth'
import { toast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

export default function OTPVerification() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerified, setIsVerified] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [verifyOtp] = useVerifyOtpMutation()
  const [resendOtp] = useResendOtpMutation()
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char
    })
    setOtp(newOtp)

    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleVerify = async () => {
    if (otp.every(digit => digit !== '')) {


      const email = localStorage.getItem("email");
      console.log("Verifying OTP for email:", { email, otp: otp.join('') });
      const verifyOtpResponse = await verifyOtp({ email: email || '', otp: otp.join('') })
        .unwrap()
        .then((response) => {
          localStorage.setItem("access", response.access);
          localStorage.setItem("refresh", response.refresh);
          console.log("OTP verified successfully:", response);
          localStorage.removeItem("email");
          setIsVerified(true)
          toast({
            title: "Success",
            description: "OTP verified successfully!",

          });
        })
        .catch((error) => {
          console.error("OTP verification failed:", error);
        });
    }
  }

  const handleResend = async () => {
    setOtp(['', '', '', '', '', ''])
    setIsVerified(false)
    inputRefs.current[0]?.focus()
    const email = localStorage.getItem("email");
    resendOtp({ email: email || '' })
      .unwrap()
      .then((response) => {
        console.log("OTP resent successfully:", response);
        toast({
          title: "Success",
          description: "OTP resent successfully!",
        });
      })
      .catch((error) => {
        console.error("OTP resend failed:", error);
      });
  }

  const handleGoToLogin = () => {
    router.push("/")
    console.log('Redirect to login')
  }

  return (
    <div className="min-h-screen rounded-none bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isVerified ? (
          <motion.div
            key="otp-input"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md "
          >
            <div className="bg-white rounded-none shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-xl font-semibold"
                >
                  Verify Identity
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-sm mt-2"
                >
                  Please fill the otp code we just sent you on your
                  <br />
                  registered email
                </motion.p>
              </div>

              {/* OTP Input Section */}
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center gap-2 mb-6"
                >
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      whileFocus={{ scale: 1.05 }}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-none rounded-tl-2xl rounded-br-2xl focus:border-orange-400 focus:outline-none transition-all"
                    />
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={handleVerify}
                  disabled={!otp.every(digit => digit !== '')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-4"
                >
                  Verify
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}

                  className="w-full text-gray-600 text-sm py-2 hover:text-gray-800 transition-colors"
                >
                  <span onClick={handleResend} className='font-bold text-blue-900' >Resend</span> code in 60s
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-center mt-4"
                >
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Demo credentials: any email & password
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center mt-4"
                >
                  <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Secure admin access • Protected by 2FA
                  </button>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Admin Panel v2.1.2 © 2024 Football Admin
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-none shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-xl font-semibold"
                >
                  Football Admin
                </motion.h2>
              </div>

              {/* Success Content */}
              <div className="p-8 text-center">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  Congratulation!
                </motion.h3>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-8"
                >
                  <div className="relative w-full h-full">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="absolute inset-0 bg-orange-400 rounded-full"
                    />
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center relative">
                        {/* Scalloped edge effect */}
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 bg-orange-400 rounded-full"
                            style={{
                              transform: `rotate(${i * 30}deg) translateY(-12px)`,
                            }}
                          />
                        ))}
                        <Check className="w-10 h-10 text-white relative z-10" strokeWidth={3} />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={handleGoToLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold mb-4"
                >
                  Go to dashboard
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center"
                >
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Demo credentials: any email & password
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-center mt-4"
                >
                  <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Secure admin access • Protected by 2FA
                  </button>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Admin Panel v2.1.2 © 2024 Football Admin
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
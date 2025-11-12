'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const checkSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push(redirect)
    }
  }, [router, redirect])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (otpSent) {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        })

        if (error) throw error

        toast.success('Login successful!')
        router.push(redirect)
      } else {
        // Send OTP or sign in with password
        if (password) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          toast.success('Login successful!')
          router.push(redirect)
        } else {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
            },
          })

          if (error) throw error

          toast.success('OTP sent to your email!')
          setOtpSent(true)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (otpSent) {
        // Verify OTP
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone.replace(/\D/g, ''),
          token: otp,
          type: 'sms',
        })

        if (error) throw error

        toast.success('Login successful!')
        router.push(redirect)
      } else {
        // Send OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone.replace(/\D/g, ''),
          options: {
            shouldCreateUser: true,
          },
        })

        if (error) throw error

        toast.success('OTP sent to your phone!')
        setOtpSent(true)
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-4xl font-bold text-saffron mb-8 text-center">Login</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setMethod('email')
              setOtpSent(false)
            }}
            className={`flex-1 py-2 rounded-lg ${
              method === 'email'
                ? 'bg-saffron text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => {
              setMethod('phone')
              setOtpSent(false)
            }}
            className={`flex-1 py-2 rounded-lg ${
              method === 'phone'
                ? 'bg-saffron text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Phone
          </button>
        </div>

        {method === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                disabled={otpSent}
              />
            </div>

            {!otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (optional - leave blank for OTP)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                />
              </div>
            )}

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                disabled={otpSent}
              />
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
            </button>
          </form>
        )}

        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-saffron hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}


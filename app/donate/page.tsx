'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

const PRESET_AMOUNTS = [101, 501, 1001, 2100, 5100, 10000]

export default function DonatePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const checkUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login?redirect=/donate')
      return
    }
    setUser(session.user)
  }, [router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const handleDonate = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/donate')
      return
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...')
      return
    }

    const donationAmount = amount || parseFloat(customAmount)
    
    if (!donationAmount || donationAmount < 1) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      // Create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: donationAmount, note }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { orderId, key, donationId } = await response.json()

      // Initialize Razorpay
      const options = {
        key,
        amount: donationAmount * 100,
        currency: 'INR',
        name: 'Sri Abhayanjaneya Swamy Temple',
        description: 'Donation',
        order_id: orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId,
            }),
          })

          if (verifyResponse.ok) {
            toast.success('Donation successful! Receipt will be sent to your email.')
            router.push('/dashboard')
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#FF9933',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        toast.error('Payment failed: ' + response.error.description)
        setLoading(false)
      })
      razorpay.open()
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to process donation')
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-saffron mb-8 text-center">Make a Donation</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Amount</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset)
                    setCustomAmount('')
                  }}
                  className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                    amount === preset
                      ? 'border-saffron bg-saffron text-white'
                      : 'border-gray-300 hover:border-saffron'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter custom amount
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setAmount(0)
                }}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note with your donation"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent"
            />
          </div>

          <button
            onClick={handleDonate}
            disabled={loading || (!amount && !customAmount) || !razorpayLoaded}
            className="w-full bg-saffron text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : !razorpayLoaded ? 'Loading...' : 'Donate Now'}
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Your donation helps us maintain the temple and serve the community.
          </p>
        </div>
      </div>
    </>
  )
}

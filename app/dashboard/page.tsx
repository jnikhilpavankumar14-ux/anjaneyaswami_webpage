'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Donation {
  id: string
  amount: number
  razorpay_payment_id: string | null
  razorpay_order_id: string
  status: string
  receipt_url: string | null
  note: string | null
  created_at: string
  completed_at: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    setUser(session.user)
    fetchDonations(session.user.id)
  }

  const fetchDonations = async (userId: string) => {
    try {
      const { data: donor } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!donor) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', donor.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch donations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (donation: Donation) => {
    if (!donation.receipt_url) {
      toast.error('Receipt not available')
      return
    }

    try {
      const response = await fetch(donation.receipt_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt_${donation.razorpay_order_id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error('Failed to download receipt')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-saffron mb-8">My Donations</h1>

      {donations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't made any donations yet.</p>
          <a
            href="/donate"
            className="inline-block bg-saffron text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Make a Donation
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    ₹{donation.amount.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(donation.created_at), 'PPP')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    donation.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : donation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {donation.status}
                </span>
              </div>

              {donation.razorpay_payment_id && (
                <p className="text-sm text-gray-600 mb-2">
                  Payment ID: {donation.razorpay_payment_id}
                </p>
              )}

              {donation.note && (
                <p className="text-gray-700 mb-4 italic">"{donation.note}"</p>
              )}

              {donation.status === 'completed' && donation.receipt_url && (
                <button
                  onClick={() => downloadReceipt(donation)}
                  className="bg-saffron text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Download Receipt
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


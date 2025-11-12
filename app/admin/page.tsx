'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Donation {
  id: string
  amount: number
  razorpay_payment_id: string | null
  razorpay_order_id: string
  status: string
  note: string | null
  created_at: string
  completed_at: string | null
  donors: {
    name: string
    email: string
    phone: string
  }
}

interface PujaEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'donations' | 'puja' | 'gallery' | 'settings'>('donations')
  const [donations, setDonations] = useState<Donation[]>([])
  const [pujaEvents, setPujaEvents] = useState<PujaEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login?redirect=/admin')
      return
    }

    setUser(session.user)

    const response = await fetch('/api/check-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        phone: session.user.phone,
      }),
    })

    if (response.ok) {
      const { isAdmin: admin } = await response.json()
      if (!admin) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/')
        return
      }
      setIsAdmin(true)
      fetchData()
    } else {
      router.push('/')
    }
  }

  const fetchData = async () => {
    if (activeTab === 'donations') {
      await fetchDonations()
    } else if (activeTab === 'puja') {
      await fetchPujaEvents()
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [activeTab, isAdmin])

  const fetchDonations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/admin/donations', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setDonations(data)
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Access denied')
        router.push('/')
      }
    } catch (error) {
      toast.error('Failed to fetch donations')
    } finally {
      setLoading(false)
    }
  }

  const fetchPujaEvents = async () => {
    try {
      const response = await fetch('/api/admin/puja-events')
      if (response.ok) {
        const data = await response.json()
        setPujaEvents(data)
      }
    } catch (error) {
      toast.error('Failed to fetch puja events')
    }
  }

  const exportCSV = () => {
    const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'Amount', 'Payment ID', 'Status']
    const rows = donations.map((d) => [
      format(new Date(d.created_at), 'yyyy-MM-dd'),
      d.donors.name,
      d.donors.email,
      d.donors.phone,
      d.amount,
      d.razorpay_payment_id || 'N/A',
      d.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations_${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-saffron mb-8">Admin Panel</h1>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6">
            {(['donations', 'puja', 'gallery', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-saffron text-saffron'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'donations' && (
            <DonationsTab donations={donations} onExport={exportCSV} />
          )}
          {activeTab === 'puja' && (
            <PujaTab events={pujaEvents} onRefresh={fetchPujaEvents} />
          )}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

function DonationsTab({ donations, onExport }: { donations: Donation[]; onExport: () => void }) {
  const [offlineDonation, setOfflineDonation] = useState({
    donorName: '',
    amount: '',
    bankTxnId: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [showOfflineForm, setShowOfflineForm] = useState(false)

  const handleOfflineDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/offline-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineDonation),
      })

      if (response.ok) {
        toast.success('Offline donation recorded')
        setShowOfflineForm(false)
        setOfflineDonation({
          donorName: '',
          amount: '',
          bankTxnId: '',
          date: new Date().toISOString().split('T')[0],
        })
        window.location.reload()
      } else {
        toast.error('Failed to record donation')
      }
    } catch (error) {
      toast.error('Failed to record donation')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Donations</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowOfflineForm(!showOfflineForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add Offline Donation
          </button>
          <button
            onClick={onExport}
            className="bg-saffron text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Export CSV
          </button>
        </div>
      </div>

      {showOfflineForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">Record Offline Donation</h3>
          <form onSubmit={handleOfflineDonation} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Donor Name"
              value={offlineDonation.donorName}
              onChange={(e) => setOfflineDonation({ ...offlineDonation, donorName: e.target.value })}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Amount"
              value={offlineDonation.amount}
              onChange={(e) => setOfflineDonation({ ...offlineDonation, amount: e.target.value })}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Bank Transaction ID"
              value={offlineDonation.bankTxnId}
              onChange={(e) => setOfflineDonation({ ...offlineDonation, bankTxnId: e.target.value })}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={offlineDonation.date}
              onChange={(e) => setOfflineDonation({ ...offlineDonation, date: e.target.value })}
              required
              className="px-4 py-2 border rounded-lg"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-saffron text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowOfflineForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(donation.created_at), 'PPp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{donation.donors.name}</div>
                  <div className="text-sm text-gray-500">{donation.donors.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{donation.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {donation.razorpay_payment_id || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      donation.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : donation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {donation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PujaTab({ events, onRefresh }: { events: PujaEvent[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<PujaEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingEvent
        ? `/api/admin/puja-events/${editingEvent.id}`
        : '/api/admin/puja-events'
      const method = editingEvent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingEvent ? 'Event updated' : 'Event created')
        setShowForm(false)
        setEditingEvent(null)
        setFormData({ title: '', description: '', date: '', time: '' })
        onRefresh()
      } else {
        toast.error('Failed to save event')
      }
    } catch (error) {
      toast.error('Failed to save event')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/admin/puja-events/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Event deleted')
        onRefresh()
      } else {
        toast.error('Failed to delete event')
      }
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const startEdit = (event: PujaEvent) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
    })
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Puja Schedule</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingEvent(null)
            setFormData({ title: '', description: '', date: '', time: '' })
          }}
          className="bg-saffron text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-saffron text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                {editingEvent ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingEvent(null)
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(event.date), 'PPP')} at {event.time}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(event)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryTab() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gallery Management</h2>
      <p className="text-gray-600">
        Gallery uploads are managed from the{' '}
        <a href="/gallery" className="text-saffron hover:underline">
          Gallery page
        </a>
        . Only admin users can upload media.
      </p>
    </div>
  )
}

function SettingsTab() {
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [templeEmail, setTempleEmail] = useState('')
  const [templePhone, setTemplePhone] = useState('')

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, phone: adminPhone }),
      })

      if (response.ok) {
        toast.success('Admin added successfully')
        setAdminEmail('')
        setAdminPhone('')
      } else {
        toast.error('Failed to add admin')
      }
    } catch (error) {
      toast.error('Failed to add admin')
    }
  }

  const handleUpdateTempleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/temple-contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: templeEmail, phone: templePhone }),
      })

      if (response.ok) {
        toast.success('Temple contact updated')
      } else {
        toast.error('Failed to update contact')
      }
    } catch (error) {
      toast.error('Failed to update contact')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="tel"
            placeholder="Admin Phone"
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-saffron text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Add Admin
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Temple Contact</h2>
        <form onSubmit={handleUpdateTempleContact} className="space-y-4 max-w-md">
          <input
            type="email"
            placeholder="Temple Email"
            value={templeEmail}
            onChange={(e) => setTempleEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="tel"
            placeholder="Temple Phone"
            value={templePhone}
            onChange={(e) => setTemplePhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-saffron text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Update Contact
          </button>
        </form>
      </div>
    </div>
  )
}


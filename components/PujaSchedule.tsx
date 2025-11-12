'use client'

import { useEffect, useState } from 'react'

interface PujaEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
}

export default function PujaSchedule() {
  const [events, setEvents] = useState<PujaEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/puja-schedule')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-saffron mb-4">Puja Schedule</h2>
        <p className="text-gray-600">Loading schedule...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-3xl font-bold text-saffron mb-4">Current Puja Schedule</h2>
      {events.length === 0 ? (
        <p className="text-gray-600">No scheduled pujas at this time.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border-l-4 border-saffron pl-4 py-2">
              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(event.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} at {event.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


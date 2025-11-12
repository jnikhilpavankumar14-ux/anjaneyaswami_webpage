'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface GalleryItem {
  id: string
  caption: string
  event_date: string
  file_url: string
  file_type: string
  created_at: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    checkUser()
    fetchGallery()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    
    if (session?.user) {
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
        setIsAdmin(admin)
      }
    }
  }

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_meta')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch gallery')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAdmin) {
      toast.error('Only admins can upload to gallery')
      return
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName)

      // Save metadata
      const { error: metaError } = await supabase
        .from('gallery_meta')
        .insert({
          file_url: urlData.publicUrl,
          file_type: file.type.startsWith('video/') ? 'video' : 'image',
          caption: '',
          event_date: new Date().toISOString().split('T')[0],
        })

      if (metaError) throw metaError

      toast.success('Uploaded successfully')
      fetchGallery()
      setShowUpload(false)
    } catch (error: any) {
      toast.error('Failed to upload: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading gallery...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-saffron">Gallery</h1>
        {isAdmin && (
          <div>
            <input
              type="file"
              id="gallery-upload"
              accept="image/*,video/*"
              onChange={handleUpload}
              className="hidden"
            />
            <label
              htmlFor="gallery-upload"
              className="bg-saffron text-white px-6 py-3 rounded-lg hover:bg-orange-600 cursor-pointer inline-block"
            >
              Upload Media
            </label>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No gallery items yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.file_type === 'image' ? (
                <Image
                  src={item.file_url}
                  alt={item.caption || 'Gallery image'}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <video
                  src={item.file_url}
                  controls
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4">
                {item.caption && (
                  <p className="text-gray-800 mb-2">{item.caption}</p>
                )}
                <p className="text-sm text-gray-600">
                  {format(new Date(item.event_date), 'PPP')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


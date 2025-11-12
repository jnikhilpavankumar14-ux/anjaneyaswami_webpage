'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      checkAdminStatus(session.user)
    }
  }

  const checkAdminStatus = async (user: any) => {
    const email = user.email
    const phone = user.phone
    
    const response = await fetch('/api/check-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    })
    
    if (response.ok) {
      const { isAdmin: admin } = await response.json()
      setIsAdmin(admin)
    }
  }, [])

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [checkUser])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/donate', label: 'Donate' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ]

  if (user) {
    navLinks.push({ href: '/dashboard', label: 'Dashboard' })
  }

  if (isAdmin) {
    navLinks.push({ href: '/admin', label: 'Admin' })
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-saffron">
            Sri Abhayanjaneya Swamy Temple
          </Link>
          
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'text-saffron font-semibold'
                    : 'text-gray-700 hover:text-saffron'
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-saffron text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


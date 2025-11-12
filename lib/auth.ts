import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getAuthenticatedUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (!error && user) {
      return user
    }
  }

  // Try to get session from cookies (Supabase stores session in cookies)
  // Create a client that can read cookies from the request
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  
  // Create supabase client with cookie access
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // In API routes, we can't set cookies directly
      },
      remove(name: string, options: any) {
        // In API routes, we can't remove cookies directly
      },
    },
  })

  const { data: { user }, error } = await supabase.auth.getUser()
  if (!error && user) {
    return user
  }

  return null
}


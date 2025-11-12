import { createServerClient } from './supabase'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sriabhayanjaneyaswamytemplegpl@gmail.com'
const ADMIN_PHONE = process.env.ADMIN_PHONE || '8885209456'

export async function isAdminUser(email?: string, phone?: string): Promise<boolean> {
  if (!email && !phone) return false

  const supabase = createServerClient()
  
  // Check if email matches admin email
  if (email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true
  }

  // Check if phone matches admin phone
  if (phone && phone.replace(/\D/g, '') === ADMIN_PHONE.replace(/\D/g, '')) {
    return true
  }

  // Check in admins table
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .or(`email.eq.${email},phone.eq.${phone}`)
    .single()

  return !error && !!data
}

export async function addAdmin(email: string, phone: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('admins')
    .insert({
      email: email.toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      role: 'admin',
      created_at: new Date().toISOString(),
    })

  return { data, error }
}

export async function updateAdmin(id: string, email?: string, phone?: string) {
  const supabase = createServerClient()
  
  const updates: any = {}
  if (email) updates.email = email.toLowerCase()
  if (phone) updates.phone = phone.replace(/\D/g, '')

  const { data, error } = await supabase
    .from('admins')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function updateTempleContact(email?: string, phone?: string) {
  // This would update environment variables or a config table
  // For now, we'll use a settings table
  const supabase = createServerClient()
  
  const updates: any = {}
  if (email) updates.temple_email = email
  if (phone) updates.temple_phone = phone

  const { data, error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...updates }, { onConflict: 'id' })
    .select()
    .single()

  return { data, error }
}


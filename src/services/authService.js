import { supabase } from './supabaseClient'

/**
 * Log in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@supabase/supabase-js').AuthResponse>}
 */
export async function login(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError) throw authError

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  // PGRST116 = row not found — new user with no profile yet, treat as parent
  if (profileError && profileError.code !== 'PGRST116') throw profileError

  const profile = profileData ?? { role: 'parent', is_active: true }

  // Soft ban check
  if (profile.is_active === false) {
    await supabase.auth.signOut()
    throw new Error('Your account has been deactivated. Please contact an administrator.')
  }

  return { user: authData.user, profile }
}

/**
 * Toggle a user's active status. Only available to super_admins.
 * @param {string} userId
 * @param {boolean} isActive
 */
export async function toggleUserStatus(userId, isActive) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId)
    .select()
    .single()
    
  if (error) throw error
  return data
}

/**
 * Log out the current user.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get the currently authenticated user.
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data?.user ?? null
}

/**
 * Fetch all user profiles from the database.
 */
export async function getAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

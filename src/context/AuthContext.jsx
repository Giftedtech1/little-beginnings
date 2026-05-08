import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase isn't configured, skip auth entirely — the public site still works
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch the role separately when the user changes to prevent Supabase lock collisions
  useEffect(() => {
    if (user?.id) {
      supabase.from('profiles').select('role').eq('id', user.id).single().then(({ data }) => {
        setRole(data?.role || 'parent')
      })
    } else {
      setRole(null)
    }
  }, [user?.id])

  return (
    <AuthContext.Provider value={{ user, role, loading, supabaseReady: Boolean(supabase) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

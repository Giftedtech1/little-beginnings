import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, AlertTriangle, ArrowRight } from 'lucide-react'
import { login } from '../services/authService'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/new logo.png'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const { role: contextRole } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const toast = useToast()

  // Detect if someone is already logged in
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setCurrentSession(session.user)
    })
  }, [])

  const getDashboardPath = (role) => {
    const adminRoles = ['admin', 'super_admin', 'admin_2', 'admin_3']
    if (adminRoles.includes(role)) return '/portal/admin'
    if (role === 'staff') return '/portal/teacher'
    return '/portal/my-child'
  }

  const handleGoToDashboard = () => {
    // Use the role from AuthContext (fetched from profiles table) for accuracy
    navigate(getDashboardPath(contextRole || 'parent'))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form.email, form.password)

      if (data?.user?.user_metadata?.is_temp_password) {
        navigate('/portal/update-password')
        return
      }

      const role = data?.profile?.role || 'parent'
      navigate(getDashboardPath(role))
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src={logo} alt="Little Beginnings Logo" className="h-16 md:h-20 object-contain" />
        </div>

        {/* Already logged in banner */}
        {currentSession && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800">Already signed in</p>
                <p className="text-xs text-amber-700 mt-0.5 truncate">
                  Logged in as <span className="font-semibold">{currentSession.email}</span>
                </p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <button
                    onClick={handleGoToDashboard}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Go to my dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-amber-600">or sign in below to switch accounts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-card p-8">
          <h1 className="font-display font-extrabold text-2xl text-dark mb-1">
            {currentSession ? 'Switch Account' : 'Portal Login'}
          </h1>
          <p className="text-muted text-sm mb-7">
            {currentSession
              ? 'Enter different credentials to log in as another user.'
              : 'Sign in to access the school portal.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-dark mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-dark mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : currentSession ? 'Switch Account' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          &copy; {new Date().getFullYear()} Little Beginnings Learning Center
        </p>
      </div>
    </div>
  )
}

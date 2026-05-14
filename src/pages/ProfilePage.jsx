import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/authService'
import { useToast } from '../context/ToastContext'
import { User, LogOut, KeyRound, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const REQUIREMENTS = [
  { id: 'length',    label: 'At least 8 characters',       test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)',   test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter (a–z)',   test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number (0–9)',             test: (p) => /[0-9]/.test(p) },
  { id: 'symbol',    label: 'One symbol (!@#$%^&*...)',     test: (p) => /[^A-Za-z0-9]/.test(p) },
]

function getStrength(password) {
  return REQUIREMENTS.filter(r => r.test(password)).length
}

function StrengthBar({ strength }) {
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  const colors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-green-500']

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {REQUIREMENTS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      {strength > 0 && (
        <p className={`text-xs font-semibold ${colors[strength].replace('bg-', 'text-')}`}>
          {labels[strength]}
        </p>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const strength = getStrength(password)
  const allMet = strength === REQUIREMENTS.length
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        navigate('/portal/login')
        return
      }
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (error) throw error
        setProfile(data)
      } catch (err) {
        toast.error("Failed to load profile details.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, navigate, toast])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/portal/login')
    } catch (err) {
      toast.error("Failed to log out.")
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (!allMet) return toast.error('Please meet all password requirements.')
    if (!passwordsMatch) return toast.error('Passwords do not match.')

    setIsSubmitting(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      toast.success("Password updated successfully!")
      setPassword('')
      setConfirmPassword('')
      setIsChangingPassword(false)
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDashboardPath = () => {
    const adminRoles = ['admin', 'super_admin', 'admin_2', 'admin_3']
    if (adminRoles.includes(role)) return '/portal/admin'
    if (role === 'staff') return '/portal/teacher'
    return '/portal/my-child'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-10 flex flex-col items-center force-light">
      <div className="w-full max-w-xl">
        <button 
          onClick={() => navigate(getDashboardPath())}
          className="flex items-center gap-2 text-sm font-bold text-muted hover:text-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Main Premium Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-card overflow-hidden border border-primary/5">
          {/* Header Banner */}
          <div className="h-32 bg-gray-50 border-b border-gray-100"></div>
          
          <div className="px-8 pb-8 relative">
            {/* Profile Info Header */}
            <div className="mt-8 mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
               <div>
                 <h2 className="font-display font-extrabold text-3xl text-dark tracking-tight">
                   {profile?.first_name} {profile?.last_name}
                 </h2>
                 <p className="font-medium text-muted mt-1 text-sm">{profile?.email || user?.email}</p>
               </div>
               <div className="flex flex-col sm:items-end gap-2">
                 <span className="inline-flex items-center justify-center text-xs font-bold uppercase tracking-widest bg-accent/10 text-accent px-4 py-2 rounded-xl">
                   {role}
                 </span>
                 {profile?.staff_id && (
                   <span className="inline-flex items-center justify-center font-mono text-xs font-bold tracking-widest bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg">
                     {profile.staff_id}
                   </span>
                 )}
               </div>
            </div>

            {/* Action Sections */}
            <div className="space-y-4">
              
              {/* Expandable Password Section */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden transition-colors hover:bg-gray-50/80">
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="w-full py-4 px-5 flex items-center justify-between text-left outline-none"
                >
                  <div className="flex items-center gap-3 font-bold text-dark">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-accent">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    Security &amp; Password
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted transition-transform duration-300 ${isChangingPassword ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isChangingPassword && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-2 border-t border-gray-200/60">
                        <p className="text-muted text-sm mb-5">Update your password to keep your account secure.</p>
                        
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                          <div>
                            <label className="block text-sm font-bold text-dark mb-1.5">New Password</label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 pr-10 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 bg-white outline-none transition-all"
                                placeholder="••••••••"
                              />
                              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {password.length > 0 && <StrengthBar strength={strength} />}
                            {password.length > 0 && (
                              <ul className="mt-3 space-y-1">
                                {REQUIREMENTS.map(req => {
                                  const met = req.test(password)
                                  return (
                                    <li key={req.id} className={`flex items-center gap-2 text-xs font-medium transition-colors ${met ? 'text-green-600' : 'text-gray-400'}`}>
                                      {met ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 flex-shrink-0" />}
                                      {req.label}
                                    </li>
                                  )
                                })}
                              </ul>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-dark mb-1.5">Confirm New Password</label>
                            <div className="relative">
                              <input
                                type={showConfirm ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full px-4 py-3.5 pr-10 rounded-xl border bg-white outline-none transition-all focus:ring-2 ${confirmPassword.length > 0 ? passwordsMatch ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20' : 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-gray-200 focus:border-accent focus:ring-accent/20'}`}
                                placeholder="••••••••"
                              />
                              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {confirmPassword.length > 0 && !passwordsMatch && (
                              <p className="text-xs text-red-500 mt-1.5 font-medium">Passwords do not match.</p>
                            )}
                          </div>

                          <div className="flex justify-end pt-2">
                            <button type="submit" disabled={isSubmitting || !allMet || !passwordsMatch} className="btn-primary py-3 px-6 disabled:opacity-50">
                              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save New Password'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 px-5 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-8 border border-red-100"
              >
                <LogOut className="w-5 h-5" /> Sign Out Securely
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

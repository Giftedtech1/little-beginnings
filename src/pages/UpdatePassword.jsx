import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { KeyRound, Loader2, CheckCircle, Eye, EyeOff, X } from 'lucide-react'

// Password requirements
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
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength] : 'bg-gray-200'}`}
          />
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

export default function UpdatePassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  const strength = getStrength(password)
  const allMet = strength === REQUIREMENTS.length
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  useEffect(() => {
    // User arrives here via an in-app redirect after logging in with a temporary password.
    // Verify they have an active session before allowing them to update their password.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Your session has expired. Please log in again to continue.')
        setSessionError(true)
      }
    }
    checkSession()
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')

    if (!allMet) {
      return setError('Please meet all password requirements before saving.')
    }
    if (!passwordsMatch) {
      return setError('Passwords do not match.')
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { is_temp_password: false }
      })
      if (updateError) throw updateError

      setSuccess(true)

      // Sign out and redirect to login so they use their new password
      setTimeout(() => {
        supabase.auth.signOut().then(() => {
          navigate('/portal/login')
        })
      }, 3000)

    } catch (err) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-accent/10 p-4 rounded-full">
            <KeyRound className="w-8 h-8 text-accent" />
          </div>
        </div>

        <h1 className="font-display font-extrabold text-2xl text-dark text-center mb-2">
          Set Your Password
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          Choose a strong, permanent password for your account.
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> Password Updated!
            </div>
            <p className="text-muted text-sm">Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-dark mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && <StrengthBar strength={strength} />}

              {/* Requirements checklist */}
              {password.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {REQUIREMENTS.map(req => {
                    const met = req.test(password)
                    return (
                      <li key={req.id} className={`flex items-center gap-2 text-xs font-medium transition-colors ${met ? 'text-green-600' : 'text-gray-400'}`}>
                        {met
                          ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          : <X className="w-3.5 h-3.5 flex-shrink-0" />
                        }
                        {req.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-dark mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-colors focus:ring-1
                    ${confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                        : 'border-red-400 focus:border-red-400 focus:ring-red-400'
                      : 'border-gray-200 focus:border-accent focus:ring-accent'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match.</p>
              )}
              {confirmPassword.length > 0 && passwordsMatch && (
                <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || sessionError || !allMet || !passwordsMatch}
              className="w-full btn-primary justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

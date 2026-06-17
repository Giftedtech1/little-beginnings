import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Wraps any route that requires authentication.
 * - Shows a loading spinner while auth state is resolving
 * - Redirects to /portal/login if not logged in
 * - Optionally restricts to specific roles (pass allowedRoles prop)
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth()

  // Wait for Supabase to resolve auth session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/portal/login" replace />
  }

  // Logged in but wrong role → redirect to login with message
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/portal/login" replace />
  }

  return children
}

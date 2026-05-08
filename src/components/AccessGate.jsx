import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { verifyAccessCode } from '../services/assessmentService'
import { Link } from 'react-router-dom'
import logo from '../assets/new logo.png'

export default function AccessGate({ children }) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const validCode = code.trim().toUpperCase()
      const data = await verifyAccessCode(validCode)
      sessionStorage.setItem('lb_access_code', validCode)
      setIsUnlocked(true)
    } catch (err) {
      setError(err.message || 'Invalid or expired Access Code.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isUnlocked) {
    return (
      <>
        {/* We can pass the used code down to the children if needed */}
        <div className="bg-green-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest font-sans flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Secure Session Unlocked
        </div>
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-brand selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-brand transform -skew-y-6 origin-top-left -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-md w-full shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="p-8 sm:p-10 text-center">
          <Link to="/">
            <img src={logo} alt="Little Beginnings" className="h-16 mx-auto mb-8 hover:scale-105 transition-transform" />
          </Link>

          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="font-display font-extrabold text-2xl text-dark mb-3">Restricted Access</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Please enter the unique Access Code provided by the Head of School to proceed with your application and pre-assessment.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. LB-A7X9"
                className="w-full text-center text-2xl font-bold tracking-widest bg-gray-50 border-2 border-gray-200 focus:border-brand focus:ring-0 rounded-xl py-4 outline-none transition-colors uppercase"
                required
              />
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-semibold mt-3">
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold disabled:opacity-70"
            >
              {isLoading ? (
                'Verifying...'
              ) : (
                <>Unlock Application <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 p-6 text-center">
          <p className="text-xs text-gray-500">
            Don't have an access code? <br />
            <Link to="/#contact" className="text-brand font-bold hover:underline mt-1 inline-block">Contact Administration</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

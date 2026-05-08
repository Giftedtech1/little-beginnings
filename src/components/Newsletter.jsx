import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import WaveDivider from './WaveDivider'
import { supabase } from '../services/supabaseClient'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    
    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])

      // 23505 is the Postgres error code for unique violation (already subscribed)
      if (insertError && insertError.code !== '23505') {
        throw insertError
      }

      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 6000)
    } catch (err) {
      console.error('Newsletter error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <WaveDivider color="#14B0B0" variant="zigzag" height="sm" flip className="block" />
      <section className="py-16 bg-teal-solid min-h-screen flex flex-col justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* Mail icon circle */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.20)' }}
            >
              <Mail className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-3">
              Stay in the Loop with{' '}
              <span style={{ color: '#FFD166' }}>Little Beginnings</span>
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Get parenting tips, therapy insights, and center updates delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-3 bg-white/15 border border-white/30 text-white rounded-2xl px-6 py-4">
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#FFD166' }} />
                <span className="font-semibold text-sm">You're subscribed! Welcome to the Little Beginnings community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="Enter your email address"
                    className={`w-full px-5 py-3.5 rounded-full border-2 text-sm outline-none bg-white text-dark transition-all
                      focus:ring-2 focus:ring-white/40 focus:border-white
                      ${error ? 'border-red-300' : 'border-white/40'}`}
                  />
                  {error && <p className="text-white/80 text-xs mt-1 text-left pl-4">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 inline-flex items-center gap-2 font-semibold font-display px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#FFD166', color: '#0D2B2B' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
            <p className="text-white/50 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
      <WaveDivider color="#ffffff" variant="bumps" height="sm" className="block" />
    </>
  )
}

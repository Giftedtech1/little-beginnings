import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, HeartPulse, Clock, Sparkles } from 'lucide-react'
import logo from '../assets/new logo.png'

export default function TheraHub() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-sans"
      style={{ background: 'linear-gradient(135deg, #0a1f3d 0%, #0f2d52 50%, #071828 100%)' }}>

      {/* Decorative background circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #FCD34D, transparent)' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-2xl w-full text-center">

        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10 flex justify-start">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.img
          src={logo}
          alt="Little Beginnings"
          className="h-14 mx-auto mb-10 opacity-90"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <HeartPulse className="w-12 h-12" style={{ color: '#FCD34D' }} />
        </motion.div>

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <Clock className="w-3.5 h-3.5" /> In Progress
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight"
        >
          Little Beginnings<br />
          <span style={{ color: '#FCD34D' }}>TheraHub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          A dedicated therapeutic hub bringing together speech therapists, occupational therapists, psychologists, and SEN specialists under one roof — providing holistic, multidisciplinary care for children with diverse learning and developmental needs.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="max-w-sm mx-auto"
        >
          <div className="flex justify-between text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
            <span>Progress</span><span>Coming Soon</span>
          </div>
          <div className="h-2 rounded-full w-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
              className="h-2 rounded-full"
              style={{ background: 'linear-gradient(90deg, #F59E0B, #FCD34D)' }}
            />
          </div>
        </motion.div>

        {/* Sparkle footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-14 flex items-center justify-center gap-2 text-white/30 text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Little Beginnings Learning Centre · {new Date().getFullYear()}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>
      </div>
    </div>
  )
}

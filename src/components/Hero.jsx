import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import WaveDivider from './WaveDivider'
import heroImg1 from '../assets/hero img1.jpg'
import heroImg2 from '../assets/hero img2.jpg'
import heroImg3 from '../assets/hero img3.jpg'
import iconReading from '../assets/book icon.png'
import iconArtTherapy from '../assets/art therapy icon.png'
import iconMusic from '../assets/music icon.png'
import iconMotor from '../assets/motor skills icon.png'

const activities = [
  { img: iconReading, label: 'Reading' },
  { img: iconArtTherapy, label: 'Art Therapy' },
  { img: iconMusic, label: 'Music' },
  { img: iconMotor, label: 'Motor Skills' },
  { label: 'Drama' },
  { label: 'Swimming' },
  { label: 'Dancing' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
}

// Floating confetti shapes
const blobs = [
  // Triangle - Yellow
  { size: 'w-10 h-10', color: 'bg-[#FFD700]', top: '12%', left: '8%', delay: '0s', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }, className: 'rotate-12' },
  // Diamond - Red
  { size: 'w-6 h-6', color: 'bg-[#F44336]', top: '25%', left: '92%', delay: '0.4s', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }, className: '-rotate-12' },
  // Irregular Blob - Cyan
  { size: 'w-9 h-9', color: 'bg-[#00BCD4]', top: '60%', left: '5%', delay: '0.8s', style: { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }, className: '' },
  // Square - Purple
  { size: 'w-7 h-7', color: 'bg-[#9C27B0]', top: '75%', left: '88%', delay: '0.2s', style: { borderRadius: '8px' }, className: 'rotate-45' },
  // Pentagon - Orange
  { size: 'w-6 h-6', color: 'bg-[#FF5722]', top: '40%', left: '95%', delay: '1s', style: { clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }, className: 'rotate-12' },

  // Circle - Green
  { size: 'w-12 h-12', color: 'bg-[#4CAF50]', top: '18%', left: '45%', delay: '0.3s', style: { borderRadius: '50%' }, className: '' },
  // Triangle - Pink
  { size: 'w-8 h-8', color: 'bg-[#E91E63]', top: '82%', left: '15%', delay: '1.2s', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }, className: '-rotate-12' },
  // Irregular Blob - Blue
  { size: 'w-10 h-10', color: 'bg-[#2196F3]', top: '30%', left: '25%', delay: '0.6s', style: { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }, className: 'rotate-45' },
  // Diamond - Amber
  { size: 'w-5 h-5', color: 'bg-[#FF9800]', top: '55%', left: '40%', delay: '0.9s', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }, className: '' },
  // Square - Light Green
  { size: 'w-8 h-8', color: 'bg-[#8BC34A]', top: '68%', left: '70%', delay: '0.5s', style: { borderRadius: '6px' }, className: '-rotate-6' },

  // Pentagon - Bright Yellow
  { size: 'w-5 h-5', color: 'bg-[#FFEB3B]', top: '15%', left: '75%', delay: '1.1s', style: { clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }, className: '-rotate-12' },
  // Irregular Blob - Red
  { size: 'w-10 h-10', color: 'bg-[#F44336]', top: '88%', left: '55%', delay: '0.7s', style: { borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }, className: '' },
  // Circle - Deep Purple
  { size: 'w-5 h-5', color: 'bg-[#673AB7]', top: '45%', left: '82%', delay: '0.1s', style: { borderRadius: '50%' }, className: '' },
  // Triangle - Teal
  { size: 'w-7 h-7', color: 'bg-[#009688]', top: '35%', left: '12%', delay: '1.5s', style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }, className: 'rotate-[30deg]' },
  // Square - Amber/Yellow
  { size: 'w-9 h-9', color: 'bg-[#FFC107]', top: '75%', left: '35%', delay: '1.3s', style: { borderRadius: '12px' }, className: 'rotate-[15deg]' },
  // Diamond - Pink
  { size: 'w-6 h-6', color: 'bg-[#E91E63]', top: '22%', left: '60%', delay: '0.8s', style: { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }, className: 'rotate-[-15deg]' },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-teal-pale flex items-center pt-16 md:pt-20 overflow-hidden"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #19C9C9 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          opacity: 0.18,
        }}
      />

      {/* Floating confetti shapes */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute ${b.size} ${b.color} opacity-80 pointer-events-none ${b.className}`}
          style={{ top: b.top, left: b.left, ...b.style }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: parseFloat(b.delay) }}
        />
      ))}

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center py-10 lg:py-24">
          {/* Left: text */}
          <div>
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-primary/20 dark:border-slate-700 mb-5">
                <span className="text-[10px] md:text-sm font-bold text-dark dark:text-white tracking-wide uppercase">
                  Special Education &amp; Learning Support
                </span>
              </div>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <span className="flex flex-wrap items-baseline gap-x-2 text-2xl md:text-3xl text-primary dark:text-primary-light mb-2 font-extrabold tracking-tight">
                <span>Welcome to</span>
                <span className="font-floral font-bold tracking-normal text-[1.5em] md:text-[1.6em] text-dark dark:text-white relative top-1" style={{ textShadow: '0.5px 0 0 currentColor' }}>
                  Little Beginnings
                </span>
              </span>
              <span className="text-dark dark:text-white">Where Kids Become{' '}</span>
              <span className="text-brand">Confident Learners</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-5 text-muted text-lg leading-relaxed max-w-lg"
            >
              Little Beginnings is a specialized learning center dedicated to nurturing every child's
              unique potential — through evidence-based therapy, compassionate care, and joyful learning.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/admissions"
                className="btn-primary"
              >
                Apply for Admission <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#services"
                className="btn-outline"
              >
                Our Services
              </motion.a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-8"
            >
              {[
                { value: '500+', label: 'Children Helped' },
                { value: '15+', label: 'Expert Therapists' },
                { value: '98%', label: 'Parent Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold font-display text-primary dark:text-primary-light">{stat.value}</div>
                  <div className="text-sm text-muted dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Polygon Grid Image Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative h-[300px] sm:h-[400px] lg:h-[640px] xl:h-[720px] w-full"
          >
            {/* Main Left Polygon Image */}
            <div
              className="absolute top-0 left-0 w-[58%] h-[80%] z-10 overflow-hidden shadow-lg group"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)',
              }}
            >
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
              <img
                src={heroImg1}
                alt="Child learning"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Top Right Polygon Image */}
            <div
              className="absolute top-0 right-0 w-[45%] h-[52%] z-20 overflow-hidden shadow-lg group"
              style={{
                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 85%)',
              }}
            >
              <div className="absolute inset-0 bg-accent/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
              <img
                src={heroImg2}
                alt="Kids activities"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Bottom Right Polygon Image */}
            <div
              className="absolute bottom-[2%] right-[5%] w-[68%] h-[48%] z-30 overflow-hidden shadow-lg group border-4 border-white"
              style={{
                clipPath: 'polygon(12% 18%, 100% 0, 100% 100%, 0 100%)',
              }}
            >
              <div className="absolute inset-0 bg-coral/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
              <img
                src={heroImg3}
                alt="Speech therapy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Floating badge */}
            <div className="hidden sm:flex absolute bottom-6 left-[-2%] z-40 bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none px-4 py-2.5 items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center dark:!bg-slate-700" style={{ backgroundColor: '#E0FAFA' }}>
                <BookOpen className="w-5 h-5 text-primary dark:text-white" />
              </div>
              <div>
                <div className="font-extrabold font-display text-dark dark:text-white text-sm">Tailored Learning</div>
                <div className="text-xs text-muted dark:text-gray-400">Every child is unique</div>
              </div>
            </div>

            {/* Secondary floating card */}
            <div className="hidden sm:block absolute top-[-5%] right-[-2%] z-40 bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none px-4 py-3">
              <div className="text-primary dark:text-white font-extrabold font-display text-2xl">A+</div>
              <div className="text-xs text-muted dark:text-gray-400 font-medium">Learning Outcomes</div>
            </div>
          </motion.div>
        </div>

        {/* Our Activities strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {activities.map(({ img, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-full shadow-soft border border-primary/10 dark:border-slate-700 text-sm font-semibold text-dark/80 dark:text-gray-200 cursor-pointer"
              >
                {img && <img src={img} alt={label} className="w-5 h-5 object-contain" />}
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <WaveDivider color="#ffffff" variant="scallop" height="lg" className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}

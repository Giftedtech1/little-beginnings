import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Users, Star, Lightbulb, ArrowRight } from 'lucide-react'
import WaveDivider from './WaveDivider'
import aboutImg from '../assets/about us.jpg'

const pillars = [
  { icon: Heart,     label: 'Compassionate Care', bg: '#FFB3B3', color: '#CC3333' },
  { icon: Users,     label: 'Family-Centered',     bg: '#e6f6fb', color: '#016a91' },
  { icon: Star,      label: 'Expert-Led',          bg: '#FFD166', color: '#8B6914' },
  { icon: Lightbulb, label: 'Innovation',          bg: '#e6f6fb', color: '#0192c6' },
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-teal-pale min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: infographic image with orbiting icons */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative flex flex-col items-center"
          >
            {/* Center image */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-card-hover border-4 border-white">
              <img
                src={aboutImg}
                alt="Little Beginnings — About Us"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mobile: 2×2 grid of pillars below the image */}
            <div className="grid grid-cols-2 gap-3 mt-6 w-full md:hidden">
              {pillars.map((p) => (
                <motion.div
                  key={p.label}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none px-4 py-3 flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 dark:!bg-slate-700"
                    style={{ backgroundColor: p.bg }}
                  >
                    <p.icon className="w-4 h-4 dark:!text-white" style={{ color: p.color }} />
                  </div>
                  <span className="text-xs font-bold font-display text-dark dark:text-white leading-tight">{p.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Desktop: orbiting corner cards (hidden on mobile) */}
            <div className="hidden md:block absolute inset-0">
              {pillars.map((p, i) => {
                const positions = ['-top-6 left-0', '-top-6 right-0', '-bottom-6 left-0', '-bottom-6 right-0']
                return (
                  <motion.div
                    key={p.label}
                    whileHover={{ scale: 1.07, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className={`absolute ${positions[i]} bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-card dark:shadow-none px-4 py-3 flex items-center gap-2 max-w-[155px] cursor-pointer`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 dark:!bg-slate-700"
                      style={{ backgroundColor: p.bg }}
                    >
                      <p.icon className="w-4 h-4 dark:!text-white" style={{ color: p.color }} />
                    </div>
                    <span className="text-xs font-bold font-display text-dark dark:text-white leading-tight">{p.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <h2 className="section-title mb-5">
              About <span className="text-brand">Us</span>
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              At Little Beginnings, we believe every child has the capacity to learn, grow, and thrive.
              Our multidisciplinary team of certified specialists creates personalized learning plans
              that address each child's unique challenges and celebrate their strengths.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              We integrate communication and language therapy, occupational therapy, reading support, and academic coaching
              in a calm, stimulating environment where children feel safe to explore and grow at their own pace.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { value: '12+',  label: 'Years of Experience',   bg: '#e6f6fb', val: '#0192c6' },
                { value: '500+', label: 'Success Stories',       bg: '#FFD166', val: '#8B6914' },
                { value: '15+',  label: 'Specialist Therapists', bg: '#FFB3B3', val: '#CC3333' },
                { value: '4',    label: 'Learning Programs',     bg: '#e6f6fb', val: '#016a91' },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl p-4 shadow-soft dark:shadow-none">
                  <div
                    className="text-2xl font-extrabold font-display dark:!text-white"
                    style={{ color: s.val }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-muted dark:text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-primary inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded-xl shadow-md hover:bg-brand-dark transition-all mt-4">
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
      <WaveDivider color="#ffffff" variant="wave" height="md" className="mt-16" />
    </section>
  )
}

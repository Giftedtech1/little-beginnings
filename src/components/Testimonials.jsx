import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import WaveDivider from './WaveDivider'

const testimonials = [
  {
    id:     1,
    name:   'Mrs. Ngozi Bello',
    text:   "Little Beginnings changed our lives. Within three months, my son was reading full sentences. The therapists are patient, caring, and truly gifted at what they do.",
    bg:     '#E0FAFA',
    quote:  '#14B0B0',
  },
  {
    id:     2,
    name:   'Mr. Tunde Okoye',
    text:   "We had tried several places before Little Beginnings. The difference was night and day — the personalized approach and the warmth of the team made my daughter feel safe and confident.",
    bg:     '#FFF8E1',
    quote:  '#E6B840',
  },
  {
    id:     3,
    name:   'Mrs. Fatima Al-Hassan',
    text:   "My child went from refusing to write to actually enjoying journaling. The occupational therapy program here is exceptional. We're forever grateful.",
    bg:     '#FFE8E8',
    quote:  '#FF6B6B',
  },
  {
    id:     4,
    name:   'Dr. Chike Emeka',
    text:   "As a pediatrician, I refer families here with confidence. The evidence-based approach, professional staff, and genuine results speak for themselves.",
    bg:     '#F0FEFE',
    quote:  '#19C9C9',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-teal-pale relative min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="section-title">
            Testimonials
          </h2>
          <p className="section-subtitle">
            Real stories from real families whose children have grown and thrived with us.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '150px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-3xl p-6 cursor-pointer dark:!bg-slate-800 dark:border dark:border-slate-700"
              style={{ backgroundColor: t.bg }}
            >
              <Quote className="w-8 h-8 mb-4 opacity-70" style={{ color: t.quote }} />
              <p className="text-dark/80 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-soft"
                  style={{ backgroundColor: t.quote }}
                >
                  <span className="font-extrabold font-display text-sm text-white">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold font-display text-dark dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-muted dark:text-gray-400">Parent</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <WaveDivider color="#ffffff" variant="splash" height="md" className="mt-16 dark:hidden" />
      <WaveDivider color="#061D1D" variant="splash" height="md" className="mt-16 hidden dark:block" />
    </section>
  )
}

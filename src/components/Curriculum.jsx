import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, MessageSquare, Puzzle, Activity, Users, BookOpen } from 'lucide-react'
import { t } from '../utils/i18n'

const highlights = [
  { icon: Brain,         color: '#6366F1', bg: '#EEF2FF', label: 'Behavioral Intervention' },
  { icon: MessageSquare, color: '#0192c6', bg: '#e6f6fb', label: 'Communication and Language' },
  { icon: Puzzle,        color: '#F59E0B', bg: '#FEF3C7', label: 'Occupational Therapy' },
  { icon: Activity,      color: '#EF4444', bg: '#FEE2E2', label: 'Physical Therapy' },
  { icon: Users,         color: '#8B5CF6', bg: '#EDE9FE', label: 'Social Skills Training' },
  { icon: BookOpen,      color: '#0EA5E9', bg: '#E0F2FE', label: 'Academy Support' },
]

export default function Programs() {
  return (
    <section id="curriculum" className="bg-gray-50/60 dark:bg-slate-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">{t('ourPrograms')}</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark dark:text-white leading-tight">
              Evidence-based<br />
              <span className="text-brand">{t('interventions')}</span>
            </h2>
            <p className="mt-3 text-muted text-sm max-w-md">
              {t('curriculumSub')}
            </p>
          </div>
        </motion.div>

        {/* Two columns — brief previews */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-l-4 border-brand pl-6 py-2"
          >
            <h3 className="font-display font-bold text-base text-dark dark:text-white mb-1">{t('therapeuticPrograms')}</h3>
            <p className="text-sm text-muted">
              {t('therapeuticSub')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-l-4 border-amber-400 pl-6 py-2"
          >
            <h3 className="font-display font-bold text-base text-dark dark:text-white mb-1">{t('holisticSupport')}</h3>
            <p className="text-sm text-muted">
              {t('holisticSub')}
            </p>
          </motion.div>
        </div>

        {/* Intervention pills */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="flex flex-wrap gap-3"
        >
          {highlights.map(({ icon: Icon, color, bg, label }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, scale: 0.88 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
              }}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-dark dark:text-white"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-3 h-3" style={{ color }} />
              </div>
              {label}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

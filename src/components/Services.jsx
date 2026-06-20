import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, BookOpen, Pencil, Calculator, ArrowRight, ClipboardList, Users } from 'lucide-react'
import WaveDivider from './WaveDivider'
import { t } from '../utils/i18n'

import imgSpeech from '../assets/speech therapy.jpg'
import imgReading from '../assets/reading support.jpg.jpg'
import imgOccupational from '../assets/occupational therapy.jpg.jpg'
import imgMath from '../assets/math and writing.jpg'
import imgAssessment from '../assets/assessment.webp'
import imgBehaviour from '../assets/behavioural-intervention.webp'

const services = [
  {
    id: 'speech',
    icon: Brain,
    title: 'Communication and Language Therapy',
    description:
      'Building communication confidence through expert speech and language interventions tailored to each child.',
    img: imgSpeech,
    featured: true,
    accentBg: '#e6f6fb',
    accentText: '#0192c6',
  },
  {
    id: 'reading',
    icon: BookOpen,
    title: 'Reading Support',
    description:
      'Specialized phonics, fluency, and comprehension programs that turn reluctant readers into confident ones.',
    img: imgReading,
    featured: true,
    accentBg: '#0192c6',
    accentText: '#ffffff',
  },
  {
    id: 'occupational',
    icon: Pencil,
    title: 'Occupational Therapy',
    description:
      'Developing fine motor skills, sensory processing, and daily-life independence for every child.',
    img: imgOccupational,
    featured: false,
    accentBg: '#FFF0BB',
    accentText: '#B8860B',
  },
  {
    id: 'math',
    icon: Calculator,
    title: 'Math & Literacy',
    description:
      'Structured literacy and numeracy programs that build strong foundational skills with hands-on learning.',
    img: imgMath,
    featured: false,
    accentBg: '#FFB3B3',
    accentText: '#CC3333',
  },
  {
    id: 'assessment',
    icon: ClipboardList,
    title: 'Assessment',
    description:
      'Comprehensive developmental and learning assessments to identify specific strengths, needs, and appropriate interventions.',
    img: imgAssessment,
    featured: true,
    accentBg: '#e6f6fb',
    accentText: '#0192c6',
  },
  {
    id: 'behaviour-intervention',
    icon: Users,
    title: 'Behaviour Intervention',
    description:
      'Applying the best practices of Applied Behaviour Analysis (ABA) to foster meaningful growth and independence.',
    img: imgBehaviour,
    featured: true,
    accentBg: '#EDE9FE',
    accentText: '#8B5CF6',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Services() {
  return (
    <section id="services" className="py-24 bg-teal-light min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="section-title">
            Our <span className="text-brand">{t('programs')}</span>
          </h2>
          <p className="section-subtitle">
            Evidence-based programs delivered by certified specialists in a warm, child-friendly environment.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '150px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative rounded-3xl overflow-hidden flex flex-col ${
                service.featured
                  ? 'text-white shadow-card-hover scale-[1.05]'
                  : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-card dark:shadow-none'
              }`}
              style={service.featured ? { backgroundColor: '#0192c6' } : undefined}
            >
              {service.featured && (
                <div
                  className="absolute top-4 right-4 text-dark text-xs font-bold px-3 py-1 rounded-full z-10"
                  style={{ backgroundColor: '#FFD166' }}
                >
                  Most Popular
                </div>
              )}
              <div className="h-44 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 dark:!bg-slate-700"
                  style={{ backgroundColor: service.featured ? 'rgba(255,255,255,0.20)' : service.accentBg }}
                >
                  <service.icon
                    className="w-5 h-5 dark:!text-white"
                    style={{ color: service.featured ? '#ffffff' : service.accentText }}
                  />
                </div>
                <h3
                  className="font-display font-extrabold text-lg mb-2 dark:!text-white"
                  style={{ color: service.featured ? '#ffffff' : '#0a1c2b' }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-1 dark:!text-gray-300"
                  style={{ color: service.featured ? 'rgba(255,255,255,0.82)' : '#4A7A7A' }}
                >
                  {service.description}
                </p>
                <Link
                  to={`/services/${service.id}`}
                  className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-colors dark:!text-white"
                  style={{ color: service.featured ? '#e6f6fb' : '#0192c6' }}
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <WaveDivider color="#F0FEFE" variant="bumps" height="md" className="mt-16 dark:hidden" />
      <WaveDivider color="#0f172a" variant="bumps" height="md" className="mt-16 hidden dark:block" />
    </section>
  )
}

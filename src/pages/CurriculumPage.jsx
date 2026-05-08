import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  Puzzle,
  Activity,
  Users,
  BookOpen,
  Heart,
  Stethoscope,
  Leaf,
  Sparkles,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const interventions = [
  {
    icon: Brain,
    color: '#6366F1',
    bg: '#EEF2FF',
    title: 'Behavioural Therapy',
    desc: 'Includes therapy approaches such as Applied Behaviour Analysis (ABA), Early Start Denver Model (ESDM) and Cognitive Behaviour Therapy (CBT).',
  },
  {
    icon: MessageSquare,
    color: '#14B0B0',
    bg: '#E0FAFA',
    title: 'Speech-Language Therapy',
    desc: 'Addresses verbal communication and social communication challenges, as well as understanding of nonverbal cues.',
  },
  {
    icon: Puzzle,
    color: '#F59E0B',
    bg: '#FEF3C7',
    title: 'Occupational Therapy',
    desc: 'Addresses sensory integration difficulties and independent living skills such as feeding, dressing, and more.',
  },
  {
    icon: Activity,
    color: '#EF4444',
    bg: '#FEE2E2',
    title: 'Physical Therapy',
    desc: 'Helps to improve movement, balance and coordination.',
  },
  {
    icon: Users,
    color: '#8B5CF6',
    bg: '#EDE9FE',
    title: 'Social Skills Training',
    desc: 'Strategies to help individuals learn to interact with peers and adults in natural environments.',
  },
  {
    icon: BookOpen,
    color: '#0EA5E9',
    bg: '#E0F2FE',
    title: 'Educational Strategies',
    desc: 'Structured classroom approaches to teach mainstream curriculum-based academics and functional academics.',
  },
  {
    icon: Heart,
    color: '#EC4899',
    bg: '#FCE7F3',
    title: 'Parent Training',
    desc: 'Aims to equip parents with skills to adequately support their children, and maintain a balanced mental health.',
  },
  {
    icon: Stethoscope,
    color: '#10B981',
    bg: '#D1FAE5',
    title: 'Medication Therapy',
    desc: 'While drugs do not currently cure core symptoms, evidence exists that certain medications help address behaviours such as aggression, irritability, hyperactivity, etc.',
  },
  {
    icon: Leaf,
    color: '#22C55E',
    bg: '#DCFCE7',
    title: 'Nutritional Therapy',
    desc: 'Dietary interventions and supplements tailored to support the unique needs of each child.',
  },
  {
    icon: Sparkles,
    color: '#F97316',
    bg: '#FFEDD5',
    title: 'Complementary Interventions',
    desc: 'Other interventions to support the care of children with special needs include music therapy, art therapy, and more.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export default function ProgramsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Our Programs</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-dark dark:text-white leading-tight max-w-3xl mb-6">
            Interventions That{' '}
            <span className="text-brand">Transform Lives</span>
          </h1>
          <div className="w-16 h-1 bg-brand rounded-full mb-6" />
          <p className="text-muted leading-relaxed max-w-2xl text-base sm:text-lg">
            At Little Beginnings Learning Center, we offer a comprehensive range of evidence-based 
            intervention programs tailored to the unique needs of each child. Our multidisciplinary 
            approach ensures every child receives the right support at the right time.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-dashed border-gray-200 dark:border-slate-700" />
      </div>

      {/* Interventions Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand bg-brand/10 px-3 py-1 rounded-full mb-4">
            10 Core Interventions
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-dark dark:text-white mb-3">
            A Holistic Care Framework
          </h2>
          <p className="text-muted max-w-xl text-sm sm:text-base leading-relaxed">
            Each program is designed and delivered by certified specialists committed to meaningful, 
            measurable outcomes for your child.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {interventions.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span
                  className="text-3xl font-extrabold leading-none mt-1 select-none font-display"
                  style={{ color, opacity: 0.25 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-dark dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-xs text-muted dark:text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-3xl text-center py-14 px-8"
          style={{ backgroundColor: '#14B0B0' }}
        >
          <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-widest">Get Started</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
            Ready to begin your child's journey?
          </h2>
          <p className="text-white/80 text-sm mb-8 max-w-md mx-auto">
            Our certified specialists are here to help. Schedule an assessment or apply for admission today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#14B0B0] font-bold px-8 py-3 rounded-full transition-all hover:bg-gray-100 shadow-md"
            >
              Apply for Admission
            </Link>
            <a
              href="/#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-white/30 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

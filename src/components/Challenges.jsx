import { motion } from 'framer-motion'
import { Puzzle, Zap, Activity, Smile, BookOpen, TrendingUp, Users, Brain, PlusCircle } from 'lucide-react'
import WaveDivider from './WaveDivider'

const challenges = [
  {
    id: 'autism',
    icon: Puzzle,
    title: 'Autism Spectrum Disorder',
    description: 'Tailored intervention programs to support communication, social interaction, and sensory processing differences.',
    bg:       '#EEF2FF',
    iconBg:   '#EDE9FE',
    iconColor:'#6366F1',
    border:   '#C7D2FE',
  },
  {
    id: 'adhd',
    icon: Zap,
    title: 'Attention Deficit Hyperactivity Disorder',
    description: 'Strategies to build focus, emotional regulation, and organizational skills through active guidance.',
    bg:       '#FFF8E1',
    iconBg:   '#FEF3C7',
    iconColor:'#D97706',
    border:   '#FDE68A',
  },
  {
    id: 'cerebral-palsy',
    icon: Activity,
    title: 'Cerebral Palsy',
    description: 'Support for motor control, physical coordination, and mobility using specialized adaptive techniques.',
    bg:       '#FFE8E8',
    iconBg:   '#FEE2E2',
    iconColor:'#EF4444',
    border:   '#FECACA',
  },
  {
    id: 'down-syndrome',
    icon: Smile,
    title: 'Down Syndrome',
    description: 'Holistic cognitive, speech, and developmental exercises to foster independence and learning confidence.',
    bg:       '#E8F8F5',
    iconBg:   '#D1F2EB',
    iconColor:'#0E9F6E',
    border:   '#A2E9DB',
  },
  {
    id: 'learning-disabilities',
    icon: BookOpen,
    title: 'Learning Disabilities',
    description: 'Academic interventions for dyslexia, dysgraphia, and dyscalculia to help children thrive in school.',
    bg:       '#e6f6fb',
    iconBg:   '#E0F2FE',
    iconColor:'#0284C7',
    border:   '#BAE6FD',
  },
  {
    id: 'global-delay',
    icon: TrendingUp,
    title: 'Global Developmental Delay',
    description: 'Comprehensive support to help kids reach physical, cognitive, communication, and social-emotional milestones.',
    bg:       '#F5F3FF',
    iconBg:   '#EDE9FE',
    iconColor:'#7C3AED',
    border:   '#DDD6FE',
  },
  {
    id: 'odd-cd',
    icon: Users,
    title: 'Oppositional Defiant / Conduct Disorder',
    description: 'Behavioral strategies and positive reinforcement programs focusing on emotional expression and cooperation.',
    bg:       '#FFF3E0',
    iconBg:   '#FFE0B2',
    iconColor:'#EA580C',
    border:   '#FED7AA',
  },
  {
    id: 'rare-conditions',
    icon: Brain,
    title: 'Rare Conditions',
    description: 'Customized therapeutic care plans tailored to rare conditions like lisencephaly, Angelman syndrome, muscular dystrophy, etc.',
    bg:       '#FDF2F8',
    iconBg:   '#FCE7F3',
    iconColor:'#DB2777',
    border:   '#FBCFE8',
  },
  {
    id: 'more',
    icon: PlusCircle,
    title: 'And more....',
    description: 'Contact us to see how our interdisciplinary team can design a plan tailored for your child’s unique needs.',
    bg:       '#F3F4F6',
    iconBg:   '#E5E7EB',
    iconColor:'#4B5563',
    border:   '#D1D5DB',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Challenges() {
  return (
    <section id="challenges" className="py-24 bg-white dark:bg-slate-900 min-h-screen flex flex-col justify-center transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="section-title">
            DEVELOPMENTAL CHALLENGES <span className="text-brand">WE ADDRESS</span>
          </h2>
          <p className="section-subtitle">
            Our specialists are trained to identify and address a wide range of learning difficulties
            with compassion and expertise.
          </p>
        </motion.div>

        {/* Challenge Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '150px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {challenges.map((ch) => (
            <motion.div
              key={ch.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="rounded-3xl p-6 cursor-pointer border-2 dark:!bg-slate-800 dark:!border-slate-700"
              style={{ backgroundColor: ch.bg, borderColor: ch.border }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 dark:!bg-slate-700"
                style={{ backgroundColor: ch.iconBg }}
              >
                <ch.icon className="w-7 h-7 dark:!text-white" style={{ color: ch.iconColor }} />
              </motion.div>
              <h3 className="font-display font-extrabold text-xl text-dark mb-2">{ch.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{ch.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <WaveDivider color="#F0FEFE" variant="peaks" height="md" className="mt-16 dark:hidden" />
      <WaveDivider color="#05131d" variant="peaks" height="md" className="mt-16 hidden dark:block" />
    </section>
  )
}

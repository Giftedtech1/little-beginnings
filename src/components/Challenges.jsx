import { motion } from 'framer-motion'
import { BookOpen, Pencil, Calculator, Type } from 'lucide-react'
import WaveDivider from './WaveDivider'

const challenges = [
  {
    id: 'reading',
    icon: BookOpen,
    title: 'Reading',
    description: 'Phonics, fluency, and comprehension strategies for children who struggle to decode text.',
    bg:       '#E0FAFA',
    iconBg:   '#AFFFFF',
    iconColor:'#0E9090',
    border:   '#19C9C9',
  },
  {
    id: 'writing',
    icon: Pencil,
    title: 'Writing',
    description: 'Sentence structure, spelling, and expressive writing support for reluctant writers.',
    bg:       '#FFF8E1',
    iconBg:   '#FFD166',
    iconColor:'#8B6914',
    border:   '#FFD166',
  },
  {
    id: 'math',
    icon: Calculator,
    title: 'Math',
    description: 'Number sense, operations, and problem-solving skills through hands-on, visual methods.',
    bg:       '#FFE8E8',
    iconBg:   '#FFB3B3',
    iconColor:'#CC3333',
    border:   '#FF6B6B',
  },
  {
    id: 'handwriting',
    icon: Type,
    title: 'Handwriting',
    description: 'Fine motor and grip support to develop neat, legible handwriting and pencil control.',
    bg:       '#F0FEFE',
    iconBg:   '#1CDBDB',
    iconColor:'#0D2B2B',
    border:   '#14B0B0',
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
            Learning Challenges <span className="text-brand">We Address</span>
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
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
      <WaveDivider color="#061D1D" variant="peaks" height="md" className="mt-16 hidden dark:block" />
    </section>
  )
}

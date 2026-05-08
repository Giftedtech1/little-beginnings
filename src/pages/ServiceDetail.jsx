import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Heart, Star, Target, Users, Sparkles, Brain, Ear, MessageCircle, BookOpen, Scroll, BookMarked, Pencil, Puzzle, Activity, Calculator, Ruler, BrainCircuit } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import imgSpeech from '../assets/speech therapy.jpg'
import imgReading from '../assets/reading support.jpg'
import imgOccupational from '../assets/occupational therapy.jpg'
import imgMath from '../assets/math and writing.jpg'

const servicesData = {
  speech: {
    title: 'Speech Therapy',
    subtitle: 'Building communication confidence',
    description: 'Our expert speech and language interventions are tailored to each child, helping them develop clear articulation, expressive language skills, and the confidence to share their voice with the world.',
    image: imgSpeech,
    accentBg: '#E0FAFA',
    accentText: '#14B0B0',
    colorClass: 'text-brand',
    bgClass: 'bg-brand/10',
    benefits: [
      { icon: MessageCircle, title: 'Expressive Language', text: 'Helping children articulate thoughts and construct meaningful sentences.' },
      { icon: Ear, title: 'Receptive Language', text: 'Improving the ability to understand and process verbal information.' },
      { icon: Brain, title: 'Cognitive Communication', text: 'Developing memory, problem solving, and executive functions.' },
      { icon: Users, title: 'Social Pragmatics', text: 'Learning the unwritten rules of conversation and social interaction.' }
    ],
    approach: [
      'Comprehensive initial assessment to identify specific speech and language needs.',
      'Individualized treatment plans with engaging, play-based therapy sessions.',
      'Collaboration with parents and teachers for consistent reinforcement.',
      'Regular progress monitoring to adjust goals and celebrate achievements.'
    ]
  },
  reading: {
    title: 'Reading Support',
    subtitle: 'Turning reluctant readers into confident ones',
    description: 'Our specialized phonics, fluency, and comprehension programs provide the targeted support children need to develop strong literacy skills and a lifelong love of reading.',
    image: imgReading,
    accentBg: '#E0FAFA',
    accentText: '#14B0B0',
    colorClass: 'text-brand',
    bgClass: 'bg-brand/10',
    benefits: [
      { icon: CheckCircle2, title: 'Phonemic Awareness', text: 'Mastering the sounds of language as the foundation for reading.' },
      { icon: BookOpen, title: 'Reading Fluency', text: 'Building speed, accuracy, and proper expression.' },
      { icon: Scroll, title: 'Comprehension Skills', text: 'Understanding and retaining information from texts.' },
      { icon: BookMarked, title: 'Vocabulary Expansion', text: 'Growing word knowledge to improve reading and writing.' }
    ],
    approach: [
      'Diagnostic assessments to pinpoint exact reading levels and challenges.',
      'Multisensory instruction techniques combining visual, auditory, and kinesthetic learning.',
      'Structured literacy programs based on the Science of Reading.',
      'Building confidence through achievable milestones and positive reinforcement.'
    ]
  },
  occupational: {
    title: 'Occupational Therapy',
    subtitle: 'Developing daily-life independence',
    description: 'We focus on developing fine motor skills, sensory processing, and the visual-motor integration necessary for children to successfully engage in school, play, and self-care activities.',
    image: imgOccupational,
    accentBg: '#FFF0BB',
    accentText: '#B8860B',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 dark:bg-amber-900/20',
    benefits: [
      { icon: Pencil, title: 'Fine Motor Skills', text: 'Improving hand strength and dexterity for writing and tool use.' },
      { icon: Activity, title: 'Sensory Processing', text: 'Helping children process and respond appropriately to sensory input.' },
      { icon: Puzzle, title: 'Visual-Motor Integration', text: 'Coordinating visual perception with physical movements.' },
      { icon: Heart, title: 'Self-Care Independence', text: 'Building skills for dressing, feeding, and daily routines.' }
    ],
    approach: [
      'Holistic evaluation of the child\'s physical, sensory, and cognitive abilities.',
      'Purposeful, activity-based interventions designed to feel like play.',
      'Sensory diet development for home and school environments.',
      'Adaptive equipment recommendations and training when necessary.'
    ]
  },
  math: {
    title: 'Math & Writing',
    subtitle: 'Building strong foundational skills',
    description: 'Our structured numeracy and literacy programs use hands-on learning to demystify complex concepts, building logical thinking, problem-solving skills, and effective written expression.',
    image: imgMath,
    accentBg: '#FFB3B3',
    accentText: '#CC3333',
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    benefits: [
      { icon: Calculator, title: 'Number Sense', text: 'Developing a deep understanding of numbers and their relationships.' },
      { icon: Target, title: 'Problem Solving', text: 'Learning strategies to tackle multi-step mathematical challenges.' },
      { icon: Sparkles, title: 'Creative Writing', text: 'Structuring thoughts to produce clear, engaging written work.' },
      { icon: BrainCircuit, title: 'Logical Reasoning', text: 'Building critical thinking skills applicable across all subjects.' }
    ],
    approach: [
      'Concrete-Pictorial-Abstract (CPA) approach for deep mathematical understanding.',
      'Explicit writing instruction covering grammar, structure, and style.',
      'Manipulatives and visual aids to make abstract concepts tangible.',
      'Progressive skill building, ensuring mastery before moving forward.'
    ]
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

export default function ServiceDetail() {
  const { serviceId } = useParams()
  const data = servicesData[serviceId]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [serviceId])

  if (!data) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${data.colorClass} ${data.bgClass}`}>
              {data.subtitle}
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-dark dark:text-white leading-tight mb-6">
              {data.title}
            </h1>
            <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: data.accentText }} />
            <p className="text-muted leading-relaxed text-base sm:text-lg mb-8">
              {data.description}
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-full transition-all shadow-md hover:scale-105"
              style={{ backgroundColor: data.accentText }}
            >
              Apply for Admission
            </Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square md:aspect-auto md:h-[500px]">
            <img 
              src={data.image} 
              alt={data.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-dashed border-gray-200 dark:border-slate-700" />
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-gray-50 dark:bg-slate-800/50 my-16 rounded-3xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl text-dark dark:text-white mb-4">
            Key Focus Areas
          </h2>
          <p className="text-muted">
            Our comprehensive approach targets the specific skills your child needs to thrive both academically and socially.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {data.benefits.map((benefit, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: data.bgClass.includes('brand') ? '#E0FAFA' : data.accentBg }}
              >
                <benefit.icon 
                  className="w-6 h-6" 
                  style={{ color: data.accentText }} 
                />
              </div>
              <h3 className="font-bold text-lg text-dark dark:text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{benefit.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Approach Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 md:order-1">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700">
              <ul className="space-y-6">
                {data.approach.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-dark dark:text-gray-200">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold text-sm"
                      style={{ backgroundColor: data.accentText }}
                    >
                      {i + 1}
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${data.colorClass} ${data.bgClass}`}>
              Methodology
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark dark:text-white mb-6">
              Our Approach to {data.title}
            </h2>
            <p className="text-muted leading-relaxed text-lg">
              We believe every child is unique, which is why we don't believe in one-size-fits-all solutions. 
              Our specialists work closely with your family to create a supportive, engaging, and effective learning path.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,100 100,0 L100,100 L0,100 Z" fill="currentColor" className="text-white" />
          </svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-6">
            Ready to Support Your Child's Growth?
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg">
            Schedule an assessment today and discover how our {data.title.toLowerCase()} programs can make a difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-dark font-bold px-8 py-3.5 rounded-full transition-transform hover:scale-105"
            >
              Start Application
            </Link>
            <Link
              to="/admissions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white border border-white/30 hover:bg-white/10 font-bold px-8 py-3.5 rounded-full transition-colors"
            >
              Admissions Info
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Quote } from 'lucide-react'
import WaveDivider from './WaveDivider'

const testimonials = [
  {
    id:     1,
    name:   'Wendelyn',
    text:   "Finding the right speech and occupational therapy practice for your child is about far more than qualifications, it is about finding people you can trust with your child's growth, confidence, and wellbeing. This clinic embodies exactly that.\n\nThe therapists are exceptionally professional, highly knowledgeable, and genuinely kind. They approach every child with remarkable empathy, treating each family's journey as though it were the only one that matters. Rather than applying a one-size-fits-all approach, they take the time to understand each child's unique strengths, challenges, and personality, creating an environment where children feel seen, valued, and encouraged to thrive.\n\nWhat truly sets this clinic apart is the heart behind its work. Every aspect of the care provided is underpinned by a deeply rooted Christian ethos that is evident not only in words but in daily practice through compassion, patience, integrity, and genuine love for every child. There is a rare balance between clinical excellence, a profound understanding of child development and human behaviour, and a sincere affection for the children entrusted to their care.\n\nFrom the head of the school to the therapists, teaching staff, and carers in every classroom, there is a shared culture of excellence, warmth, and unwavering commitment. As a parent, you quickly develop complete confidence that your child is not only receiving outstanding therapeutic support but is also safe, cherished, and surrounded by people who are deeply invested in their wellbeing.\n\nLittle Beginnings is far more than therapy; it is a community where children are nurtured with expertise, compassion, and purpose. I cannot recommend it highly enough.",
    bg:     '#e6f6fb',
    quote:  '#0192c6',
  },
  {
    id:     2,
    name:   "Mo'",
    text:   "Little Beginnings has been such a positive and nurturing environment for our child. From the very start, the staff made us feel supported, understood, and hopeful. Their patience, kindness, and genuine dedication to each child's growth truly stand out.\n\nWe have seen meaningful progress not only academically, but also in confidence, communication, and independence. The teachers and support team foster a safe, caring space where every child is valued and encouraged to thrive at their own pace.\n\nAs parents, it brings us so much comfort knowing our child is in a school where they are celebrated for who they are. We are deeply grateful to Little Beginnings for the love, guidance, and commitment they show every single day.",
    bg:     '#FFF8E1',
    quote:  '#E6B840',
  },
  {
    id:     3,
    name:   'Mrs. A.',
    text:   "Thanks to LBA for recognizing this talent in Lashe. I am truly grateful.",
    bg:     '#FFE8E8',
    quote:  '#FF6B6B',
  },
  {
    id:     4,
    name:   "Layo's Mum",
    text:   "It was a blessing to have found a place where my son could feel comfortable. The team genuinely care for my sons development. Using different techniques to address his challenges, they strive to improve on skills learnt and correct challenging behaviours. The staff are easy to approach and always give feedback on my sons daily tasks. I am happy with the devotion they have shown to improve the lives of our children.",
    bg:     '#F0FEFE',
    quote:  '#4abbee',
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
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

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
          {testimonials.map((t) => {
            const isExpanded = expandedId === t.id
            const paragraphs = t.text.split('\n\n')
            const needsTruncation = t.text.length > 180

            return (
              <motion.div
                key={t.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-3xl p-6 cursor-pointer dark:!bg-slate-800 dark:border dark:border-slate-700 flex flex-col"
                style={{ backgroundColor: t.bg }}
              >
                <Quote className="w-8 h-8 mb-4 opacity-70" style={{ color: t.quote }} />

                <motion.div
                  initial={false}
                  animate={{ height: isExpanded || !needsTruncation ? 'auto' : '90px' }}
                  className="overflow-hidden relative mb-2"
                >
                  <div className="text-dark/80 dark:text-gray-300 text-sm leading-relaxed italic space-y-3 pb-2">
                    {paragraphs.map((paragraph, i) => (
                      <p key={i}>{i === 0 ? `"${paragraph}` : paragraph}{i === paragraphs.length - 1 ? '"' : ''}</p>
                    ))}
                  </div>

                  <AnimatePresence>
                    {!isExpanded && needsTruncation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none dark:hidden"
                        style={{ background: `linear-gradient(to top, ${t.bg}, transparent)` }}
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {!isExpanded && needsTruncation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none hidden dark:block bg-gradient-to-t from-slate-800 via-slate-800/80 to-transparent"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {needsTruncation && (
                  <button
                    onClick={() => toggleExpand(t.id)}
                    className="mb-4 font-bold text-xs flex items-center gap-1.5 hover:opacity-75 transition-opacity self-start"
                    style={{ color: t.quote }}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                )}

                <div className="flex items-center gap-3 mt-auto">
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
            )
          })}
        </motion.div>
      </div>
      <WaveDivider color="#ffffff" variant="splash" height="md" className="mt-16 dark:hidden" />
      <WaveDivider color="#05131d" variant="splash" height="md" className="mt-16 hidden dark:block" />
    </section>
  )
}

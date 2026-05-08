import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Import images
import imgOluremi from '../assets/Oluremi Joel-Ogbue.png'
import imgBalogun from '../assets/BALOGUN SAMSON OLUWATOSIN.jpg'
import imgOshilaja from '../assets/Dr. Oluwaseun Oshilaja.jpg'
import imgIjeoma from '../assets/Ijeoma Umeokafor.jpg'

const team = [
  {
    id: 1,
    name: 'Mrs. Oluremi Joel-Ogbueli',
    role: 'Head of School',
    bio: 'Oluremi Joel-Ogbueli is an Early Years practitioner, a special needs educator and a disability inclusion advocate. Oluremi attended University of Ilorin where she studied Business Administration, and has undergone different Early Years Foundation Stage (EYFS) trainings both locally and internationally. She started her career as a business development officer and marketer before moving on to becoming a Learning and Development advocate. Oluremi also spent about nine years in the Montessori and Early Years schools where she worked as an Early Years practitioner, before moving on to be a Special Educator and now works with children with learning delays. Oluremi is a Christian and an ardent lover of children. Based on her experience as an aunt of people living with a learning difference, Oluremi has become a voice for families who have children living with disabilities in Nigeria. She loves to help children and for people to understand what disability means and also to teach them to show empathy.',
    img: imgOluremi,
  },
  {
    id: 2,
    name: 'Balogun Samson Oluwatosin',
    role: 'Occupational Therapist & Autism Specialist',
    bio: '‘Tosin Balogun has over two decades’ experience providing interventions to children, adolescents and adults with additional learning needs. He holds a diploma in occupational therapy at the Federal School of Occupational Therapy, Lagos and a first-degree in education from the Pebble Hills University, USA as well as a degree in early childhood education from the National Open University Nigeria. In addition to training in applied behaviour analysis (behaviour technician), he is a trained Teach Me Language program provider, a program designed to improve the language and social skills of children on the autism spectrum disorder and related conditions. He has completed training for a renewable license as an Advanced Certified Autism Specialist with the International Board of Credentialing and Continuing Education Standards. Furthermore, he is a licensed occupational therapist with the Health and Care Professions Council (HCPC), United Kingdom.',
    img: imgBalogun,
  },
  {
    id: 3,
    name: 'Dr. Oluwaseun Oshilaja',
    role: 'Consultant Psychologist & Behaviour Interventionist',
    bio: 'Dr. Oluwaseun Oshilaja holds an M.Sc. in Psychology and a PhD in Psychology from the University of Lagos. He serves as a Consultant Psychologist and Behaviour Interventionist at Little Beginnings Centre, where he applies his deep expertise in behavioral sciences to support our students and families.',
    img: imgOshilaja,
  },
  {
    id: 4,
    name: 'Ijeoma Umeokafor',
    role: 'Academic & Business Development Administrator',
    bio: 'Driving Excellence | Scaling Impact | Empowering Every Learner.\n\nBridging the gap between educational excellence and operational growth, I oversee the strategic heart of Little Beginnings. With a focus on academic rigor and sustainable expansion, I ensure Little Beginnings Center remains a premier destination for specialized care and neurodivergent development.',
    img: imgIjeoma,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Team() {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section id="team" className="py-24 bg-teal-pale relative min-h-screen flex flex-col justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h2 className="section-title">
            Management <span className="text-brand">Team</span>
          </h2>
          <p className="section-subtitle mt-4">
            The dedicated professionals guiding Little Beginnings Center with expertise, passion, and a commitment to inclusive education.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '150px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-20 md:gap-y-24 mt-16 md:mt-24"
        >
          {team.map((member) => {
            const isExpanded = expandedId === member.id;

            return (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-card dark:shadow-none relative flex flex-col pt-20 px-6 pb-8 border border-teal-50 dark:border-slate-700 hover:shadow-hover transition-shadow duration-300"
              >
                {/* Floating Round Image */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-slate-800 shadow-lg overflow-hidden bg-teal-50 dark:bg-slate-700 relative group">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="text-center flex flex-col h-full">
                  <h3 className="font-display font-extrabold text-dark text-lg mb-1 leading-tight dark:text-white">{member.name}</h3>
                  <p className="text-brand font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-5 min-h-[32px] flex items-center justify-center">
                    {member.role}
                  </p>
                  
                  <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-left relative flex-grow flex flex-col justify-start">
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : '100px' }}
                      className="overflow-hidden relative"
                    >
                      <div className="space-y-3 pb-2">
                        {member.bio.split('\n').map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                      
                      {/* Gradient mask when collapsed */}
                      <AnimatePresence>
                        {!isExpanded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white dark:from-slate-800 via-white/80 dark:via-slate-800/80 to-transparent pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  <button
                    onClick={() => toggleExpand(member.id)}
                    className="mt-6 text-primary font-bold text-sm flex items-center justify-center gap-1.5 mx-auto hover:text-brand transition-colors group"
                  >
                    {isExpanded ? 'Read Less' : 'Read Full Bio'}
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="w-4 h-4 text-primary group-hover:text-brand transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}


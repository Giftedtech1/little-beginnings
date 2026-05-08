import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Eye, Star, Heart, Leaf, Lightbulb, Users, Globe } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stats = [
  { value: '75+', label: 'Outdoor Activities' },
  { value: '248', label: 'Math Lessons' },
  { value: '32',  label: 'Loving Teachers' },
  { value: '458', label: 'Fun Experiments' },
]

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero Section */}
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
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Little More About Us</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-dark dark:text-white leading-tight max-w-3xl mb-6">
            A warm, caring and dynamic <span className="text-brand">learning community</span>
          </h1>
          <div className="w-16 h-1 bg-brand rounded-full mb-8" />
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted leading-relaxed space-y-6">
            <p>
              Little Beginnings is a warm, caring and dynamic learning community where we support our pupils, 
              encouraging each unique child to be ambitious and successful.
            </p>
            <p>
              The School was founded with the awareness to provide the education needed by a child to be successful, 
              efficacious and flourish in our ever changing world.
            </p>
            <p>
              We offer a highly personalised education which is both traditional in its values but innovative in its methods, 
              with the aim of supporting each child to become curious, enthusiastic and resilient learners.
            </p>
            <p>
              With the aim to ensure our pupils leave our care confident both intellectually and socially, aware of the world 
              around them, respectful of others, and ready to meet the challenges of the next stages in their education and 
              in their lives; our approach, integrates personalised learning and positive discipline, enabling our pupils not 
              only to achieve outstanding academic results but also develop the skills and mind-set to thrive in a changing world.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700"
            >
              <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-brand" />
              </div>
              <h2 className="font-display font-bold text-2xl text-dark dark:text-white mb-4">Our Mission</h2>
              <p className="text-muted leading-relaxed">
                To provide exceptional care to our pupils while fostering each child’s intellectual, social, 
                physical and moral development in an academic-rich environment.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700"
            >
              <div className="w-14 h-14 bg-coral/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-coral" />
              </div>
              <h2 className="font-display font-bold text-2xl text-dark dark:text-white mb-4">Our Vision</h2>
              <p className="text-muted leading-relaxed">
                To be at the frontline of educating and producing outstanding children who will be great 
                ambassadors in an ever-changing world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand mb-3 block">Why Choose Us</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark dark:text-white mb-6">
            What Makes Our School Special
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-muted leading-relaxed">
            <p>
              Located in a welcoming, serene, creative and nurturing environment, our school is designed to help 
              children discover the joy of learning by exploring and developing their potentials.
            </p>
            <p>
              Our pedagogical approach is highly personalized, based on small class sizes and a nurturing 
              pastoral support model.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="text-4xl font-display font-extrabold text-brand mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

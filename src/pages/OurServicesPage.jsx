import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Building2, GraduationCap, Home, Heart, Smile } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { t } from '../utils/i18n'

const servicesList = [
  {
    id: 'in-facility',
    titleKey: 'inFacilityTitle',
    descKey: 'inFacilityDesc',
    icon: Building2,
    accentColor: '#0192c6',
    bgColor: 'rgba(1, 146, 198, 0.1)',
    borderColor: 'rgba(1, 146, 198, 0.2)',
    badgeKey: 'onSiteIntervention',
    bulletKeys: ['inFacilityPt1', 'inFacilityPt2', 'inFacilityPt3', 'inFacilityPt4']
  },
  {
    id: 'school-facilitation',
    titleKey: 'schoolFacilitationTitle',
    descKey: 'schoolFacilitationDesc',
    icon: GraduationCap,
    accentColor: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    badgeKey: 'academicIntegration',
    bulletKeys: ['schoolFacilitationPt1', 'schoolFacilitationPt2', 'schoolFacilitationPt3', 'schoolFacilitationPt4']
  },
  {
    id: 'home-intervention',
    titleKey: 'homeInterventionTitle',
    descKey: 'homeInterventionDesc',
    icon: Home,
    accentColor: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    badgeKey: 'naturalEnvironment',
    bulletKeys: ['homeInterventionPt1', 'homeInterventionPt2', 'homeInterventionPt3', 'homeInterventionPt4']
  },
  {
    id: 'nanny-training',
    titleKey: 'nannyTrainingTitle',
    descKey: 'nannyTrainingDesc',
    icon: Smile,
    accentColor: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    badgeKey: 'caregiverEmpowerment',
    bulletKeys: ['nannyTrainingPt1', 'nannyTrainingPt2', 'nannyTrainingPt3', 'nannyTrainingPt4']
  },
  {
    id: 'family-training',
    titleKey: 'familyTrainingTitle',
    descKey: 'familyTrainingDesc',
    icon: Heart,
    accentColor: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    badgeKey: 'holisticSupportBadge',
    bulletKeys: ['familyTrainingPt1', 'familyTrainingPt2', 'familyTrainingPt3', 'familyTrainingPt4']
  }
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function OurServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-left"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">
            {t('ourServices')}
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-dark dark:text-white leading-tight max-w-3xl mb-6">
            {t('empoweringGrowth')} <span className="text-brand">{t('specializedSupportServices')}</span>
          </h1>
          <div className="w-16 h-1 bg-brand rounded-full mb-6" />
          <p className="text-muted leading-relaxed text-base sm:text-lg max-w-3xl">
            {t('servicesSubtitle')}
          </p>
        </motion.div>
      </section>

      {/* Services Grid Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesList.map((service) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700/60 shadow-card hover:shadow-card-hover overflow-hidden flex flex-col h-full p-6 sm:p-8 transition-colors duration-300"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:rotate-6"
                    style={{ backgroundColor: service.bgColor }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: service.accentColor }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{
                      color: service.accentColor,
                      backgroundColor: service.bgColor,
                      borderColor: service.borderColor,
                    }}
                  >
                    {t(service.badgeKey)}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-dark dark:text-white mb-3 tracking-tight">
                  {t(service.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted leading-relaxed mb-6 flex-grow">
                  {t(service.descKey)}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-slate-700/50 my-2" />

                {/* Bullet Points */}
                <ul className="space-y-3.5 my-4">
                  {service.bulletKeys.map((ptKey, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-dark/95 dark:text-gray-200">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: service.accentColor }}
                      />
                      <span className="leading-snug">{t(ptKey)}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Action */}
                <div className="mt-6">
                  <Link
                    to="/apply"
                    className="w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-4 rounded-2xl transition-all duration-200 text-white shadow-sm hover:shadow-md"
                    style={{ backgroundColor: service.accentColor }}
                  >
                    {t('applyNow')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark dark:bg-slate-950 relative overflow-hidden text-white transition-colors duration-300">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,100 100,0 L100,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-6">
            {t('readyToBeginJourney')}
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto text-base sm:text-lg">
            {t('scheduleConsultation')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white font-bold px-8 py-3.5 rounded-full transition-transform hover:scale-105"
            >
              {t('applyNow')}
            </Link>
            <a
              href="https://wa.me/2348033344077?text=Hello%20Little%20Beginnings,%20I%20would%20like%20to%20make%20an%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-full transition-all"
            >
              {t('chatOnWhatsApp')}
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

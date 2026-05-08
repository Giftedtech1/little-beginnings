import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, ClipboardList, ArrowRight, ArrowLeft } from 'lucide-react'
import logo from '../assets/new logo.png'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function AdmissionsLanding() {
  return (
    <div className="min-h-screen bg-[#e0e3e5] py-12 px-4 sm:px-6 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full">
        
        {/* Back link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-bold text-sm transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>

        <div className="bg-white shadow-2xl relative overflow-hidden border border-gray-300 p-8 sm:p-12 lg:p-16">
          
          {/* Header */}
          <div className="text-center mb-12 relative z-10">
            <motion.img 
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              src={logo} alt="Little Beginnings Logo" className="h-16 mx-auto mb-6" 
            />
            <motion.h1 
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
            >
              Admissions Portal
            </motion.h1>
            <motion.p 
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-gray-600 max-w-xl mx-auto"
            >
              Welcome to the Little Beginnings admissions portal. Please select the form you wish to complete below. You will need an access code provided by the Head of School to proceed.
            </motion.p>
          </div>

          {/* Cards Container */}
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            
            {/* Card 1: Admission Application */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <Link to="/apply" className="block group h-full">
                <div className="border-2 border-gray-200 hover:border-black rounded-2xl p-8 transition-all duration-300 hover:shadow-lg bg-gray-50 hover:bg-white h-full flex flex-col">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Admission Application</h2>
                  <p className="text-gray-600 mb-8 flex-1">
                    For parents of new students seeking general admission to Little Beginnings Centre.
                  </p>
                  <div className="flex items-center text-sm font-bold text-black uppercase tracking-widest group-hover:gap-3 transition-all gap-2 mt-auto">
                    Complete Form <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Card 2: Pre-Assessment */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Link to="/pre-assessment" className="block group h-full">
                <div className="border-2 border-gray-200 hover:border-primary rounded-2xl p-8 transition-all duration-300 hover:shadow-lg bg-gray-50 hover:bg-white h-full flex flex-col">
                  <div className="w-14 h-14 bg-teal-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Pre-Assessment Form</h2>
                  <p className="text-gray-600 mb-8 flex-1">
                    A detailed medical and developmental history form required for students enrolling in specialized intervention programs.
                  </p>
                  <div className="flex items-center text-sm font-bold text-primary uppercase tracking-widest group-hover:gap-3 transition-all gap-2 mt-auto">
                    Complete Form <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
          
        </div>
        
        {/* Footer */}
        <div className="text-center py-8">
          <p className="font-sans text-xs text-gray-500 uppercase tracking-widest">© {new Date().getFullYear()} Little Beginnings Centre</p>
        </div>

      </div>
    </div>
  )
}

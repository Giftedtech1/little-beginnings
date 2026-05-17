import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, Users, GraduationCap, Phone, MessageCircle, Construction, HeartPulse, Layers } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/new logo.png'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Home', href: '/', to: null },
  { label: 'About Us', href: null, to: '/about' },
  { label: 'Admissions', href: null, to: '/admissions' },
  { label: 'Our Services', href: '#services', to: null },
  { label: 'Blog', href: '#blog', to: null },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const dropdownRef = useRef(null)
  const contactDropdownRef = useRef(null)
  const exploreDropdownRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLoginOpen(false)
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setIsContactOpen(false)
      }
      if (exploreDropdownRef.current && !exploreDropdownRef.current.contains(event.target)) {
        setIsExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-surface/95 dark:bg-[#05131d]/95 backdrop-blur-md shadow-soft border-b border-primary/10 dark:border-primary/20'
          : 'bg-transparent'
        }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center h-full py-2 group">
            <div
              className="w-32 sm:w-48 md:w-56 h-full flex-shrink-0 relative transition-transform duration-300 group-hover:scale-105"
            >
              <img src={logo} alt="Little Beginnings Logo" className="w-full h-full object-contain object-left sm:object-center" />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-semibold text-sm transition-colors duration-200 dark:text-white"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0192c6')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-sm transition-colors duration-200 dark:text-white"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0192c6')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  {link.label}
                </a>
              )
            )}

            {/* Our Brands Dropdown */}
            <div className="relative" ref={exploreDropdownRef}>
              <button
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className="flex items-center gap-1 font-semibold text-sm transition-colors duration-200 dark:text-white"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#15397cea')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                Our Brands
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-primary/10 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <Link
                        to="/foundation"
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="leading-none">Foundation</p>
                          <p className="text-[10px] font-normal text-gray-400 mt-0.5">Social impact arm</p>
                        </div>
                      </Link>
                      <Link
                        to="/training-school"
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-purple-500/10 hover:text-purple-500 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="leading-none">Training School</p>
                          <p className="text-[10px] font-normal text-gray-400 mt-0.5">Educator development</p>
                        </div>
                      </Link>
                      <Link
                        to="/thera-hub"
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <HeartPulse className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="leading-none">TheraHub</p>
                          <p className="text-[10px] font-normal text-gray-400 mt-0.5">Therapy & wellness</p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {/* Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center gap-1.5 font-semibold text-sm transition-colors duration-200 dark:text-white px-3 py-2 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10"
              >
                Login
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLoginOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLoginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-primary/10 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <a
                        href="/portal/login?role=staff"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        Staff Login
                      </a>
                      <a
                        href="/portal/login?role=parent"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-coral/10 hover:text-coral transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center text-coral">
                          <Users className="w-4 h-4" />
                        </div>
                        Parent Login
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Dropdown */}
            <div className="relative" ref={contactDropdownRef}>
              <button
                onClick={() => setIsContactOpen(!isContactOpen)}
                className="btn-primary text-sm py-2.5 flex items-center gap-1.5"
              >
                Contact Us
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isContactOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isContactOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-primary/10 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <a
                        href="tel:+2348033344077"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Phone className="w-4 h-4" />
                        </div>
                        Call: +234 803 334 4077
                      </a>
                      <a
                        href="tel:+2348174380100"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Phone className="w-4 h-4" />
                        </div>
                        Call: +234 817 438 0100
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-xl transition-colors dark:text-white"
              style={{ color: '' }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-slate-900 border-t transition-all duration-300 ${isOpen ? 'max-h-[calc(100vh-5rem)] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        style={{ borderColor: 'rgba(1,146,198,0.15)' }}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-semibold text-dark/80 dark:text-white transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0192c6'; e.currentTarget.style.backgroundColor = 'rgba(1, 146, 198, 0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-semibold text-dark/80 dark:text-white transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0192c6'; e.currentTarget.style.backgroundColor = 'rgba(1, 146, 198, 0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </a>
            )
          )}
          <div className="pt-2 pb-2 border-t border-primary/10 my-2">
            <div className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-wider">
              Our Brands
            </div>
            <Link
              to="/foundation"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Layers className="w-4 h-4" />
              </div>
              Foundation
            </Link>
            <Link
              to="/training-school"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-purple-500/10 hover:text-purple-500 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <GraduationCap className="w-4 h-4" />
              </div>
              Training School
            </Link>
            <Link
              to="/thera-hub"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <HeartPulse className="w-4 h-4" />
              </div>
              TheraHub
            </Link>
          </div>

          <div className="pt-2 pb-2 border-t border-primary/10 my-2">
            <div className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-wider">
              Portal Access
            </div>
            <a
              href="/portal/login?role=staff"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap className="w-4 h-4" />
              </div>
              Staff Login
            </a>
            <a
              href="/portal/login?role=parent"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark/80 dark:text-white hover:bg-coral/10 hover:text-coral transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center text-coral">
                <Users className="w-4 h-4" />
              </div>
              Parent Login
            </a>
          </div>

          <div className="pt-3">
            <button
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="btn-primary w-full justify-center text-sm flex items-center gap-2"
            >
              Contact Us
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isContactOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isContactOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2 flex flex-col overflow-hidden"
                >
                  <a href="tel:+2348033344077" className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> Call: +234 803 334 4077
                  </a>
                  <a href="tel:+2348174380100" className="flex items-center justify-center py-2.5 rounded-xl text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> Call: +234 817 438 0100
                  </a>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, Users, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/new logo.png'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Home', href: '#home', to: null },
  { label: 'About Us', href: null, to: '/about' },
  { label: 'Programs', href: null, to: '/programs' },
  { label: 'Admissions', href: null, to: '/admissions' },
  { label: 'Services', href: '#services', to: null },
  { label: 'Blog', href: '#blog', to: null },
  { label: 'Contact', href: '#contact', to: null },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const dropdownRef = useRef(null)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-surface/95 dark:bg-[#061D1D]/95 backdrop-blur-md shadow-soft border-b border-primary/10 dark:border-primary/20'
          : 'bg-transparent'
        }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center h-full py-2 group">
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#14B0B0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-sm transition-colors duration-200 dark:text-white"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#14B0B0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  {link.label}
                </a>
              )
            )}
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

            <a href="#contact" className="btn-primary text-sm py-2.5">
              Contact Us
            </a>
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
        style={{ borderColor: 'rgba(20,176,176,0.15)' }}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-semibold text-dark/80 dark:text-white transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#14B0B0'; e.currentTarget.style.backgroundColor = 'rgba(20, 176, 176, 0.1)' }}
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
                onMouseEnter={(e) => { e.currentTarget.style.color = '#14B0B0'; e.currentTarget.style.backgroundColor = 'rgba(20, 176, 176, 0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </a>
            )
          )}
          <div className="pt-2 pb-2 border-t border-primary/10 my-2 space-y-1">
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
            <a href="#contact" className="btn-primary w-full justify-center text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

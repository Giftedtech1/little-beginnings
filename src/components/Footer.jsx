import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import WaveDivider from './WaveDivider'
import logo from '../assets/new logo.png'

// Inline SVG social icons
const FacebookIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)
const InstagramIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const TwitterIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const YoutubeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
)

const quickLinks = [
  { label: 'Home',       to: '/',           href: null },
  { label: 'About Us',   to: '/about',       href: null },
  { label: 'Admissions', to: '/admissions',  href: null },
  { label: 'Services',   to: null,           href: '/#services' },
  { label: 'Blog',       to: null,           href: '/#blog' },
  { label: 'Contact',    to: null,           href: '/#contact' },
]

const services = [
  'Behaviour Intervention',
  'Communication and Language Therapy',
  'Reading Support',
  'Occupational Therapy',
  'Math & Writing',
  'Assessment',
]

const socials = [
  { icon: FacebookIcon,  label: 'Facebook',  href: 'https://www.facebook.com/share/18HfCXgKSX/?mibextid=wwXIfr' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/littlebeginningscentre?igsh=MXl4NDM4NG1zOHVr' },
  { icon: TwitterIcon,   label: 'Twitter',   href: '#' },
  { icon: YoutubeIcon,   label: 'YouTube',   href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-dark dark:bg-slate-950 text-white">
      {/* Scallop wave top — transitions from white into dark footer */}
      <WaveDivider color="#0a1c2b" variant="scallop" height="md" flip className="block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-6 w-48 sm:w-64 h-20 sm:h-24 relative">
              {/* The footer has a dark background already, so the white text in the logo will show perfectly! */}
              <img src={logo} alt="Little Beginnings Logo" className="w-full h-full object-contain object-left" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Little Beginnings is a warm, caring and dynamic learning community where we support our pupils,
              encouraging each unique child to be ambitious and successful.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
                  style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0192c6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)')}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-extrabold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-white/60 text-sm transition-colors hover:text-primary-bright"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-white/60 text-sm transition-colors hover:text-primary-bright"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-extrabold text-base mb-4">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-white/60 text-sm transition-colors hover:text-primary-bright"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-extrabold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#aae1f6' }} />
                <span>
                  27A Dr. Ezekuse Close; <br />
                  Off Shakiru Anjorin Street, <br />
                  Lekki Phase 1, Lagos
                </span>
              </li>
              <li>
                <a
                  href="tel:+2348033344077"
                  className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-primary-bright"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#aae1f6' }} />
                  +234 803 334 4077
                </a>
                <a
                  href="https://wa.me/2348033344077?text=Hello%20Little%20Beginnings,%20I%20would%20like%20to%20make%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-green-400 transition-colors hover:text-green-300 mt-2 ml-[26px]"
                >
                  <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="tel:+2348174380100"
                  className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-primary-bright"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#aae1f6' }} />
                  +234 817 438 0100
                </a>
              </li>
              <li>
                <a
                  href="mailto:adminoffice@little-beginnings.org"
                  className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-primary-bright"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#aae1f6' }} />
                  adminoffice@little-beginnings.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Little Beginnings Learning Center. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <a href="#" className="transition-colors hover:text-primary-bright">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-primary-bright">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

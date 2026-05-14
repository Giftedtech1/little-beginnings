import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'
import WaveDivider from './WaveDivider'

export default function LocationMap() {
  const address = "27A Dr. Ezekuse Close; Off Shakiru Anjorin Street, Lekki Phase 1, Lagos."
  const mapUrl = "https://maps.google.com/maps?q=27A+Dr.+Ezekuse+Close,+Off+Shakiru+Anjorin+Street,+Lekki+Phase+1,+Lagos&t=&z=16&ie=UTF8&iwloc=&output=embed"

  return (
    <section id="location" className="py-24 bg-teal-solid text-white relative min-h-screen flex flex-col justify-center">
      <WaveDivider color="#0192c6" variant="scallop" height="md" flip className="relative z-10" />

      {/* Background image with overlay */}
      <div
        className="relative py-20 flex-grow flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&q=80&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(1,146,198,0.88)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 flex items-center justify-center gap-1.5 w-max mx-auto">
              <MapPin className="w-3.5 h-3.5" /> Visit Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-3">
              Where to Find Us
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              We are conveniently located in the heart of Lekki. Come visit our state-of-the-art facility designed entirely for your child's success.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-stretch">
            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 flex flex-col justify-center text-dark shadow-card-hover dark:shadow-none"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Our Center</h3>
              <p className="text-muted leading-relaxed mb-8 text-lg">
                {address}
              </p>
              
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center group"
              >
                <Navigation className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                Get Directions
              </a>
            </motion.div>

            {/* Map iframe */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-card-hover dark:shadow-none w-full h-[400px] lg:h-auto overflow-hidden min-h-[400px]"
            >
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '20px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>

      <WaveDivider color="#F0FEFE" variant="wave" height="md" className="dark:hidden" />
      <WaveDivider color="#0A2525" variant="wave" height="md" className="hidden dark:block" />
    </section>
  )
}

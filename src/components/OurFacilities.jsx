import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Images ────────────────────────────────────────────────────────────────────
import img1  from '../assets/our facilities/1014599554.jpg'
import img2  from '../assets/our facilities/1014599557.jpg'
import img3  from '../assets/our facilities/1014599563.jpg'
import img4  from '../assets/our facilities/1014599566.jpg'
import img5  from '../assets/our facilities/1014599569.jpg'
import img6  from '../assets/our facilities/1014599572.jpg'
import img7  from '../assets/our facilities/1014599577.jpg'
import img8  from '../assets/our facilities/1014599580.jpg'
import img9  from '../assets/our facilities/1014599583.jpg'
import img10 from '../assets/our facilities/1014599586.jpg'
import img11 from '../assets/our facilities/1014599589.jpg'
import img12 from '../assets/our facilities/IMG-20260420-WA0004.jpg'
import img13 from '../assets/our facilities/IMG-20260420-WA0006.jpg'
import img14 from '../assets/our facilities/IMG-20260420-WA0009.jpg'

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14]

export default function OurFacilities() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [direction, setDirection] = useState(0)

  const open = (idx) => { setDirection(0); setActiveIndex(idx) }
  const close = () => setActiveIndex(null)

  const go = useCallback((dir) => {
    setDirection(dir)
    setActiveIndex(prev => (prev + dir + images.length) % images.length)
  }, [])

  // Keyboard nav
  useEffect(() => {
    if (activeIndex === null) return
    const fn = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft')  go(-1)
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [activeIndex, go])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeIndex])

  return (
    <section id="our-facilities" className="py-20 bg-[#F8FAFA] dark:bg-[#061D1D] min-h-screen flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="section-title">
            Our <span className="text-brand">Facilities</span>
          </h2>
        </motion.div>

        {/* 4-tile preview grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* First 3 — full tiles */}
          {images.slice(0, 3).map((src, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              onClick={() => open(i)}
              className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`View facility photo ${i + 1}`}
            >
              <img
                src={src}
                alt={`Little Beginnings facility ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
            </motion.button>
          ))}

          {/* 4th tile — "+10 more" overlay */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.18 }}
            onClick={() => open(3)}
            className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="View all facility photos"
          >
            <img
              src={images[3]}
              alt="Little Beginnings facility 4"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
            />
            {/* Dark overlay + count */}
            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/65 transition-colors duration-300 flex flex-col items-center justify-center gap-1">
              <span className="text-white font-extrabold font-display text-2xl sm:text-3xl leading-none">
                +{images.length - 3}
              </span>
              <span className="text-white/80 text-xs font-semibold tracking-wide">
                more photos
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key="lb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Counter */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
              {activeIndex + 1} / {images.length}
            </span>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              className="absolute left-2 md:left-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="px-14 max-w-[95vw] max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt={`Facility ${activeIndex + 1}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.22 } }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40, transition: { duration: 0.18 } }}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              </AnimatePresence>
            </div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); go(1) }}
              className="absolute right-2 md:right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

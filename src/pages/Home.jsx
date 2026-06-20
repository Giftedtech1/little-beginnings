import { lazy, Suspense } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'

// Lazy-load below-the-fold sections — they are fetched on demand,
// not bundled into the critical initial JS chunk.
const About        = lazy(() => import('../components/About'))
const Curriculum   = lazy(() => import('../components/Curriculum'))
const Challenges   = lazy(() => import('../components/Challenges'))
const OurFacilities = lazy(() => import('../components/OurFacilities'))
const LocationMap  = lazy(() => import('../components/LocationMap'))
const Team         = lazy(() => import('../components/Team'))
const Testimonials = lazy(() => import('../components/Testimonials'))
const Blog         = lazy(() => import('../components/Blog'))
const Newsletter   = lazy(() => import('../components/Newsletter'))
const Footer       = lazy(() => import('../components/Footer'))

// Minimal skeleton shown while a lazy section loads
function SectionSkeleton() {
  return (
    <div className="w-full py-24 flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Curriculum />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <OurFacilities />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Challenges />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <LocationMap />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Team />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Blog />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Newsletter />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}


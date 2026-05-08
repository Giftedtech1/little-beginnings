import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import Curriculum from '../components/Curriculum'
import Challenges from '../components/Challenges'
import OurFacilities from '../components/OurFacilities'
import LocationMap from '../components/LocationMap'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import Blog from '../components/Blog'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Curriculum />
        <OurFacilities />
        <Challenges />
        <LocationMap />
        <Team />
        <Testimonials />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Home from '../pages/Home'
import Apply from '../pages/Apply'
import AboutPage from '../pages/AboutPage'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import StudentProfile from '../pages/StudentProfile'
import AdminPanel from '../pages/AdminPanel'
import UploadVideo from '../pages/UploadVideo'
import TeacherDashboard from '../pages/TeacherDashboard'
import ParentDashboard from '../pages/ParentDashboard'
import UpdatePassword from '../pages/UpdatePassword'
import ProfilePage from '../pages/ProfilePage'
import TawkToController from '../components/TawkToController'
import PreAssessment from '../pages/PreAssessment'
import AccessGate from '../components/AccessGate'
import AdmissionsLanding from '../pages/AdmissionsLanding'
import ScrollToTop from '../components/ScrollToTop'
import PageTransition from '../components/PageTransition'
import BlogPost from '../pages/BlogPost'
import ServiceDetail from '../pages/ServiceDetail'
import Foundation from '../pages/Foundation'
import TrainingSchool from '../pages/TrainingSchool'
import TheraHub from '../pages/TheraHub'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/admissions" element={<PageTransition><AdmissionsLanding /></PageTransition>} />
        <Route path="/apply" element={<PageTransition><AccessGate><Apply /></AccessGate></PageTransition>} />
        <Route path="/pre-assessment" element={<PageTransition><AccessGate><PreAssessment /></AccessGate></PageTransition>} />
        <Route path="/services/:serviceId" element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
        <Route path="/foundation" element={<PageTransition><Foundation /></PageTransition>} />
        <Route path="/training-school" element={<PageTransition><TrainingSchool /></PageTransition>} />
        <Route path="/thera-hub" element={<PageTransition><TheraHub /></PageTransition>} />
        <Route path="/portal/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/portal/update-password" element={<PageTransition><UpdatePassword /></PageTransition>} />
        <Route path="/portal/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/portal/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
        <Route path="/portal/teacher" element={<PageTransition><TeacherDashboard /></PageTransition>} />
        <Route path="/portal/my-child" element={<PageTransition><ParentDashboard /></PageTransition>} />
        <Route path="/portal/student/:id" element={<PageTransition><StudentProfile /></PageTransition>} />
        <Route path="/portal/upload" element={<PageTransition><UploadVideo /></PageTransition>} />
        <Route path="/portal/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TawkToController />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

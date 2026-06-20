import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let intervalId

    if (hash) {
      const id = hash.replace('#', '')
      
      const scrollToElement = () => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          return true
        }
        return false
      }

      if (!scrollToElement()) {
        let attempts = 0
        intervalId = setInterval(() => {
          attempts++
          if (scrollToElement() || attempts > 10) {
            clearInterval(intervalId)
          }
        }, 100)
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [pathname, hash])

  return null
}

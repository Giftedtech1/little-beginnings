import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const HIDDEN_ROUTES = ['/portal/admin', '/portal/teacher']

function isHiddenRoute(pathname) {
  return HIDDEN_ROUTES.some((r) => pathname.startsWith(r))
}

export default function TawkToController() {
  const location = useLocation()

  useEffect(() => {
    const hidden = isHiddenRoute(location.pathname)

    const apply = () => {
      if (!window.Tawk_API) return
      if (typeof window.Tawk_API.hideWidget !== 'function') return
      if (hidden) {
        window.Tawk_API.hideWidget()
      } else {
        window.Tawk_API.showWidget()
      }
    }

    // If the API is already loaded, apply immediately
    if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
      apply()
    } else {
      // Queue up for when it finishes loading — preserve any existing onLoad
      window.Tawk_API = window.Tawk_API || {}
      const prevOnLoad = window.Tawk_API.onLoad
      window.Tawk_API.onLoad = function () {
        if (prevOnLoad) prevOnLoad()
        apply()
      }
    }
  }, [location.pathname])

  return null
}

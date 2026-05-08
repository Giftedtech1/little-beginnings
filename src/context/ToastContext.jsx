import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

const toastConfig = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700',
    iconClass: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700',
    iconClass: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    classes: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { id, message, type }])

    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const error   = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const info    = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ toast: { success, error, info, warning } }), [success, error, info, warning])

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[999] flex flex-col gap-3 pointer-events-none max-w-sm w-full pr-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const cfg = toastConfig[t.type] || toastConfig.info
            const Icon = cfg.icon
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`pointer-events-auto flex items-start gap-3 w-full p-4 rounded-2xl shadow-xl ${cfg.classes}`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.iconClass}`} />
                <p className="text-sm font-semibold flex-1 leading-snug">{t.message}</p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-1 hover:bg-black/10 rounded-full transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}

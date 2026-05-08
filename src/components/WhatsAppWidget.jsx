import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Use the actual WhatsApp number of the center here
    const phoneNumber = '2348033344077'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    // Open in new tab
    window.open(url, '_blank')
    
    // Reset and close after sending
    setMessage('')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-4 w-[85vw] max-w-[320px] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Little Beginnings Care</h4>
                  <p className="text-xs text-white/80">Typically replies in a few minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat Body */}
            <div className="p-4 bg-gray-50 h-56 overflow-y-auto" style={{ backgroundImage: "url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')", backgroundSize: 'contain', opacity: 0.95 }}>
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-gray-800 max-w-[85%] mb-2 relative">
                Hi there! 👋 How can we help you and your little one today?
                <div className="text-[10px] text-gray-400 text-right mt-1">Just now</div>
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#20bd5a]"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#20bd5a] transition-all duration-300 focus:outline-none ${
          isOpen ? 'w-14' : 'px-5 gap-2'
        }`}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="font-bold text-sm tracking-wide">Chat Us</span>
          </>
        )}
      </motion.button>
    </div>
  )
}

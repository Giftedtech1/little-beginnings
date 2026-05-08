import { useState } from 'react'

export default function PromptModal({ isOpen, title, message, placeholder, onConfirm, onCancel, confirmText = "Submit" }) {
  const [inputValue, setInputValue] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    onConfirm(inputValue)
    setInputValue('') // Reset for next time
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="font-display font-bold text-xl mb-2 text-dark">{title}</h2>
        <p className="text-muted text-sm mb-6">{message}</p>
        
        <form onSubmit={handleSubmit}>
          <textarea 
            required
            autoFocus
            rows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none mb-6"
          />
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => {
                setInputValue('')
                onCancel()
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="flex-1 btn-primary justify-center disabled:opacity-50"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

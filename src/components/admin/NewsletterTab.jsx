import { useState, useEffect } from 'react'
import { getNewsletterSubscribers } from '../../services/newsletterService'
import { Loader2, Users } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function NewsletterTab() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await getNewsletterSubscribers()
        setSubscribers(data)
      } catch (error) {
        toast.error('Failed to load subscribers')
      } finally {
        setLoading(false)
      }
    }
    fetchSubscribers()
  }, [toast])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-bold">No subscribers yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-dark">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{new Date(sub.subscribed_at).toLocaleDateString()} at {new Date(sub.subscribed_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

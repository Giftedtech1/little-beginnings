import { useEffect, useState } from 'react'
import { Users, Video, FileText, TrendingUp } from 'lucide-react'
import { getStudents } from '../services/studentService'
import PageLoader from '../components/ui/PageLoader'

const stats = [
  { icon: Users, label: 'Total Students', key: 'students', color: 'bg-blue-100 text-blue-600' },
  { icon: Video, label: 'Videos Uploaded', key: 'videos', color: 'bg-purple-100 text-purple-600' },
  { icon: FileText, label: 'Reports Generated', key: 'reports', color: 'bg-amber-100 text-amber-600' },
  { icon: TrendingUp, label: 'Avg. Progress', key: 'progress', color: 'bg-green-100 text-green-600' },
]

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getStudents()
        setStudents(data)
      } catch (err) {
        setError('Failed to load student data.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display font-extrabold text-2xl text-dark mb-1">Dashboard</h1>
        <p className="text-muted text-sm mb-8">Welcome back. Here's an overview of the center.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((s) => (
            <div key={s.key} className="bg-white rounded-2xl shadow-card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold font-display text-dark">—</div>
              <div className="text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Student list */}
        <div className="bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-display font-extrabold text-lg text-dark mb-5">Recent Students</h2>
          {loading ? (
          <PageLoader message="Loading dashboard..." />
          ) : error ? (
            <div className="text-red-500 text-sm text-center py-8">{error}</div>
          ) : students.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No students found.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-dark text-sm">{s.name}</div>
                    <div className="text-xs text-muted">{s.program}</div>
                  </div>
                  <span className="tag">{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

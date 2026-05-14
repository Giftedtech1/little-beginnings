import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, User } from 'lucide-react'
import { getStudentById } from '../services/studentService'

export default function StudentProfile() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getStudentById(id)
        setStudent(data)
      } catch (err) {
        setError('Could not load student profile.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center gap-2 text-muted">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Loading profile...</span>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-red-500 text-sm">{error}</div>
  )

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-10 force-light">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-card p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#e6f6fb' }}>
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-dark">{student?.name ?? 'Student Name'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted text-sm">{student?.program ?? 'Program'}</p>
                {student?.student_id && (
                  <span className="inline-flex items-center font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md tracking-widest">
                    #{student.student_id}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: 'Student ID', value: student?.student_id ? `#${student.student_id}` : undefined },
              { label: 'Age', value: student?.age },
              { label: 'Status', value: student?.status },
              { label: 'Assigned Therapist', value: student?.therapist },
              { label: 'Session Frequency', value: student?.frequency },
            ].map((field) => (
              <div key={field.label} className="bg-surface rounded-2xl p-4">
                <div className="text-xs text-muted font-semibold mb-1">{field.label}</div>
                <div className="font-semibold text-dark text-sm">{field.value ?? '—'}</div>
              </div>
            ))}
          </div>

          {/* TODO: add progress charts, session notes, video history */}
        </div>
      </div>
    </div>
  )
}

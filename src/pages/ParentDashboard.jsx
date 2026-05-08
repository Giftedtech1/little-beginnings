import { useState, useEffect } from 'react'
import { FileText, BookOpen, ExternalLink, Video, Download } from 'lucide-react'
import { getStudentApprovedResults } from '../services/resultService'
import { getVideosByStudent } from '../services/videoService'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReportViewerModal from '../components/ReportViewerModal'
import PageLoader from '../components/ui/PageLoader'

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function ParentDashboard() {
  const { user, role } = useAuth()
  const [results, setResults]   = useState([])
  const [videos, setVideos]     = useState([])
  const [student, setStudent]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [viewingResult, setViewingResult] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Guard: only parents (and admins for testing) can view this page
    // Use role from AuthContext (fetched from profiles table) not unreliable user_metadata
    if (user && role && role !== 'parent' && role !== 'admin' && !['admin_2', 'admin_3', 'super_admin'].includes(role)) {
      navigate('/portal/login')
    }
  }, [user, role, navigate])

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        if (!user?.id) return

        // Query students linked to this specific parent via the parent_student_link junction table
        const { data: studentsData, error: studentError } = await supabase
          .from('parent_student_link')
          .select('students(*)')
          .eq('parent_id', user.id)

        if (studentError) throw studentError

        const linkedStudents = studentsData?.map(row => row.students).filter(Boolean) ?? []

        if (linkedStudents.length === 0) {
          setLoading(false)
          return
        }

        const studentData = linkedStudents[0]
        setStudent(studentData)

        const [approvedResults, studentVideos] = await Promise.all([
          getStudentApprovedResults(studentData.id),
          getVideosByStudent(studentData.id),
        ])
        setResults(approvedResults)
        setVideos(studentVideos)
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchParentData()
  }, [user])

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-dark mb-1">Parent Dashboard</h1>
          <button
            className="bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors"
            onClick={() => navigate('/portal/profile')}
          >
            <UserCircle className="w-4 h-4" /> My Profile
          </button>
        </div>

        {loading ? (
          <PageLoader message="Loading your dashboard..." />
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium">{error}</div>
        ) : !student ? (
          <div className="bg-white rounded-3xl shadow-card p-10 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">No Student Profile Linked</h2>
            <p className="text-muted text-sm">Please contact administration to link your account to your child's profile.</p>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm mb-8">
              Welcome back. Viewing progress for{' '}
              <span className="font-bold text-primary">{student.first_name} {student.last_name}</span>
              {student.student_id && (
                <span className="ml-2 inline-flex items-center font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md tracking-widest">
                  #{student.student_id}
                </span>
              )}
            </p>

            {/* ── Results & Reports ─────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-card p-6 md:p-8 mb-6">
              <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Official Results &amp; Reports
              </h2>

              {results.length === 0 ? (
                <p className="text-center text-muted text-sm py-10">No official results have been published for {student.first_name} yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.map((res) => (
                    <div key={res.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-soft transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0">
                          <h3 className="font-bold text-dark truncate">{res.title}</h3>
                          {res.form_data?.period && (
                            <p className="text-xs text-muted mt-0.5">{res.form_data.period}</p>
                          )}
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-green-50 text-green-600 px-2 py-1 rounded-md flex-shrink-0 ml-2">Official</span>
                      </div>

                      {res.report_type && res.report_type !== 'pdf-link' && (
                        <span className="inline-block mb-3 text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {res.report_type === 'bi-weekly' ? 'Bi-Weekly Report' : 'End of IP Report'}
                        </span>
                      )}

                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => setViewingResult(res)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> View Report
                        </button>
                        {res.file_url && (
                          <a
                            href={res.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-dark"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Session Videos ────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
              <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" /> Session Videos
              </h2>

              {videos.length === 0 ? (
                <p className="text-center text-muted text-sm py-10">No session videos have been uploaded for {student.first_name} yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {videos.map((video) => (
                    <div key={video.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-soft transition-shadow flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-dark text-sm truncate">{video.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            {video.course && (
                              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
                                {video.course}
                              </span>
                            )}
                            <span className="text-xs text-muted">
                              {new Date(video.created_at).toLocaleDateString()}
                            </span>
                            {video.file_size && (
                              <span className="text-xs text-muted">{formatBytes(video.file_size)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <a
                        href={video.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark px-4 py-2.5 rounded-xl transition-colors w-full"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Video
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ReportViewerModal
        result={viewingResult}
        onClose={() => setViewingResult(null)}
      />
    </div>
  )
}

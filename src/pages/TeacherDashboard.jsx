import { useState, useEffect, useRef } from 'react'
import { FileUp, Loader2, CheckCircle, XCircle, Clock, Plus, Trash2, ChevronDown, ChevronRight, Upload, X, UserCircle, FilePlus2, FileText } from 'lucide-react'
import { getStudents } from '../services/studentService'
import { createResult, getTeacherResults, uploadResultMedia, uploadPDFToCpanel } from '../services/resultService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

// ── Constants ────────────────────────────────────────────────────────────────
const SCORES = ['SW', 'E', 'MP', 'M']
const SCORE_COLORS = {
  SW: 'bg-slate-100 text-slate-600 border-slate-200',
  E: 'bg-amber-50  text-amber-700  border-amber-200',
  MP: 'bg-blue-50   text-blue-700   border-blue-200',
  M: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const REPORT_TYPES = [
  { id: 'bi-weekly', label: 'Bi-Weekly Report', desc: 'Build domains and scores for a 2-week period', icon: FilePlus2 },
  { id: 'end-of-ip', label: 'End of IP Report', desc: 'Build domains and scores for the end of the program', icon: FilePlus2 },
  { id: 'pdf-upload', label: 'Upload PDF', desc: 'Drag and drop a completed PDF report', icon: FileText },
]

const newDomain = () => ({ id: crypto.randomUUID(), name: '', items: [] })
const newItem = () => ({ id: crypto.randomUUID(), name: '', score: 'SW' })

// ── Component ────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const mediaInputRef = useRef()
  const pdfInputRef = useRef()

  const [students, setStudents] = useState([])
  const [pastResults, setPastResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [reportType, setReportType] = useState('bi-weekly')
  const [baseForm, setBaseForm] = useState({ student_id: '', title: '', period: '' })
  
  // Domain Builder state (for both Bi-weekly and End of IP)
  const [domains, setDomains] = useState([])
  const [generalComments, setGeneralComments] = useState('')
  
  // PDF Upload state
  const [pdfFile, setPdfFile] = useState(null)

  // Media state
  const [mediaFiles, setMediaFiles] = useState([])

  // Guards
  useEffect(() => {
    // Guard: only staff and admins can access the teacher dashboard
    // Use role from AuthContext (fetched from profiles table) not unreliable user_metadata
    if (user && role && role !== 'staff' && !['admin', 'admin_2', 'admin_3', 'super_admin'].includes(role)) {
      toast.error("You don't have permission to view the staff dashboard.")
      navigate('/portal/login')
    }
  }, [user, role, navigate, toast])

  useEffect(() => {
    if (!user?.id) return
    Promise.all([getStudents(), getTeacherResults(user.id)])
      .then(([s, r]) => { setStudents(s); setPastResults(r) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  // ── Domain builder helpers ─────────────────────────────────────────────────
  const addDomain = () => setDomains(p => [...p, newDomain()])
  const removeDomain = id => setDomains(p => p.filter(d => d.id !== id))
  const setDomainName = (id, name) => setDomains(p => p.map(d => d.id === id ? { ...d, name } : d))
  const addItem = id => setDomains(p => p.map(d => d.id === id ? { ...d, items: [...d.items, newItem()] } : d))
  const removeItem = (dId, iId) => setDomains(p => p.map(d => d.id === dId ? { ...d, items: d.items.filter(i => i.id !== iId) } : d))
  const updateItem = (dId, iId, patch) => setDomains(p => p.map(d => d.id === dId ? { ...d, items: d.items.map(i => i.id === iId ? { ...i, ...patch } : i) } : d))

  // ── Media helpers ──────────────────────────────────────────────────────────
  const handleMediaDrop = e => {
    e.preventDefault()
    addMedia([...e.dataTransfer.files])
  }
  const addMedia = files => {
    const VIDEO_LIMIT = 30 * 1024 * 1024  // 30 MB for videos
    const IMAGE_LIMIT = 20 * 1024 * 1024  // 20 MB for images
    const allowed = []
    const skipped = []
    for (const f of files) {
      const isVideo = f.type.startsWith('video/')
      const limit = isVideo ? VIDEO_LIMIT : IMAGE_LIMIT
      if (f.size <= limit) allowed.push(f)
      else skipped.push(`${f.name} (max ${isVideo ? '30' : '20'} MB)`)
    }
    if (skipped.length) toast.error(`Skipped: ${skipped.join(', ')}`)
    setMediaFiles(p => [...p, ...allowed])
  }
  const removeMedia = idx => setMediaFiles(p => p.filter((_, i) => i !== idx))

  // ── PDF helpers ────────────────────────────────────────────────────────────
  const handlePdfDrop = e => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) addPdf(file)
  }
  const addPdf = file => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('PDF exceeds maximum allowed size of 20 MB.')
      return
    }
    setPdfFile(file)
  }

  // ── Reset form ─────────────────────────────────────────────────────────────
  const resetForm = () => {
    setBaseForm({ student_id: '', title: '', period: '' })
    setDomains([]); setGeneralComments('')
    setPdfFile(null); setMediaFiles([])
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true); setError('')

    try {
      const { student_id, title, period } = baseForm
      if (!student_id || !title) throw new Error('Please select a student and enter a title.')

      // 1. Upload media (images/videos)
      const mediaUrls = []
      for (const file of mediaFiles) {
        const info = await uploadResultMedia(student_id, file)
        mediaUrls.push(info)
      }

      // 2. Build payload
      let fileUrl = null
      let fileInfo = null
      let formData = null

      if (reportType === 'pdf-upload') {
        if (!pdfFile) throw new Error('Please upload a PDF file.')
        const res = await uploadPDFToCpanel(pdfFile)
        fileUrl = res.url
        fileInfo = { name: res.file_name, size: res.size }
      } else if (reportType === 'bi-weekly' || reportType === 'end-of-ip') {
        if (!domains.length && !generalComments.trim()) {
           throw new Error('Please add at least one domain or general comment.')
        }
        formData = { period, domains, generalComments: generalComments.trim() }
      }

      const newRes = await createResult({
        student_id, title, report_type: reportType,
        file_url: fileUrl, form_data: formData, media_urls: mediaUrls, file_info: fileInfo
      }, user.id)

      setPastResults(p => [newRes, ...p])
      resetForm(); setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Failed to submit.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const teacherName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Teacher'

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-10 force-light">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap mb-6 gap-3">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">{today}</p>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-dark mb-1">Good day, {teacherName}</h1>
            <p className="text-muted text-sm">Submit student progress reports for admin review and approval.</p>
          </div>
          <button onClick={() => navigate('/portal/profile')}
            className="bg-white border border-gray-200 hover:border-primary hover:text-primary text-dark font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-soft flex-shrink-0">
            <UserCircle className="w-4 h-4" /> My Profile
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-card p-6 md:p-8 mb-8">
          <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-primary" /> Upload New Report
          </h2>

          {success && (
            <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium">
              <CheckCircle className="w-5 h-5" /> Report submitted! Pending admin approval.
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Step 1 — Select Student */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">1. Select Student</label>
              <select value={baseForm.student_id}
                onChange={e => setBaseForm(p => ({ ...p, student_id: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name}{s.student_id ? ` (#${s.student_id})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2 — Report Title */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">2. Report Title</label>
              <input type="text" value={baseForm.title}
                onChange={e => setBaseForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Spring 2026 – Communication and Language Therapy Assessment"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {/* Step 3 — Report Type */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">3. Report Type</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {REPORT_TYPES.map(rt => {
                  const Icon = rt.icon
                  const active = reportType === rt.id
                  return (
                    <button key={rt.id} type="button"
                      onClick={() => setReportType(rt.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <Icon className={`w-5 h-5 mb-2 ${active ? 'text-primary' : 'text-muted'}`} />
                      <p className={`text-sm font-bold ${active ? 'text-primary' : 'text-dark'}`}>{rt.label}</p>
                      <p className="text-xs text-muted mt-0.5 leading-snug">{rt.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 4 — Date Period */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">4. Report Period / Date <span className="font-normal text-muted">(Optional)</span></label>
              <input type="text" value={baseForm.period}
                onChange={e => setBaseForm(p => ({ ...p, period: e.target.value }))}
                placeholder="e.g. April 1 – April 14, 2026 or January 2026"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {/* Step 5 — PDF Upload */}
            {reportType === 'pdf-upload' && (
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">5. Upload PDF Document</label>
                <div onDrop={handlePdfDrop} onDragOver={e => e.preventDefault()}
                  onClick={() => pdfInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-white">
                  <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden"
                    onChange={e => addPdf(e.target.files[0])} />
                  
                  {pdfFile ? (
                    <div className="flex flex-col items-center">
                       <FileText className="w-10 h-10 text-primary mb-3" />
                       <p className="text-sm font-bold text-dark">{pdfFile.name}</p>
                       <p className="text-xs text-muted mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                       <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }} className="mt-4 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                         <Trash2 className="w-3.5 h-3.5" /> Remove File
                       </button>
                    </div>
                  ) : (
                    <>
                      <FileUp className="w-8 h-8 text-muted mx-auto mb-3" />
                      <p className="text-sm text-dark font-medium">Drag & drop a PDF file here</p>
                      <p className="text-xs text-muted mt-1">or <span className="text-primary font-semibold">browse files</span></p>
                      <p className="text-xs text-muted/60 mt-2">Max 20 MB</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 5 — Domain Builder Form (Bi-Weekly or End of IP) */}
            {(reportType === 'bi-weekly' || reportType === 'end-of-ip') && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-dark">5. Domain Builder</label>

                {/* Score legend */}
                <div className="flex flex-wrap gap-2 p-3 bg-surface rounded-xl text-[11px]">
                  {SCORES.map(s => (
                    <span key={s} className={`px-2.5 py-1 rounded-lg border font-bold ${SCORE_COLORS[s]}`}>{s}</span>
                  ))}
                  <span className="text-muted self-center">SW = Started Working · E = Emerging · MP = Making Progress · M = Mastered</span>
                </div>

                {domains.map((domain) => (
                  <div key={domain.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    {/* Domain header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-gray-100">
                      <input type="text" value={domain.name}
                        onChange={e => setDomainName(domain.id, e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
                        placeholder="Domain name (e.g. Oral Motor)"
                        className="flex-1 text-sm font-bold bg-transparent outline-none text-dark placeholder:text-muted placeholder:font-normal" />
                      <button type="button" onClick={() => removeDomain(domain.id)}
                        className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-gray-50 bg-white">
                      {domain.items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-start gap-3 px-4 py-3">
                          <textarea value={item.name}
                            onChange={e => {
                              updateItem(domain.id, item.id, { name: e.target.value });
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) e.preventDefault()
                              // Shift+Enter still adds a new line naturally
                            }}
                            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                            placeholder="Skill / goal item... (Shift+Enter for new line)"
                            rows={2}
                            className="w-full sm:flex-1 text-sm bg-transparent outline-none text-dark placeholder:text-muted resize-none overflow-hidden leading-relaxed pt-0.5" />
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                            <div className="flex gap-1 flex-shrink-0 flex-wrap">
                              {SCORES.map(s => (
                                <button key={s} type="button"
                                  onClick={() => updateItem(domain.id, item.id, { score: s })}
                                  className={`text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg border transition-all min-w-[2.5rem] text-center ${item.score === s ? SCORE_COLORS[s] + ' scale-105 shadow-sm' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'}`}>
                                  {s}
                                </button>
                              ))}
                            </div>
                            <button type="button" onClick={() => removeItem(domain.id, item.id)}
                              className="p-1.5 sm:p-1 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-lg transition-colors flex-shrink-0">
                              <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-2.5 border-t border-gray-100 bg-white">
                      <button type="button" onClick={() => addItem(domain.id)}
                        className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addDomain}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 bg-white">
                  <Plus className="w-4 h-4" /> Add Domain
                </button>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">General Comments</label>
                  <textarea rows={3} value={generalComments} onChange={e => setGeneralComments(e.target.value)}
                    placeholder="Overall summary or recommendations..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
              </div>
            )}

            {/* Step 6 — Media Upload (optional) */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Attach Media <span className="text-muted font-normal">(optional — videos &amp; images)</span></label>
              <div onDrop={handleMediaDrop} onDragOver={e => e.preventDefault()}
                onClick={() => mediaInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition-colors bg-white">
                <input ref={mediaInputRef} type="file" multiple accept="video/*,image/*" className="hidden"
                  onChange={e => addMedia([...e.target.files])} />
                <Upload className="w-7 h-7 text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">Drag & drop or <span className="text-primary font-semibold">browse files</span></p>
                <p className="text-xs text-muted/60 mt-1">Videos max 30 MB · Images max 20 MB · MP4, MOV, JPG, PNG</p>
              </div>
              {mediaFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {mediaFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-surface rounded-xl border border-gray-100">
                      <span className="text-sm text-dark flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-muted flex-shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button type="button" onClick={() => removeMedia(i)}
                        className="p-1 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting || loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit for Approval'}
            </button>
          </form>
        </div>

        {/* Recent uploads */}
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FileUp className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-base">Your Submissions</h2>
            <span className="ml-auto text-xs text-muted">{pastResults.length} total</span>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
          ) : pastResults.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">You haven't uploaded any reports yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {pastResults.map(res => (
                <div key={res.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-dark text-sm truncate">{res.title}</h3>
                      {res.report_type && res.report_type !== 'pdf-link' && (
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
                          {res.report_type === 'bi-weekly' ? 'Bi-Weekly Report' : res.report_type === 'end-of-ip' ? 'End of IP' : 'PDF Upload'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{res.students?.first_name} {res.students?.last_name} · {new Date(res.created_at).toLocaleDateString()}</p>
                    {res.status === 'rejected' && res.rejection_message && (
                      <div className="bg-red-50 text-red-600 text-xs p-2 rounded-lg mt-2 border border-red-100">
                        <strong>Rejected:</strong> {res.rejection_message}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {res.status === 'approved' && <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>}
                    {res.status === 'pending' && <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending Review</span>}
                    {res.status === 'rejected' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full"><XCircle className="w-3.5 h-3.5" /> Rejected</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

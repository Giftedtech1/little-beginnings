import { useState, useRef } from 'react'
import { Upload, Loader2, CheckCircle, X, Video, Copy, Check, AlertCircle } from 'lucide-react'
import { uploadVideo } from '../services/videoService'
import { getStudents } from '../services/studentService'
import { useEffect } from 'react'

const MAX_SIZE_MB = 25
const MAX_SIZE_B  = MAX_SIZE_MB * 1024 * 1024

const COURSES = [
  'Communication and Language Therapy',
  'Occupational Therapy',
  'Physiotherapy',
  'Applied Behaviour Analysis (ABA)',
  'Special Education',
  'Feeding Therapy',
  'Sensory Integration',
  'Other',
]

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function UploadVideo() {
  const [file, setFile]           = useState(null)
  const [title, setTitle]         = useState('')
  const [course, setCourse]       = useState('')
  const [studentId, setStudentId] = useState('')
  const [students, setStudents]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [successUrl, setSuccessUrl] = useState(null)
  const [error, setError]         = useState('')
  const [copied, setCopied]       = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    getStudents().then(setStudents).catch(console.error)
  }, [])

  const sizeOk = file ? file.size <= MAX_SIZE_B : true

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('video/')) { setError('Please select a video file.'); return }
    setFile(f)
    setError('')
    setSuccessUrl(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile({ target: { files: [f] } })
  }

  const handleCopy = async () => {
    if (!successUrl) return
    await navigator.clipboard.writeText(successUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title || !studentId) { setError('Please fill in all required fields.'); return }
    if (!sizeOk) { setError(`File is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`); return }

    setUploading(true)
    setError('')
    setSuccessUrl(null)

    try {
      const record = await uploadVideo({ file, title, course, studentId })
      setSuccessUrl(record.url)
      setFile(null)
      setTitle('')
      setCourse('')
      setStudentId('')
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="font-display font-extrabold text-2xl text-dark mb-1">Upload Session Video</h1>
        <p className="text-muted text-sm mb-8">Upload a recorded therapy session for a student. Max 25 MB.</p>

        <div className="bg-white rounded-3xl shadow-card p-8 space-y-6">

          {/* Success banner */}
          {successUrl && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Video uploaded successfully!
              </div>
              <p className="text-xs text-green-600 mb-2 font-medium">Download link:</p>
              <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-3 py-2">
                <span className="text-xs text-gray-600 flex-1 truncate">{successUrl}</span>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-1.5 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Drop Zone */}
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  file && !sizeOk
                    ? 'border-red-400 bg-red-50'
                    : file
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFile}
                  id="video-file-input"
                />
                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 font-semibold text-sm text-dark">
                      <Video className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                    <p className={`text-xs font-bold ${sizeOk ? 'text-muted' : 'text-red-500'}`}>
                      {formatBytes(file.size)}
                      {!sizeOk && ` — exceeds ${MAX_SIZE_MB} MB limit`}
                    </p>
                    {/* Size bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 mx-auto max-w-xs">
                      <div
                        className={`h-1.5 rounded-full transition-all ${sizeOk ? 'bg-primary' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((file.size / MAX_SIZE_B) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted">Click or drag & drop a video file</p>
                    <p className="text-xs text-muted/60 mt-1">MP4, MOV, WebM · Max {MAX_SIZE_MB} MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Student */}
            <div>
              <label htmlFor="student-select" className="block text-sm font-semibold text-dark mb-1.5">
                Student <span className="text-red-400">*</span>
              </label>
              <select
                id="student-select"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="">-- Select Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name}{s.student_id ? ` (#${s.student_id})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="video-title" className="block text-sm font-semibold text-dark mb-1.5">
                Session Title <span className="text-red-400">*</span>
              </label>
              <input
                id="video-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Week 4 Speech Session"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Course */}
            <div>
              <label htmlFor="course-select" className="block text-sm font-semibold text-dark mb-1.5">
                Course / Therapy Type
              </label>
              <select
                id="course-select"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="">-- Select Course (optional) --</option>
                {COURSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || (file && !sizeOk)}
              id="upload-video-btn"
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

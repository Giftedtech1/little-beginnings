import { X, FileText, ExternalLink, Video, MessageSquare, Download, Printer, User, Calendar, Activity } from 'lucide-react'
import seal from '../assets/shool seal.png'

// ── PDF print utility ───────────────────────────────────────────────────────
function printReport(result) {
  const meta = REPORT_META[result.report_type] || REPORT_META['pdf-link']
  const studentName = result.students ? `${result.students.first_name} ${result.students.last_name}` : ''
  const period = result.form_data?.period || ''
  const data = result.form_data || {}

  let bodyHtml = ''
  
  if (result.report_type === 'bi-weekly' || result.report_type === 'end-of-ip') {
    if (data.domains) {
      // New format (Domain builder)
      const SCORE_LABEL = { SW:'Started Working', E:'Emerging', MP:'Making Progress', M:'Mastered' }
      bodyHtml = `<div class="legend">${Object.entries(SCORE_LABEL).map(([k,v])=>`<span class="badge badge-${k}">${k} = ${v}</span>`).join('')}</div>`
      bodyHtml += (data.domains||[]).map(d=>`
        <div class="section">
          <div class="domain-title">${d.name||'Unnamed Domain'}</div>
          <table><thead><tr><th>Goal / Skill</th><th>Score</th></tr></thead><tbody>
            ${(d.items||[]).map(i=>`<tr><td>${i.name}</td><td><span class="badge badge-${i.score}">${i.score}</span></td></tr>`).join('')}
          </tbody></table>
        </div>`).join('')
      if (data.generalComments) bodyHtml += `<div class="section comments"><strong>General Comments</strong><p>${data.generalComments}</p></div>`
    } else if (data.categories) {
      // Legacy Bi-Weekly
      const filled = (data.categories || []).filter(c => c.notes?.trim())
      bodyHtml = filled.map((c, i) => `
        <div class="section">
          <div class="section-title"><span class="num">${i+1}</span>${c.name}</div>
          <p>${c.notes.replace(/\n/g,'<br/>')}</p>
        </div>`).join('')
      if (data.generalComments) bodyHtml += `<div class="section comments"><strong>General Comments</strong><p>${data.generalComments}</p></div>`
    }
  } else {
    bodyHtml = `<p>PDF Document: <a href="${result.file_url}">${result.file_url}</a></p>`
  }

  const win = window.open('', '_blank')
  win.document.write(`<!DOCTYPE html><html><head><title>${result.title}</title><style>
    *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;color:#0a1c2b;padding:40px;max-width:760px;margin:auto}
    h1{font-size:22px;font-weight:800;margin-bottom:4px}p.sub{color:#4A7A7A;font-size:13px;margin-bottom:24px}
    .pill{display:inline-block;background:#d1ecf7;color:#016a91;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-right:8px;margin-bottom:16px}
    .section{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:16px}
    .section-title{background:#f0fafa;padding:10px 16px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #e5e7eb}
    .num{background:#0192c6;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0}
    .section p{padding:12px 16px;font-size:13px;line-height:1.7;color:#374151}
    .domain-title{background:#f0fafa;padding:10px 16px;font-weight:700;font-size:14px;border-bottom:1px solid #e5e7eb}
    table{width:100%;border-collapse:collapse}td,th{padding:9px 16px;font-size:12px;text-align:left;border-bottom:1px solid #f3f4f6}
    th{background:#f9fafb;font-weight:700;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
    .badge{display:inline-block;font-weight:800;font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid}
    .badge-SW{background:#f1f5f9;color:#475569;border-color:#cbd5e1}.badge-E{background:#fffbeb;color:#b45309;border-color:#fcd34d}
    .badge-MP{background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe}.badge-M{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0}
    .legend{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
    .comments{background:#f0fafa}.comments strong{display:block;padding:10px 16px;font-size:13px;border-bottom:1px solid #e5e7eb}
    .stamp-container{display:flex;justify-content:flex-end;margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb}
    .stamp-img{width:110px;height:110px;object-fit:contain;mix-blend-mode:multiply}
    body::before{content:'';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background-image:url('${seal}');background-size:contain;background-repeat:no-repeat;background-position:center;opacity:0.04;pointer-events:none;z-index:9999}
    @media print{body::before{opacity:0.06;}}
    @media print{body{padding:20px}}
  </style></head><body>
    <div class="pill">${meta.label}</div>${period?`<div class="pill">${period}</div>`:''}
    <h1>${result.title}</h1>
    ${studentName?`<p class="sub">${studentName}</p>`:''}
    ${bodyHtml}
    <div class="stamp-container">
      <img src="${seal}" class="stamp-img" alt="Official Seal" />
    </div>
  </body></html>`)
  win.document.close()
  win.focus()
  setTimeout(()=>win.print(), 400)
}

// ── Score badge config ──────────────────────────────────────────────────────
const SCORE_META = {
  SW: { label: 'Started Working', bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200' },
  E:  { label: 'Emerging',        bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200' },
  MP: { label: 'Making Progress', bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200'  },
  M:  { label: 'Mastered',        bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
}

const REPORT_META = {
  'pdf-upload':      { label: 'PDF Document',    pill: 'bg-accent/10 text-accent-dark' },
  'pdf-link':        { label: 'PDF Link',        pill: 'bg-slate-100 text-slate-600' },
  'bi-weekly':       { label: 'Bi-Weekly Report',pill: 'bg-primary/10 text-primary' },
  'end-of-ip':       { label: 'End of IP Report',pill: 'bg-accent/10 text-[#016a91]' },
}

// ── Sub-components ──────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  if (!score) return null
  const s = SCORE_META[score] || SCORE_META.SW
  return (
    <span className={`inline-flex text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${s.bg} ${s.text} ${s.border}`}>
      {score}
    </span>
  )
}

function ScoreLegend() {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-surface rounded-xl mb-5">
      {Object.entries(SCORE_META).map(([k, s]) => (
        <span key={k} className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${s.bg} ${s.text}`}>
          <strong>{k}</strong> — {s.label}
        </span>
      ))}
    </div>
  )
}

function StudentInfoCard({ student, teacherName, createdAt }) {
  if (!student) return null
  
  const calculateAge = (dob) => {
    if (!dob) return null
    const diff = new Date() - new Date(dob)
    const age = new Date(diff).getFullYear() - 1970
    return age > 0 ? `${age} years old` : 'Infant'
  }

  const age = calculateAge(student.date_of_birth)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-lg">
          {student.first_name?.[0]}{student.last_name?.[0]}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-dark text-lg leading-none">{student.first_name} {student.last_name}</h3>
            {student.student_id && (
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">#{student.student_id}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            {student.program && (
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {student.program}</span>
            )}
            {age && (
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {age}</span>
            )}
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {teacherName || 'Teacher'}</span>
          </div>
        </div>
      </div>
      <div className="text-right sm:text-left text-xs text-muted font-medium bg-surface px-3 py-1.5 rounded-lg">
        Submitted: {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}

// ── Views ───────────────────────────────────────────────────────────────────

function PdfUploadView({ result }) {
  const fileInfo = result.file_info || {}
  const fileName = fileInfo.name || 'document.pdf'
  const fileSize = fileInfo.size ? `${(fileInfo.size / 1024 / 1024).toFixed(2)} MB` : 'PDF Document'

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center shadow-inner">
        <FileText className="w-12 h-12 text-accent-dark" />
      </div>
      <div className="text-center max-w-sm px-6">
        <p className="font-display font-extrabold text-dark text-xl mb-2">{fileName}</p>
        <p className="text-muted text-sm mb-6">{fileSize} • Uploaded {new Date(result.created_at).toLocaleDateString()}</p>
        
        <a href={result.file_url} target="_blank" rel="noreferrer" download 
           className="btn-primary w-full justify-center flex items-center gap-2 shadow-lg shadow-primary/20">
          <Download className="w-5 h-5" /> Download Report
        </a>
      </div>
    </div>
  )
}

function PdfLinkView({ result }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
        <FileText className="w-10 h-10 text-primary" />
      </div>
      <div className="text-center">
        <p className="font-bold text-dark text-lg mb-1">PDF Link</p>
        <p className="text-muted text-sm">Click to open the linked document in a new tab.</p>
      </div>
      <a href={result.file_url} target="_blank" rel="noreferrer" className="btn-primary">
        <ExternalLink className="w-4 h-4" /> Open Link
      </a>
    </div>
  )
}

function LegacyBiWeeklyView({ result }) {
  const data = result.form_data || {}
  const filled = (data.categories || []).filter(c => c.notes?.trim())
  if (!filled.length && !data.generalComments) return <p className="text-muted text-sm text-center py-12">No content recorded.</p>
  return (
    <div className="space-y-3">
      {filled.map((cat, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-surface border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-extrabold text-primary">{i + 1}</span>
            </div>
            <h3 className="text-sm font-bold text-dark">{cat.name}</h3>
          </div>
          <div className="px-5 py-4"><p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{cat.notes}</p></div>
        </div>
      ))}
      {data.generalComments && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden p-5 mt-6">
          <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> General Comments
          </h3>
          <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{data.generalComments}</p>
        </div>
      )}
    </div>
  )
}

function DomainReportView({ result }) {
  const data = result.form_data || {}
  const domains = data.domains || []
  if (!domains.length && !data.generalComments) return <p className="text-muted text-sm text-center py-12">No domains defined.</p>
  return (
    <div className="space-y-5">
      <ScoreLegend />
      {domains.map((domain, di) => (
        <div key={domain.id || di} className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100">
            <h3 className="font-display font-bold text-dark">{domain.name || 'Unnamed Domain'}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {(domain.items || []).map((item, ii) => (
              <div key={item.id || ii} className="flex items-center justify-between px-5 py-3 hover:bg-surface transition-colors bg-white">
                <span className="text-sm text-dark font-medium flex-1 mr-4">{item.name}</span>
                <ScoreBadge score={item.score} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.generalComments && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mt-6">
          <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> General Comments
          </h3>
          <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{data.generalComments}</p>
        </div>
      )}
    </div>
  )
}

function MediaGallery({ mediaUrls }) {
  if (!mediaUrls?.length) return null
  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h3 className="font-display font-bold text-dark mb-4 flex items-center gap-2">
        <Video className="w-4 h-4 text-primary" />
        Attached Media <span className="font-normal text-muted text-sm">({mediaUrls.length} file{mediaUrls.length !== 1 ? 's' : ''})</span>
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {mediaUrls.map((media, i) => {
          const isVideo = media.type?.startsWith('video/') || /\.(mp4|webm|mov|avi)$/i.test(media.url)
          const isImage = media.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(media.url)
          return (
            <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden bg-surface">
              {isVideo ? (
                <video controls className="w-full max-h-56 bg-black" preload="metadata">
                  <source src={media.url} type={media.type || 'video/mp4'} />
                </video>
              ) : isImage ? (
                <img src={media.url} alt={media.name} className="w-full max-h-56 object-cover" />
              ) : (
                <a href={media.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-4 hover:bg-white transition-colors">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-dark truncate flex-1">{media.name}</span>
                  <ExternalLink className="w-4 h-4 text-muted flex-shrink-0" />
                </a>
              )}
              <div className="flex items-center justify-between px-4 py-2">
                <p className="text-xs text-muted truncate flex-1">{media.name}</p>
                <a href={media.url} download={media.name} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors ml-2 flex-shrink-0">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ReportViewerModal({ result, onClose }) {
  if (!result) return null

  const meta   = REPORT_META[result.report_type] || REPORT_META['pdf-link']
  const period = result.form_data?.period
  
  const teacherName = result.uploaded_by_profile 
    ? `${result.uploaded_by_profile.first_name} ${result.uploaded_by_profile.last_name}`
    : result.profiles 
      ? `${result.profiles.first_name} ${result.profiles.last_name}`
      : 'Teacher'

  const data = result.form_data || {}

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl animate-[fadeInUp_0.2s_ease] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 py-5 border-b border-gray-100 flex items-start justify-between gap-4 bg-white flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.pill}`}>{meta.label}</span>
              {period && <span className="text-xs text-muted font-medium bg-gray-100 px-2 py-0.5 rounded-full">{period}</span>}
            </div>
            <h2 className="font-display font-extrabold text-2xl text-dark leading-tight">{result.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {['bi-weekly', 'end-of-ip'].includes(result.report_type) && (
              <button onClick={() => printReport(result)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-xl transition-colors">
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Close report">
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-4 py-6 sm:px-7">
          <StudentInfoCard 
            student={result.students} 
            teacherName={teacherName} 
            createdAt={result.created_at} 
          />

          {(result.report_type === 'bi-weekly' || result.report_type === 'end-of-ip') && (
            data.domains ? <DomainReportView result={result} /> : <LegacyBiWeeklyView result={result} />
          )}
          {result.report_type === 'pdf-upload'      && <PdfUploadView result={result} />}
          {result.report_type === 'pdf-link'        && <PdfLinkView result={result} />}
          
          <MediaGallery mediaUrls={result.media_urls} />
        </div>
      </div>
    </div>
  )
}

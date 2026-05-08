import { motion } from 'framer-motion'
import { X, User, HeartPulse, PhoneCall, Link as LinkIcon, Calendar, Hash, BookOpen } from 'lucide-react'

function calcAge(dob) {
  if (!dob) return '—'
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value || <span className="text-gray-300 font-normal">Not recorded</span>}</span>
    </div>
  )
}

export default function StudentProfileModal({ student, onClose }) {
  if (!student) return null

  const age = calcAge(student.date_of_birth)
  const parent = student.linked_parent

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-dark">
                {student.first_name} {student.last_name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md tracking-widest">
                  #{student.student_id ?? '----'}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200 bg-white text-gray-600">
                  {student.enrollment_status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">

          {/* Basic Info */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              <User className="w-3.5 h-3.5" /> Basic Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Age" value={`${age} years old`} />
              <Field label="Date of Birth" value={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : null} />
              <Field label="Sex" value={student.sex} />
              <Field label="Program" value={student.program} />
              <Field label="Therapist" value={student.therapist} />
              <Field label="Enrolled" value={student.created_at ? new Date(student.created_at).toLocaleDateString() : null} />
            </div>
          </section>

          {/* Medical Info */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              <HeartPulse className="w-3.5 h-3.5" /> Medical Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Blood Group" value={student.blood_group} />
              <Field label="Genotype" value={student.genotype} />
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              <PhoneCall className="w-3.5 h-3.5" /> Emergency Contact
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Name" value={student.emergency_contact_name} />
              <Field label="Phone" value={student.emergency_contact_phone} />
              <Field label="Relationship" value={student.emergency_contact_relationship} />
            </div>
          </section>

          {/* Linked Parent */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              <LinkIcon className="w-3.5 h-3.5" /> Linked Parent / Guardian
            </h3>
            {parent ? (
              <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-dark text-sm">{parent.first_name} {parent.last_name}</p>
                  <a href={`mailto:${parent.email}`} className="text-xs text-blue-600 hover:underline font-medium">{parent.email}</a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700 font-medium">
                <LinkIcon className="w-4 h-4 flex-shrink-0" />
                No parent linked yet. Use "Link Family" to connect a parent account.
              </div>
            )}
          </section>

        </div>
      </motion.div>
    </div>
  )
}

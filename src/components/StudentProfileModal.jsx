import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, User, HeartPulse, PhoneCall, Link as LinkIcon, Calendar, Hash, BookOpen, Pencil } from 'lucide-react'
import { updateStudent } from '../services/studentService'
import { useToast } from '../context/ToastContext'

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

export default function StudentProfileModal({ student, onClose, onUpdate }) {
  const toast = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    sex: '',
    program: '',
    therapist: '',
    enrollment_status: '',
    blood_group: '',
    genotype: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: ''
  })

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        date_of_birth: student.date_of_birth || '',
        sex: student.sex || '',
        program: student.program || '',
        therapist: student.therapist || '',
        enrollment_status: student.enrollment_status || 'Enrolled',
        blood_group: student.blood_group || '',
        genotype: student.genotype || '',
        emergency_contact_name: student.emergency_contact_name || '',
        emergency_contact_phone: student.emergency_contact_phone || '',
        emergency_contact_relationship: student.emergency_contact_relationship || ''
      })
      setIsEditing(false) // Reset edit mode on student change
    }
  }, [student])

  if (!student) return null

  const age = calcAge(student.date_of_birth)
  const parent = student.linked_parent

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const updated = await updateStudent(student.id, formData)
      toast.success("Student profile updated successfully!")
      if (onUpdate) {
        onUpdate(updated)
      }
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update student profile: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white text-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200"
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
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-gray-500 flex items-center gap-1.5 font-semibold text-sm"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-y-auto custom-scrollbar p-6 space-y-6 flex-1 text-gray-900 bg-white">

            {/* Basic Info */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                <User className="w-3.5 h-3.5" /> Basic Information
              </h3>
              
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Name</label>
                    <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                    <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                    <input required type="date" max={new Date().toISOString().split('T')[0]} value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sex</label>
                    <select value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                      <option value="">-- Select --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Program Structure</label>
                    <select value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                      <option value="">-- Select Program --</option>
                      <option value="Amethyst">Amethyst</option>
                      <option value="Diamond-Full">Diamond-Full</option>
                      <option value="Diamond-Blended">Diamond-Blended</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Therapist</label>
                    <input type="text" value={formData.therapist} onChange={e => setFormData({...formData, therapist: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment Status</label>
                    <select value={formData.enrollment_status} onChange={e => setFormData({...formData, enrollment_status: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                      <option value="Enrolled">Enrolled</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="Age" value={`${age} years old`} />
                  <Field label="Date of Birth" value={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : null} />
                  <Field label="Sex" value={student.sex} />
                  <Field label="Program Structure" value={student.program} />
                  <Field label="Therapist" value={student.therapist} />
                  <Field label="Enrolled" value={student.created_at ? new Date(student.created_at).toLocaleDateString() : null} />
                </div>
              )}
            </section>

            {/* Medical Info */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                <HeartPulse className="w-3.5 h-3.5" /> Medical Information
              </h3>
              
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</label>
                    <select value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                      <option value="">-- Select --</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Genotype</label>
                    <select value={formData.genotype} onChange={e => setFormData({...formData, genotype: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                      <option value="">-- Select --</option>
                      {['AA','AS','AC','SS','SC'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="Blood Group" value={student.blood_group} />
                  <Field label="Genotype" value={student.genotype} />
                </div>
              )}
            </section>

            {/* Emergency Contact */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                <PhoneCall className="w-3.5 h-3.5" /> Emergency Contact
              </h3>
              
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Name</label>
                    <input type="text" value={formData.emergency_contact_name} onChange={e => setFormData({...formData, emergency_contact_name: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                    <input type="tel" value={formData.emergency_contact_phone} onChange={e => setFormData({...formData, emergency_contact_phone: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relationship</label>
                    <input type="text" value={formData.emergency_contact_relationship} onChange={e => setFormData({...formData, emergency_contact_relationship: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" placeholder="e.g. Uncle" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="Name" value={student.emergency_contact_name} />
                  <Field label="Phone" value={student.emergency_contact_phone} />
                  <Field label="Relationship" value={student.emergency_contact_relationship} />
                </div>
              )}
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

          {isEditing && (
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 rounded-xl transition-all animate-none"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 btn-primary justify-center disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  )
}

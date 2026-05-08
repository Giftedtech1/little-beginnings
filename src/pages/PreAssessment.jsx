import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, BookOpen, Send } from 'lucide-react'
import logo from '../assets/new logo.png'
import seal from '../assets/shool seal.png'
import { submitPreAssessment } from '../services/assessmentService'

const HISTORY_STEPS = [
  { id: 1, title: 'Intervention History' },
  { id: 2, title: 'Biodata & Concerns' }
]

const PRE_INT_STEPS = [
  { id: 3, title: 'Medical History' },
  { id: 4, title: 'Development & Schedule' },
  { id: 5, title: 'Behavior & Self-Care' }
]

export default function PreAssessment() {
  const [view, setView] = useState('dashboard') // 'dashboard', 'history', 'pre_intervention'
  const [step, setStep] = useState(1)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  
  // Track completion
  const [historyCompleted, setHistoryCompleted] = useState(false)
  const [preIntCompleted, setPreIntCompleted] = useState(false)

  const [formData, setFormData] = useState({
    child_name: '',
    parent_email: '',
    history_data: {},
    pre_intervention_data: {}
  })

  const [accessCode, setAccessCode] = useState('')
  useEffect(() => {
    const code = sessionStorage.getItem('lb_access_code')
    if (code) setAccessCode(code)
  }, [])

  const handleNext = (e) => {
    e.preventDefault()
    if (view === 'history' && step === 2) {
      setHistoryCompleted(true)
      setView('dashboard')
    } else if (view === 'pre_intervention' && step === 5) {
      setPreIntCompleted(true)
      setView('dashboard')
    } else {
      setStep(s => s + 1)
    }
  }
  const handlePrev = () => setStep(s => s - 1)

  const handleSubmitAll = async () => {
    if (!formData.child_name || !formData.parent_email) {
      setError("Please provide the Child's Name and Parent Email on the dashboard before submitting.")
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      await submitPreAssessment({
        access_code: accessCode,
        child_name: formData.child_name,
        parent_email: formData.parent_email,
        history_data: formData.history_data,
        pre_intervention_data: formData.pre_intervention_data
      })
      
      sessionStorage.removeItem('lb_access_code')
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'An error occurred while submitting.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-2xl rounded-3xl border border-gray-100 relative overflow-hidden">
          {/* Decorative Seal */}
          <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
            <img src={seal} alt="Seal" className="w-64 h-64 object-contain grayscale" />
          </div>
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display font-extrabold text-2xl mb-3 text-dark relative z-10">Assessment Submitted!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
            Thank you for providing this detailed information. Our SEN team will review your submission and be in touch shortly.
          </p>
          <Link to="/" className="btn-primary py-3 px-8 rounded-xl font-bold inline-block relative z-10">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-2 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          {view === 'dashboard' ? (
            <Link to="/admissions" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand font-bold text-sm transition-colors uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Exit
            </Link>
          ) : (
            <button onClick={() => setView('dashboard')} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand font-bold text-sm transition-colors uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          )}
          <img src={logo} alt="Little Beginnings" className="h-10 opacity-50" />
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white shadow-xl rounded-3xl p-8 sm:p-12 border border-gray-100 text-center">
              <h1 className="font-display font-extrabold text-3xl text-dark mb-4">Pre-Assessment Portal</h1>
              <p className="text-gray-500 max-w-2xl mx-auto mb-10">
                Please provide your basic details below, and then select which form(s) you need to complete. 
                You can fill out either one or both. When you are completely finished, click <strong>Submit All</strong>.
              </p>

              {/* Basic Info (Required) */}
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12 text-left bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Child's Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.child_name} onChange={e => setFormData({...formData, child_name: e.target.value})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Parent Email <span className="text-red-500">*</span></label>
                  <input type="email" required value={formData.parent_email} onChange={e => setFormData({...formData, parent_email: e.target.value})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none" />
                </div>
              </div>

              {/* Forms Selection */}
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                <button 
                  onClick={() => { setView('history'); setStep(1); }}
                  className={`text-left p-6 rounded-2xl border-2 transition-all relative ${historyCompleted ? 'bg-green-50 border-green-200 hover:border-green-300' : 'bg-white border-gray-200 hover:border-brand shadow-sm'}`}
                >
                  {historyCompleted && <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Saved</div>}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${historyCompleted ? 'bg-green-100 text-green-600' : 'bg-teal-50 text-brand'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-dark mb-2">Intervention History</h3>
                  <p className="text-sm text-gray-500 font-sans">Details about previous diagnoses, evaluations, and interventions.</p>
                </button>

                <button 
                  onClick={() => { setView('pre_intervention'); setStep(3); }}
                  className={`text-left p-6 rounded-2xl border-2 transition-all relative ${preIntCompleted ? 'bg-green-50 border-green-200 hover:border-green-300' : 'bg-white border-gray-200 hover:border-brand shadow-sm'}`}
                >
                  {preIntCompleted && <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Saved</div>}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${preIntCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-dark mb-2">Pre-Intervention Form</h3>
                  <p className="text-sm text-gray-500 font-sans">Comprehensive medical, developmental, and behavioral history.</p>
                </button>
              </div>

              {error && <p className="text-red-500 font-bold text-sm mb-4">{error}</p>}

              <button 
                onClick={handleSubmitAll}
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-primary py-4 px-12 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto disabled:opacity-50 text-white shadow-lg shadow-brand/30"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>Finish & Submit All Forms <Send className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Forms View */}
        {view !== 'dashboard' && (
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
            {/* Steps Progress */}
            <div className="bg-brand/5 border-b border-brand/10 p-4 sm:px-8 flex flex-wrap justify-between items-center text-xs font-bold uppercase tracking-widest text-brand/60">
              {(view === 'history' ? HISTORY_STEPS : PRE_INT_STEPS).map((s) => (
                <span key={s.id} className={step >= s.id ? 'text-brand' : 'hidden sm:inline opacity-50'}>
                  {step === s.id && <span className="mr-2 text-brand">▶</span>}
                  {s.title}
                </span>
              ))}
              <span className="sm:hidden text-brand">Part {step}</span>
            </div>

            <div className="p-6 sm:p-12">
              <form onSubmit={handleNext}>
                
                {/* STEP 1: INTERVENTION HISTORY */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div className="border-b border-gray-100 pb-4 mb-6 text-center">
                      <h3 className="font-display font-extrabold text-2xl text-dark tracking-wide uppercase">Part 1: Intervention History</h3>
                    </div>

                    <div className="space-y-8">
                      {/* Diagnosis */}
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h4 className="font-bold text-lg mb-4 text-brand">A. Diagnosis</h4>
                        <div className="space-y-4">
                          <label className="flex items-center gap-4 cursor-pointer">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-700">Does your child currently have a diagnosis?</span>
                            <select 
                              value={formData.history_data.has_diagnosis || ''} 
                              onChange={e => setFormData({...formData, history_data: {...formData.history_data, has_diagnosis: e.target.value}})}
                              className="bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none font-bold"
                            >
                              <option value="">Select...</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </label>
                          
                          {formData.history_data.has_diagnosis === 'Yes' && (
                            <div className="grid sm:grid-cols-2 gap-4 pt-4">
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Please provide diagnosis</label>
                                <input type="text" value={formData.history_data.diagnosis_name || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, diagnosis_name: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Who diagnosed your child? (Name)</label>
                                <input type="text" value={formData.history_data.diagnoser_name || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, diagnoser_name: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Agency</label>
                                <input type="text" value={formData.history_data.diagnoser_agency || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, diagnoser_agency: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number</label>
                                <input type="text" value={formData.history_data.diagnoser_phone || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, diagnoser_phone: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Date of Diagnosis</label>
                                <input type="date" value={formData.history_data.diagnosis_date || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, diagnosis_date: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none text-gray-600" />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Why did you get an evaluation?</label>
                                <textarea value={formData.history_data.evaluation_reason || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, evaluation_reason: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Evaluations */}
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h4 className="font-bold text-lg mb-4 text-brand">B. Previous Evaluations / Interventions</h4>
                        <p className="text-sm text-gray-500 mb-6 font-bold">Please reply only if your child received an evaluation in any of these areas:</p>
                        
                        {[
                          { id: 'speech', label: '1. Speech and Language' },
                          { id: 'occupational', label: '2. Occupational Therapy' },
                          { id: 'physical', label: '3. Physical Therapy' },
                          { id: 'other_eval', label: '4. Others Not Mentioned' }
                        ].map(evalField => (
                          <div key={evalField.id} className="mb-8 border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                            <label className="flex items-center gap-3 mb-4 cursor-pointer">
                              <input type="checkbox" className="w-5 h-5 text-brand rounded focus:ring-brand accent-brand cursor-pointer" 
                                checked={!!formData.history_data[evalField.id]}
                                onChange={(e) => {
                                  const newHistory = { ...formData.history_data }
                                  if (e.target.checked) newHistory[evalField.id] = { active: true }
                                  else delete newHistory[evalField.id]
                                  setFormData({ ...formData, history_data: newHistory })
                                }}
                              />
                              <span className="font-bold text-lg text-dark">{evalField.label}</span>
                            </label>
                            
                            {formData.history_data[evalField.id] && (
                              <div className="grid sm:grid-cols-2 gap-4 pl-8 border-l-2 border-brand/20 ml-2">
                                {evalField.id === 'other_eval' && (
                                  <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Please Specify</label>
                                    <input type="text" value={formData.history_data[evalField.id].specify || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, [evalField.id]: {...formData.history_data[evalField.id], specify: e.target.value}}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                                  </div>
                                )}
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name of Service Provider</label>
                                  <input type="text" value={formData.history_data[evalField.id].provider || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, [evalField.id]: {...formData.history_data[evalField.id], provider: e.target.value}}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number</label>
                                  <input type="text" value={formData.history_data[evalField.id].phone || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, [evalField.id]: {...formData.history_data[evalField.id], phone: e.target.value}}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Last Assessed Date</label>
                                  <input type="text" placeholder="e.g. March 2025" value={formData.history_data[evalField.id].last_assessed || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, [evalField.id]: {...formData.history_data[evalField.id], last_assessed: e.target.value}}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Goals of Intervention</label>
                                  <textarea value={formData.history_data[evalField.id].goals || ''} onChange={e => setFormData({...formData, history_data: {...formData.history_data, [evalField.id]: {...formData.history_data[evalField.id], goals: e.target.value}}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CONCERNS */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div className="border-b border-gray-100 pb-4 mb-6 text-center">
                      <h3 className="font-display font-extrabold text-2xl text-dark tracking-wide uppercase">Part 2: Concerns</h3>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">1. What are your concerns about your child? (Detailed explanation)</label>
                        <textarea value={formData.pre_intervention_data.parent_concerns || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, parent_concerns: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none resize-none" rows="3"></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">2. What are the school's primary concerns?</label>
                        <textarea value={formData.pre_intervention_data.school_concerns || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, school_concerns: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">3. Is there any discrepancy in your impression vs the school's?</label>
                        <textarea value={formData.pre_intervention_data.discrepancy || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, discrepancy: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">4. Did either parent or relative experience the same difficulties?</label>
                        <textarea value={formData.pre_intervention_data.relative_difficulties || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, relative_difficulties: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">5. Has your family experienced any recent crisis or stress?</label>
                        <textarea value={formData.pre_intervention_data.family_crisis || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, family_crisis: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">6. What do you hope to gain from this evaluation?</label>
                        <textarea value={formData.pre_intervention_data.hopes || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, hopes: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-3 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: MEDICAL HISTORY */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div className="border-b border-gray-100 pb-4 mb-6 text-center">
                      <h3 className="font-display font-extrabold text-2xl text-dark tracking-wide uppercase">Part 3: Medical History</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Birth Weight</label>
                          <input type="text" placeholder="e.g. 7 lbs 2 oz" value={formData.pre_intervention_data.birth_weight || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, birth_weight: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Pregnancy Term</label>
                          <select value={formData.pre_intervention_data.pregnancy_term || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, pregnancy_term: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none cursor-pointer">
                            <option value="">Select...</option>
                            <option value="Full term">Full term</option>
                            <option value="Premature">Premature</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Mother's health during pregnancy / Problems encountered</label>
                        <textarea value={formData.pre_intervention_data.pregnancy_health || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, pregnancy_health: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Delivery Type</label>
                          <select value={formData.pre_intervention_data.delivery_type || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, delivery_type: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none cursor-pointer">
                            <option value="">Select...</option>
                            <option value="Vaginal">Vaginal</option>
                            <option value="Cesarean">Cesarean</option>
                            <option value="Forceps">Forceps</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Problems during labor/delivery</label>
                          <input type="text" value={formData.pre_intervention_data.labor_problems || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, labor_problems: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Neonatal History (Check all that apply)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['Jaundice', 'Cyanosis', 'Limpness', 'Stiffness', 'Congenital defects', 'Oxygen', 'Transfusions', 'Tube feedings', 'Immobilization'].map(cond => {
                            const arr = formData.pre_intervention_data.neonatal_history || [];
                            const checked = arr.includes(cond);
                            return (
                              <label key={cond} className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                                <input type="checkbox" className="accent-brand w-4 h-4" checked={checked} onChange={(e) => {
                                  const newArr = e.target.checked ? [...arr, cond] : arr.filter(i => i !== cond);
                                  setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, neonatal_history: newArr}})
                                }} />
                                {cond}
                              </label>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Were there feeding difficulties or other problems in the first month?</label>
                        <textarea value={formData.pre_intervention_data.first_month_problems || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, first_month_problems: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">List illnesses, injuries, surgeries, high fevers, seizures</label>
                        <textarea value={formData.pre_intervention_data.past_illnesses || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, past_illnesses: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">General Health at present</label>
                          <select value={formData.pre_intervention_data.general_health || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, general_health: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none cursor-pointer">
                            <option value="">Select...</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Present Medications</label>
                          <input type="text" value={formData.pre_intervention_data.medications || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, medications: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Ear Infections?</label>
                          <input type="text" placeholder="Frequency / Tubes?" value={formData.pre_intervention_data.ear_infections || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, ear_infections: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Allergies (Type)</label>
                          <input type="text" value={formData.pre_intervention_data.allergies || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, allergies: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: DEVELOPMENT & DAILY SCHEDULE */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div className="border-b border-gray-100 pb-4 mb-6 text-center">
                      <h3 className="font-display font-extrabold text-2xl text-dark tracking-wide uppercase">Part 4: Development & Daily Schedule</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                        <h4 className="font-bold text-lg text-brand">Developmental History</h4>
                        
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">General Impression of Motor Development</label>
                          <select value={formData.pre_intervention_data.motor_development || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, motor_development: e.target.value}})} className="w-full sm:w-1/2 bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none cursor-pointer">
                            <option value="">Select...</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Normal">Normal</option>
                            <option value="Slow">Slow</option>
                          </select>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Gross Motor (running, jumping)</label>
                            <textarea value={formData.pre_intervention_data.gross_motor || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, gross_motor: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Fine Motor (beading, cutting)</label>
                            <textarea value={formData.pre_intervention_data.fine_motor || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, fine_motor: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                        <h4 className="font-bold text-lg text-brand">Daily Schedule</h4>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">My child is in school/day care from</label>
                            <input type="time" value={formData.pre_intervention_data.school_from || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, school_from: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">To</label>
                            <input type="time" value={formData.pre_intervention_data.school_to || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, school_to: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Morning Routine (What factors interfere?)</label>
                          <textarea value={formData.pre_intervention_data.morning_routine || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, morning_routine: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Evening Routine / Bedtime (What delays it?)</label>
                          <textarea value={formData.pre_intervention_data.evening_routine || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, evening_routine: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">How does your child spend free time / weekends?</label>
                          <textarea value={formData.pre_intervention_data.free_time || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, free_time: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: BEHAVIOR & SELF-CARE */}
                {step === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div className="border-b border-gray-100 pb-4 mb-6 text-center">
                      <h3 className="font-display font-extrabold text-2xl text-dark tracking-wide uppercase">Part 5: Behavior & Self-Care Skills</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                        <h4 className="font-bold text-lg text-brand">Behavior & Social Skills</h4>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Who is responsible for discipline at home?</label>
                            <input type="text" value={formData.pre_intervention_data.discipline_by || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, discipline_by: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Does your child tantrum? (How often)</label>
                            <input type="text" value={formData.pre_intervention_data.tantrums || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, tantrums: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">How does your child respond to authority / structure?</label>
                          <textarea value={formData.pre_intervention_data.authority_response || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, authority_response: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Is your child attuned to social cues / group situations?</label>
                          <textarea value={formData.pre_intervention_data.social_cues || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, social_cues: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                        <h4 className="font-bold text-lg text-brand">Self-Care Skills</h4>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Eating Skills (Level of Independence)</label>
                            <textarea value={formData.pre_intervention_data.eating_skills || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, eating_skills: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Dressing Skills (Assistance needed)</label>
                            <textarea value={formData.pre_intervention_data.dressing_skills || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, dressing_skills: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Bathing / Washing (Assistance needed)</label>
                            <textarea value={formData.pre_intervention_data.bathing_skills || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, bathing_skills: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Toilet Training (Age trained for days/nights)</label>
                            <textarea value={formData.pre_intervention_data.toilet_training || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, toilet_training: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="2"></textarea>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Any other concerns or observations?</label>
                          <textarea value={formData.pre_intervention_data.other_observations || ''} onChange={e => setFormData({...formData, pre_intervention_data: {...formData.pre_intervention_data, other_observations: e.target.value}})} className="w-full bg-white border-2 border-gray-200 focus:border-brand py-2 px-4 rounded-xl outline-none resize-none" rows="3"></textarea>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col gap-4 pt-10 mt-10 border-t border-gray-100">
                  <div className="flex gap-4">
                    {((view === 'history' && step > 1) || (view === 'pre_intervention' && step > 3)) && (
                      <button type="button" onClick={handlePrev} className="px-6 py-4 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors rounded-xl flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                      </button>
                    )}
                    <button type="submit" className="flex-1 btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white">
                      {(view === 'history' && step === 2) || (view === 'pre_intervention' && step === 5) ? (
                        <>Save & Return to Dashboard <CheckCircle2 className="w-5 h-5" /></>
                      ) : (
                        <>Next Step <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

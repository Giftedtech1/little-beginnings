import { motion } from 'framer-motion'
import { X, Calendar, User, Phone, Mail, HeartPulse, PhoneCall, ShieldCheck, CreditCard, Printer } from 'lucide-react'
import letterHead from '../assets/letter_head.jpg'
import seal from '../assets/shool seal.png'

export default function AdmissionViewerModal({ admission, onClose }) {
  if (!admission) return null

  const d = admission.form_data || {}
  const medical = d.medical || { illnesses: [] }
  const contacts = d.emergency_contacts || []
  const agreements = d.agreements || {}

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:bg-white print:p-0 print:absolute print:inset-0 print:z-auto print:block">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none print:block print:w-full print:m-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-surface dark:bg-slate-800/50 print:hidden">
          <div>
            <h2 className="font-display font-bold text-2xl text-dark dark:text-white mb-1">
              {admission.child_name}'s Application
            </h2>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className={`tag ${admission.status === 'pending' ? '!bg-amber-100 !text-amber-700' : admission.status === 'accepted' ? '!bg-green-100 !text-green-700' : admission.status === 'rejected' ? '!bg-red-100 !text-red-700' : '!bg-blue-100 !text-blue-700'}`}>
                {admission.status.toUpperCase()}
              </span>
              <span className="text-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> 
                Applied: {new Date(admission.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="btn-secondary text-sm flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print Form
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-muted" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFA] dark:bg-[#061D1D] print:overflow-visible print:bg-white print:text-black print:p-8 relative">
          
          {/* Print Watermark */}
          <div className="hidden print:flex absolute inset-0 z-0 items-center justify-center overflow-hidden pointer-events-none select-none opacity-[0.04]">
            <img src={seal} alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
          </div>

          <div className="relative z-10">
            {/* Print Header (Only visible when printing) */}
          <div className="hidden print:block text-center border-b-[3px] border-black pb-4 mb-8">
            <img src={letterHead} alt="Little Beginnings Letterhead" className="w-full h-auto mb-4" />
            <h2 className="text-sm uppercase tracking-widest font-bold">Official Admission Document</h2>
            <div className="mt-4 flex justify-between text-xs text-left">
              <div><strong>Applicant:</strong> {admission.child_name}</div>
              <div><strong>Date:</strong> {new Date(admission.created_at).toLocaleDateString()}</div>
              <div><strong>Status:</strong> {admission.status.toUpperCase()}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-8 print:block">
            
            {/* Left Column */}
            <div className="space-y-6 print:break-inside-avoid">
              
              {/* Basic Info */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm print:border-black print:rounded-none print:shadow-none">
                <h3 className="font-bold text-sm text-dark dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 print:text-black">
                  <User className="w-4 h-4 text-primary print:hidden" /> Basic Information
                </h3>
                
                {admission.passport_url && (
                  <div className="mb-4 flex justify-center">
                    <img src={admission.passport_url} alt="Passport" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 print:border-black print:rounded-none" />
                  </div>
                )}
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted">Child DOB:</span>
                    <span className="font-semibold text-dark dark:text-white text-right">{new Date(admission.child_dob).toLocaleDateString()}</span>
                  </div>
                  <hr className="border-gray-50 dark:border-slate-700" />
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted">Parent Name:</span>
                    <span className="font-semibold text-dark dark:text-white text-right">{admission.parent_name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted">Phone:</span>
                    <a href={`tel:${admission.phone}`} className="font-semibold text-primary hover:underline text-right">{admission.phone}</a>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted">Email:</span>
                    <a href={`mailto:${admission.email}`} className="font-semibold text-primary hover:underline text-right truncate">{admission.email}</a>
                  </div>
                  {admission.reason_for_admission && (
                    <>
                      <hr className="border-gray-50 dark:border-slate-700" />
                      <div>
                        <span className="text-muted block mb-1">Reason for Admission:</span>
                        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-lg text-dark dark:text-gray-300 italic border border-gray-100 dark:border-slate-700">
                          "{admission.reason_for_admission}"
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-sm text-dark dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-orange-500" /> Emergency Contacts
                </h3>
                <div className="space-y-4">
                  {contacts.map((c, i) => c.name && (
                    <div key={i} className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-3 rounded-xl text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-dark dark:text-white">{c.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{c.relationship}</span>
                      </div>
                      <p className="text-muted mb-1"><Phone className="w-3 h-3 inline mr-1" />{c.phone}</p>
                      <p className="text-muted text-xs truncate">{c.address}</p>
                    </div>
                  ))}
                  {(!contacts || contacts.length === 0 || !contacts[0].name) && <p className="text-sm text-muted">No contacts provided.</p>}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Medical */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm print:border-black print:rounded-none print:shadow-none print:mt-8 print:break-inside-avoid">
                <h3 className="font-bold text-sm text-dark dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 print:text-black">
                  <HeartPulse className="w-4 h-4 text-red-500 print:hidden" /> Medical & Physician History
                </h3>
                
                <div className="space-y-3 text-sm mb-6 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700 print:bg-transparent print:border-black print:rounded-none">
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Class:</span><span className="font-semibold">{medical.class_name || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Physician:</span><span className="font-semibold">{medical.physician_name || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Physician Phone:</span><span className="font-semibold">{medical.physician_phone || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Hospital/Clinic:</span><span className="font-semibold">{medical.hospital_address || '—'}</span></div>
                  <hr className="border-gray-200 dark:border-slate-700 my-2" />
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Blood Group:</span><span className="font-semibold">{medical.blood_group || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Genotype:</span><span className="font-semibold">{medical.genotype || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Allergies:</span><span className="font-semibold text-red-600 dark:text-red-400">{medical.allergies || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Vaccinations:</span><span className="font-semibold">{medical.vaccinations_taken || '—'}</span></div>
                  <div className="grid grid-cols-2 gap-2"><span className="text-muted">Regular Meds:</span><span className="font-semibold">{medical.regular_medication || '—'}</span></div>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">Reported Illnesses</span>
                  {medical.illnesses && medical.illnesses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {medical.illnesses.map(ill => (
                        <span key={ill} className="text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-md border border-red-100 dark:border-red-900/30">
                          {ill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted">None reported.</span>
                  )}
                </div>

                {medical.other_sickness && (
                  <div className="mb-4">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">Other Sickness / Allergies</span>
                    <p className="text-sm text-dark dark:text-gray-300 bg-gray-50 dark:bg-slate-900 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                      {medical.other_sickness}
                    </p>
                  </div>
                )}

                <div className={`p-3 rounded-xl border flex items-start gap-2 ${medical.immunization_ack ? 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400' : 'bg-red-50 border-red-100 text-red-800'}`}>
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-medium">
                    {medical.immunization_ack 
                      ? "Parent acknowledged they will bring the immunization record on the first day." 
                      : "Did not acknowledge immunization record requirement."}
                  </p>
                </div>
              </div>

              {/* Consents & Agreements */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm print:border-black print:rounded-none print:shadow-none print:mt-8 print:break-inside-avoid">
                <h3 className="font-bold text-sm text-dark dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 print:text-black">
                  <ShieldCheck className="w-4 h-4 text-blue-500 print:hidden" /> Consents & Agreements
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">Tuition Program Selection</span>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-3 rounded-xl text-sm font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 print:bg-transparent print:border-black print:rounded-none print:text-black">
                      <CreditCard className="w-4 h-4 print:hidden" />
                      {agreements.tuition_program || 'Not selected'}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">Social Media Consent</span>
                    {agreements.social_media_consent === 'full' && <div className="tag !bg-green-100 !text-green-700">Full Consent Given</div>}
                    {agreements.social_media_consent === 'partial' && <div className="tag !bg-amber-100 !text-amber-700">Partial Consent (Back view / Face covered)</div>}
                    {agreements.social_media_consent === 'none' && <div className="tag !bg-red-100 !text-red-700">No Consent Given</div>}
                    {!agreements.social_media_consent && <div className="tag">Unknown</div>}
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-medium print:bg-transparent print:border-black print:rounded-none print:text-black ${agreements.payment_ack ? 'bg-gray-50 border-gray-200 text-dark dark:bg-slate-900 dark:border-slate-700 dark:text-gray-300' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    {agreements.payment_ack 
                      ? "✅ Parent agreed to the Tuition & Payment policies (including 10% late fee penalty)." 
                      : "❌ Parent did not agree to payment policies."}
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-medium print:bg-transparent print:border-black print:rounded-none print:text-black ${agreements.policies_ack ? 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-400' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    {agreements.policies_ack 
                      ? "✅ Parent acknowledged Centre Policies (daily supplies, food restrictions, late pick-up rules)." 
                      : "❌ Parent did not acknowledge centre policies."}
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
          
          {/* Footer for Print */}
          <div className="hidden print:flex justify-between items-end mt-12 pt-8 border-t border-gray-200 break-inside-avoid">
            <div className="text-left text-xs text-gray-400">
              <p>Little Beginnings Centre • 27A Dr. Ezekuse Close; Off Shakiru Anjorin Street, Lekki Phase 1, Lagos</p>
              <p>Generated on {new Date().toLocaleString()}</p>
            </div>
            <div className="text-right">
              <img src={seal} alt="School Seal" className="w-24 h-24 object-contain opacity-90 mix-blend-multiply ml-auto" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

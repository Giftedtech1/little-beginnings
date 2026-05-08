import { X, Printer, Calendar, Clock, User, Download } from 'lucide-react'
import logo from '../assets/new logo.png'
import seal from '../assets/shool seal.png'

export default function AssessmentViewerModal({ assessment, onClose }) {
  if (!assessment) return null

  const handlePrint = () => {
    window.print()
  }

  const { history_data = {}, pre_intervention_data = {} } = assessment
  
  // Helper to safely render text or "Not provided"
  const renderField = (label, value) => (
    <div className="mb-4 break-inside-avoid">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-gray-800 font-medium whitespace-pre-wrap">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
  )

  const hasHistory = Object.keys(history_data).length > 0
  const hasPreInt = Object.keys(pre_intervention_data).length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0 print:static print:inset-auto print:block">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl print:max-w-none print:max-h-none print:shadow-none print:rounded-none print:overflow-visible flex flex-col">
        
        {/* Sticky Header Actions (Hidden on Print) */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 p-4 sm:px-8 flex items-center justify-between print:hidden rounded-t-3xl">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg text-dark">Pre-Assessment Report</h2>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {new Date(assessment.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-all"
            >
              <Printer className="w-4 h-4" /> Print PDF
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 sm:p-12 print:p-0">
          
          {/* Document Header */}
          <div className="flex items-start justify-between mb-12 pb-8 border-b-2 border-gray-100 print:mb-8 print:pb-6">
            <div>
              <img src={logo} alt="Little Beginnings" className="h-12 mb-6" />
              <h1 className="font-display font-extrabold text-3xl text-dark mb-2">Pre-Assessment Data</h1>
              <p className="text-gray-500 font-medium">Submitted on {new Date(assessment.created_at).toLocaleString()}</p>
            </div>
            <div className="text-right bg-gray-50 p-4 rounded-2xl border border-gray-100 print:bg-transparent print:border-none print:p-0">
              <p className="font-bold text-xl text-brand mb-1">{assessment.child_name}</p>
              <p className="text-sm text-gray-600 font-medium">{assessment.parent_email}</p>
              <p className="text-xs text-gray-400 mt-2 font-mono">Code: {assessment.access_code}</p>
            </div>
          </div>

          {/* Intervention History Section */}
          {hasHistory && (
            <div className="mb-12 print:mb-8">
              <h2 className="font-display font-extrabold text-xl text-dark mb-6 pb-2 border-b border-gray-100 bg-gray-50 p-3 rounded-lg print:bg-transparent print:p-0">Part 1: Intervention History</h2>
              
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                {renderField("Has Diagnosis?", history_data.has_diagnosis)}
                {history_data.has_diagnosis === 'Yes' && (
                  <>
                    {renderField("Diagnosis", history_data.diagnosis_name)}
                    {renderField("Diagnoser Name", history_data.diagnoser_name)}
                    {renderField("Agency", history_data.diagnoser_agency)}
                    {renderField("Phone Number", history_data.diagnoser_phone)}
                    {renderField("Diagnosis Date", history_data.diagnosis_date)}
                    <div className="sm:col-span-2">
                      {renderField("Reason for Evaluation", history_data.evaluation_reason)}
                    </div>
                  </>
                )}
              </div>

              {/* Previous Evaluations */}
              <h3 className="font-bold text-sm text-brand uppercase tracking-widest mb-4">Previous Evaluations</h3>
              <div className="space-y-6 pl-4 border-l-2 border-brand/20">
                {['speech', 'occupational', 'physical', 'other_eval'].map(evalType => {
                  const data = history_data[evalType]
                  if (!data) return null
                  const labels = {
                    speech: 'Speech and Language',
                    occupational: 'Occupational Therapy',
                    physical: 'Physical Therapy',
                    other_eval: 'Other Interventions'
                  }
                  return (
                    <div key={evalType} className="bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-transparent print:border-l-4 print:border-gray-300 print:p-0 print:pl-4 print:rounded-none break-inside-avoid">
                      <h4 className="font-bold text-dark mb-3">{labels[evalType]}</h4>
                      <div className="grid sm:grid-cols-2 gap-x-6">
                        {evalType === 'other_eval' && renderField("Specifics", data.specify)}
                        {renderField("Provider Name", data.provider)}
                        {renderField("Phone", data.phone)}
                        {renderField("Last Assessed", data.last_assessed)}
                        <div className="sm:col-span-2">
                          {renderField("Goals of Intervention", data.goals)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pre-Intervention Section */}
          {hasPreInt && (
            <div className="mb-12 print:mb-8">
              <h2 className="font-display font-extrabold text-xl text-dark mb-6 pb-2 border-b border-gray-100 bg-gray-50 p-3 rounded-lg print:bg-transparent print:p-0">Part 2: Pre-Intervention Data</h2>
              
              <div className="space-y-10">
                
                {/* Concerns */}
                <div>
                  <h3 className="font-bold text-sm text-brand uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Concerns</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8">
                    {renderField("Parent Concerns", pre_intervention_data.parent_concerns)}
                    {renderField("School Concerns", pre_intervention_data.school_concerns)}
                    {renderField("Discrepancies", pre_intervention_data.discrepancy)}
                    {renderField("Relative Difficulties", pre_intervention_data.relative_difficulties)}
                    {renderField("Family Crisis/Stress", pre_intervention_data.family_crisis)}
                    {renderField("Hopes for Evaluation", pre_intervention_data.hopes)}
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="font-bold text-sm text-brand uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Medical & Neonatal History</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8">
                    {renderField("Birth Weight", pre_intervention_data.birth_weight)}
                    {renderField("Pregnancy Term", pre_intervention_data.pregnancy_term)}
                    <div className="sm:col-span-2">{renderField("Pregnancy Health/Problems", pre_intervention_data.pregnancy_health)}</div>
                    {renderField("Delivery Type", pre_intervention_data.delivery_type)}
                    {renderField("Labor Problems", pre_intervention_data.labor_problems)}
                    
                    <div className="sm:col-span-2 mb-4 break-inside-avoid">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Neonatal Conditions</p>
                      {pre_intervention_data.neonatal_history && pre_intervention_data.neonatal_history.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {pre_intervention_data.neonatal_history.map(cond => (
                            <span key={cond} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">{cond}</span>
                          ))}
                        </div>
                      ) : <span className="text-gray-400 italic text-sm">None reported</span>}
                    </div>

                    <div className="sm:col-span-2">{renderField("First Month Feeding/Problems", pre_intervention_data.first_month_problems)}</div>
                    <div className="sm:col-span-2">{renderField("Past Illnesses/Surgeries", pre_intervention_data.past_illnesses)}</div>
                    
                    {renderField("General Health", pre_intervention_data.general_health)}
                    {renderField("Medications", pre_intervention_data.medications)}
                    {renderField("Ear Infections", pre_intervention_data.ear_infections)}
                    {renderField("Allergies", pre_intervention_data.allergies)}
                  </div>
                </div>

                {/* Development & Schedule */}
                <div>
                  <h3 className="font-bold text-sm text-brand uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Development & Schedule</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8">
                    {renderField("Motor Development", pre_intervention_data.motor_development)}
                    <div className="sm:col-span-2">{renderField("Gross Motor Skills", pre_intervention_data.gross_motor)}</div>
                    <div className="sm:col-span-2">{renderField("Fine Motor Skills", pre_intervention_data.fine_motor)}</div>
                    {renderField("School Hours", `${pre_intervention_data.school_from || 'N/A'} - ${pre_intervention_data.school_to || 'N/A'}`)}
                    <div className="sm:col-span-2">{renderField("Morning Routine", pre_intervention_data.morning_routine)}</div>
                    <div className="sm:col-span-2">{renderField("Evening Routine", pre_intervention_data.evening_routine)}</div>
                    <div className="sm:col-span-2">{renderField("Free Time / Weekends", pre_intervention_data.free_time)}</div>
                  </div>
                </div>

                {/* Behavior & Self-Care */}
                <div>
                  <h3 className="font-bold text-sm text-brand uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Behavior & Self-Care</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8">
                    {renderField("Disciplinarian at Home", pre_intervention_data.discipline_by)}
                    {renderField("Tantrums Frequency", pre_intervention_data.tantrums)}
                    <div className="sm:col-span-2">{renderField("Response to Authority", pre_intervention_data.authority_response)}</div>
                    <div className="sm:col-span-2">{renderField("Social Cues / Groups", pre_intervention_data.social_cues)}</div>
                    {renderField("Eating Skills", pre_intervention_data.eating_skills)}
                    {renderField("Dressing Skills", pre_intervention_data.dressing_skills)}
                    {renderField("Bathing Skills", pre_intervention_data.bathing_skills)}
                    {renderField("Toilet Training", pre_intervention_data.toilet_training)}
                    <div className="sm:col-span-2">{renderField("Other Observations", pre_intervention_data.other_observations)}</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {(!hasHistory && !hasPreInt) && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No detailed forms were completed for this assessment.</p>
            </div>
          )}

          {/* Footer for Print */}
          <div className="hidden print:flex justify-between items-end mt-12 pt-8 border-t border-gray-200">
            <div className="text-left text-xs text-gray-400">
              <p>Little Beginnings Centre • 27A Dr. Ezekuse Close; Off Shakiru Anjorin Street, Lekki Phase 1, Lagos</p>
              <p>Generated on {new Date().toLocaleString()}</p>
            </div>
            <div className="text-right">
              <img src={seal} alt="School Seal" className="w-24 h-24 object-contain opacity-90 mix-blend-multiply ml-auto" />
            </div>
          </div>

        </div>
      </div>

      {/* Global CSS for Print Media */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}} />
    </div>
  )
}

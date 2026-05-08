import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { submitAdmission, uploadPassport } from '../services/admissionService'
import logo from '../assets/new logo.png'
import letterHead from '../assets/letter_head.jpg'

const STEPS = [
  { id: 1, title: 'Basic Information' },
  { id: 2, title: 'Medical Questionnaire' },
  { id: 3, title: 'Emergency Contacts' },
  { id: 4, title: 'Agreements & Consents' },
]

const ILLNESSES = [
  'Mumps', 'Measles', 'Scarlet Fever', 'Diphtheria', 
  'Fainting/Epilepsy', 'Chicken Pox', 'Whooping Cough', 'Meningitis',
  'German Measles (Rubella)', 'Tetanus', 'Tuberculosis', 'Hepatitis A', 'Asthma'
]

export default function Apply() {
  const [step, setStep] = useState(1)
  const [passportFile, setPassportFile] = useState(null)
  const [formData, setFormData] = useState({
    parent_name: '', email: '', phone: '', child_name: '', child_dob: '', reason_for_admission: '',
    form_data: {
      medical: {
        class_name: '',
        physician_name: '',
        physician_phone: '',
        hospital_address: '',
        blood_group: '',
        genotype: '',
        allergies: '',
        vaccinations_taken: '',
        regular_medication: '',
        illnesses: [],
        other_sickness: '',
        immunization_ack: false
      },
      emergency_contacts: [
        { name: '', relationship: '', address: '', phone: '' },
        { name: '', relationship: '', address: '', phone: '' }
      ],
      agreements: {
        tuition_program: '', 
        payment_ack: false,
        policies_ack: false,
        social_media_consent: '' 
      }
    }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const toast = useToast()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const handleNext = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!formData.parent_name || !formData.email || !formData.phone || !formData.child_name || !formData.child_dob) {
        return toast.error("Please fill out all required basic information fields.")
      }
      if (!passportFile) {
        return toast.error("Please upload a passport photo of the child.")
      }
      if (!passportFile.type.startsWith('image/')) {
        return toast.error("Invalid file type. Please upload an image file (JPG, PNG, etc.) for the passport.")
      }
      const dob = new Date(formData.child_dob)
      if (isNaN(dob.getTime()) || dob > new Date()) {
        return toast.error("Please enter a valid Date of Birth in the past.")
      }
    }
    if (step === 2) {
      if (!formData.form_data.medical.immunization_ack) {
        return toast.error("Please acknowledge the immunization record requirement.")
      }
    }
    if (step === 3) {
      const c1 = formData.form_data.emergency_contacts[0]
      if (!c1.name || !c1.relationship || !c1.phone) {
        return toast.error("Please provide at least one complete emergency contact.")
      }
    }
    setStep(s => s + 1)
  }

  const handlePrev = () => setStep(s => s - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.form_data.agreements.tuition_program) return toast.error("Please select a tuition program.")
    if (!formData.form_data.agreements.payment_ack) return toast.error("Please agree to the payment terms.")
    if (!formData.form_data.agreements.policies_ack) return toast.error("Please acknowledge the Centre's policies.")
    if (!formData.form_data.agreements.social_media_consent) return toast.error("Please select a social media consent option.")

    setIsSubmitting(true)
    try {
      let passport_url = null
      if (passportFile) {
        passport_url = await uploadPassport(passportFile)
      }

      const access_code = sessionStorage.getItem('lb_access_code')

      const payload = {
        parent_name: formData.parent_name,
        email: formData.email,
        phone: formData.phone,
        child_name: formData.child_name,
        child_dob: formData.child_dob,
        reason_for_admission: formData.reason_for_admission,
        passport_url,
        access_code_used: access_code,
        form_data: formData.form_data
      }
      
      await submitAdmission(payload)
      sessionStorage.removeItem('lb_access_code')
      setSubmitted(true)
      toast.success("Application submitted successfully!")
    } catch (err) {
      toast.error("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIllnessChange = (illness) => {
    const arr = formData.form_data.medical.illnesses
    const updated = arr.includes(illness) ? arr.filter(i => i !== illness) : [...arr, illness]
    setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, illnesses: updated } } })
  }

  const handleEmergencyChange = (index, field, value) => {
    const updatedContacts = [...formData.form_data.emergency_contacts]
    updatedContacts[index][field] = value
    setFormData({ ...formData, form_data: { ...formData.form_data, emergency_contacts: updatedContacts } })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-serif">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-2xl border border-gray-300 relative">
          <div className="w-16 h-16 bg-green-50 border-2 border-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="font-bold text-2xl mb-3 text-gray-900 uppercase tracking-widest">Application Received</h2>
          <hr className="border-black mb-6" />
          <p className="text-gray-700 mb-8 leading-relaxed font-sans">
            Thank you for applying to Little Beginnings. Our admissions team will review your application and contact you shortly.
          </p>
          <div className="border border-black p-4 mb-8 text-sm text-gray-900 text-left bg-gray-50 font-sans italic">
            <strong>IMPORTANT:</strong> Please ensure you bring a physical photocopy of {formData.child_name}'s immunization record on your first visit.
          </div>
          <Link to="/" className="inline-block bg-black text-white font-sans font-bold py-3 px-8 hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest border-2 border-black">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e0e3e5] py-8 sm:py-12 px-2 sm:px-6 font-serif text-gray-900 selection:bg-gray-300">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-sans font-bold text-sm transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </Link>
        </div>
        
        {/* The Paper Document */}
        <div className="bg-white shadow-2xl relative overflow-hidden min-h-[800px] border border-gray-300">
          
          {/* Diagonal Text Watermark */}
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none opacity-[0.03]">
            <h1 className="text-black font-bold text-7xl sm:text-9xl uppercase tracking-widest transform -rotate-45 whitespace-nowrap">
              Little Beginnings
            </h1>
          </div>

          <div className="relative z-10">
            {/* Letterhead */}
            <div className="w-full border-b-[3px] border-black">
              <img src={letterHead} alt="Little Beginnings Letterhead" className="w-full h-auto object-contain" />
            </div>
            
            {/* Steps Progress (Stylized for paper) */}
            <div className="bg-gray-50 border-b border-black/20 py-3 px-8 sm:px-16 flex justify-between items-center font-sans text-xs uppercase tracking-widest text-gray-500">
              {STEPS.map((s) => (
                <span key={s.id} className={step >= s.id ? 'text-black font-bold' : 'hidden sm:inline'}>
                  {step === s.id && <span className="mr-2">▶</span>}
                  Part {s.id}: {s.title}
                </span>
              ))}
              <span className="sm:hidden font-bold text-black">Part {step} of 4</span>
            </div>
            
            {/* Form Content */}
            <div className="p-8 sm:p-16">
              <form onSubmit={step === 4 ? handleSubmit : handleNext}>
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: BASIC INFO */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                      <div className="text-center mb-10">
                        <h3 className="font-bold text-xl uppercase tracking-widest border-b border-black inline-block pb-1">Part 1: Basic Information</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Parent/Guardian Name</label>
                          <input required type="text" value={formData.parent_name} onChange={e => setFormData({...formData, parent_name: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number</label>
                          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email Address</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                      </div>

                      <div className="h-8"></div>
                      
                      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Child's Full Name</label>
                          <input required type="text" value={formData.child_name} onChange={e => setFormData({...formData, child_name: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Date of Birth</label>
                          <input required type="date" max={new Date().toISOString().split('T')[0]} value={formData.child_dob} onChange={e => setFormData({...formData, child_dob: e.target.value})} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                      </div>

                      <div className="relative pt-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Child's Passport Photo *</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          required
                          onChange={e => setPassportFile(e.target.files[0])}
                          className="w-full bg-transparent border border-gray-300 focus:border-black p-3 outline-none font-sans text-sm transition-colors rounded-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1 font-sans italic">Please upload a clear, recent photo of the child's face.</p>
                      </div>

                      <div className="relative pt-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Reason for Admission / Specific Goals</label>
                        <textarea value={formData.reason_for_admission} onChange={e => setFormData({...formData, reason_for_admission: e.target.value})} rows="3" className="w-full bg-transparent border border-gray-300 focus:border-black p-3 outline-none font-sans text-base transition-colors resize-none rounded-none" placeholder="Provide details here..."></textarea>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: MEDICAL */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                      <div className="text-center mb-8">
                        <h3 className="font-bold text-xl uppercase tracking-widest border-b border-black inline-block pb-1">Part 2: Medical Questionnaire</h3>
                        <p className="font-sans text-sm text-gray-600 mt-4 italic">The health of our children is our utmost concern. All details are strictly confidential.</p>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-bold text-lg text-black border-b border-gray-300 pb-2 uppercase tracking-widest">Physician & Hospital Info</h4>
                        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                          <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Class</label>
                            <input type="text" value={formData.form_data.medical.class_name} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, class_name: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                          </div>
                          <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name of Child's Physician</label>
                            <input type="text" value={formData.form_data.medical.physician_name} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, physician_name: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                          <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Physician Telephone</label>
                            <input type="tel" value={formData.form_data.medical.physician_phone} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, physician_phone: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                          </div>
                          <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name & Address of Hospital/Clinic</label>
                            <input type="text" value={formData.form_data.medical.hospital_address} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, hospital_address: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-bold text-lg text-black border-b border-gray-300 pb-2 uppercase tracking-widest mt-6">Medical Details</h4>
                        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                          <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Blood Group</label>
                            <select value={formData.form_data.medical.blood_group} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, blood_group: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none cursor-pointer">
                              <option value="">Select Blood Group</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="Not Known">Not Known</option>
                            </select>
                          </div>
                          <div className="relative">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Genotype</label>
                            <select value={formData.form_data.medical.genotype} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, genotype: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none cursor-pointer">
                              <option value="">Select Genotype</option>
                              <option value="AA">AA</option>
                              <option value="AS">AS</option>
                              <option value="AC">AC</option>
                              <option value="SS">SS</option>
                              <option value="SC">SC</option>
                              <option value="CC">CC</option>
                              <option value="Not Known">Not Known</option>
                            </select>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Specific Allergies</label>
                          <input type="text" value={formData.form_data.medical.allergies} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, allergies: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Vaccinations Taken</label>
                          <input type="text" value={formData.form_data.medical.vaccinations_taken} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, vaccinations_taken: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Does your child take any medication regularly? (State what and why)</label>
                          <input type="text" value={formData.form_data.medical.regular_medication} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, regular_medication: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                        </div>
                      </div>

                      <div className="mt-8">
                        <label className="block text-sm font-bold text-black mb-4 font-sans">Has your child had any of the following illnesses/conditions? (Tick all that apply)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                          {ILLNESSES.map(ill => (
                            <label key={ill} className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-start">
                                <input 
                                  type="checkbox" 
                                  checked={formData.form_data.medical.illnesses.includes(ill)}
                                  onChange={() => handleIllnessChange(ill)}
                                  className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-black flex items-center justify-center peer-checked:after:content-['✓'] after:text-black after:font-bold after:text-lg bg-transparent"></div>
                              </div>
                              <span className="text-base text-gray-800 pt-0.5 leading-none group-hover:text-black">{ill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="relative pt-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Other sicknesses not listed above?</label>
                        <input type="text" value={formData.form_data.medical.other_sickness} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, other_sickness: e.target.value } } })} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" placeholder="Specify here if applicable..." />
                      </div>

                      <div className="border-2 border-black p-6 mt-8 bg-white/50">
                        <label className="flex items-start gap-4 cursor-pointer">
                          <div className="relative flex items-start mt-1">
                            <input 
                              type="checkbox" 
                              required
                              checked={formData.form_data.medical.immunization_ack}
                              onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, medical: { ...formData.form_data.medical, immunization_ack: e.target.checked } } })}
                              className="peer sr-only"
                            />
                            <div className="w-6 h-6 border-2 border-black flex items-center justify-center peer-checked:bg-black peer-checked:after:content-['✓'] after:text-white after:font-bold bg-white transition-colors"></div>
                          </div>
                          <div>
                            <span className="text-base font-bold text-black block mb-1 uppercase tracking-widest">Immunization Record Requirement</span>
                            <span className="text-sm text-gray-700 font-sans leading-relaxed">
                              I hereby acknowledge that I am required to provide a physical photocopy of my child's immunization record bearing his/her name to the Centre on or before resumption.
                            </span>
                          </div>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: CONTACTS */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                      <div className="text-center mb-10">
                        <h3 className="font-bold text-xl uppercase tracking-widest border-b border-black inline-block pb-1">Part 3: Emergency Contacts</h3>
                        <p className="font-sans text-sm text-gray-600 mt-4 italic">In the event of an emergency, please state two other nearby emergency contacts.</p>
                      </div>

                      {[0, 1].map(index => (
                        <div key={index} className="space-y-6">
                          <h4 className="font-bold text-lg text-black border-b border-gray-300 pb-2 uppercase tracking-widest">Contact {index + 1} {index === 0 && '(Primary)'}</h4>
                          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="relative">
                              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                              <input required={index===0} type="text" value={formData.form_data.emergency_contacts[index].name} onChange={e => handleEmergencyChange(index, 'name', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                            </div>
                            <div className="relative">
                              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Relationship to Child</label>
                              <input required={index===0} type="text" value={formData.form_data.emergency_contacts[index].relationship} onChange={e => handleEmergencyChange(index, 'relationship', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="relative">
                              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Telephone Number</label>
                              <input required={index===0} type="tel" value={formData.form_data.emergency_contacts[index].phone} onChange={e => handleEmergencyChange(index, 'phone', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                            </div>
                            <div className="relative">
                              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Residential Address</label>
                              <input required={index===0} type="text" value={formData.form_data.emergency_contacts[index].address} onChange={e => handleEmergencyChange(index, 'address', e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black py-2 outline-none font-sans text-base transition-colors rounded-none" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* STEP 4: AGREEMENTS */}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                      <div className="text-center mb-8">
                        <h3 className="font-bold text-xl uppercase tracking-widest border-b border-black inline-block pb-1">Part 4: Agreements & Consents</h3>
                      </div>

                      {/* Tuition Agreement */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-black uppercase tracking-widest">Tuition Payment Plan</h4>
                        <p className="font-sans text-sm text-gray-700">All payment plans require compulsory Registration & Joining Fee payments.</p>
                        <div className="space-y-3 font-sans mt-4">
                          {['Diamond Program (predominantly one-on-one)', 'Amethyst Program (predominantly classroom setting)', 'Blended Diamond (2 or 3 days at the Centre)'].map(prog => (
                            <label key={prog} className={`flex items-center gap-4 p-4 border border-gray-300 cursor-pointer transition-all ${formData.form_data.agreements.tuition_program === prog ? 'bg-gray-100 border-black shadow-[inset_4px_0_0_0_#000]' : 'bg-transparent hover:bg-gray-50'}`}>
                              <div className="relative flex items-center">
                                <input type="radio" name="tuition" value={prog} checked={formData.form_data.agreements.tuition_program === prog} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, agreements: { ...formData.form_data.agreements, tuition_program: e.target.value } } })} className="peer sr-only" />
                                <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center peer-checked:bg-black peer-checked:border-black bg-transparent transition-colors">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </div>
                              </div>
                              <span className="text-base font-semibold text-black">{prog}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="border border-black p-5 bg-red-50/50">
                        <label className="flex items-start gap-4 cursor-pointer">
                          <div className="relative flex items-start mt-1">
                            <input type="checkbox" required checked={formData.form_data.agreements.payment_ack} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, agreements: { ...formData.form_data.agreements, payment_ack: e.target.checked } } })} className="peer sr-only" />
                            <div className="w-6 h-6 border-2 border-black flex items-center justify-center peer-checked:bg-black peer-checked:after:content-['✓'] after:text-white after:font-bold bg-white transition-colors flex-shrink-0"></div>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-black uppercase tracking-widest block mb-1">Tuition Default & Refund Policy Acknowledgment</span>
                            <span className="text-sm text-gray-800 font-sans leading-relaxed block">
                              I have read and agreed to the conditions. I understand all fees are non-refundable and must be paid prior to my child's first day. Failure to pay within the 2-week grace period results in dismissal. A 10% fine applies for late fees.
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="border border-black p-5 bg-blue-50/50">
                        <label className="flex items-start gap-4 cursor-pointer">
                          <div className="relative flex items-start mt-1">
                            <input type="checkbox" required checked={formData.form_data.agreements.policies_ack} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, agreements: { ...formData.form_data.agreements, policies_ack: e.target.checked } } })} className="peer sr-only" />
                            <div className="w-6 h-6 border-2 border-black flex items-center justify-center peer-checked:bg-black peer-checked:after:content-['✓'] after:text-white after:font-bold bg-white transition-colors flex-shrink-0"></div>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-black uppercase tracking-widest block mb-1">Centre Policies Acknowledgment</span>
                            <span className="text-sm text-gray-800 font-sans leading-relaxed block">
                              I acknowledge the Centre's requirements:
                              <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>I will provide the required daily supplies (fruits/water, extra clothes, diapers, hand towels, bibs, sanitizer) all labeled with my child's name.</li>
                                <li>I understand all snacks and food must be brought from home, and high-sugar diets (fizzy drinks, chocolate) are not allowed.</li>
                                <li>I understand children must be picked up by 2:00pm, and a fine will be imposed for late pick-ups.</li>
                              </ul>
                            </span>
                          </div>
                        </label>
                      </div>

                      <hr className="border-black/20" />

                      {/* Social Media */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-black uppercase tracking-widest">Social Media Use Consent</h4>
                        <p className="font-sans text-sm text-gray-700 mb-4">We showcase works to display our Treasures. Your consent is needed for publications.</p>
                        
                        <div className="space-y-3 font-sans">
                          {[
                            { val: 'full', label: 'Full Consent', desc: "I hereby consent that my child's Image and/or Video can be explicitly used by Little Beginnings Centre." },
                            { val: 'partial', label: 'Partial Consent', desc: "I hereby consent that my child's Image/Video can be used ONLY when his/her face is covered and/or a back view is taken." },
                            { val: 'none', label: 'No Consent', desc: "I DO NOT consent that my child's Video and/or Photo/Image can be used by Little Beginnings Centre." }
                          ].map(opt => (
                            <label key={opt.val} className={`flex items-start gap-4 p-4 border border-gray-300 cursor-pointer transition-all ${formData.form_data.agreements.social_media_consent === opt.val ? 'bg-gray-100 border-black shadow-[inset_4px_0_0_0_#000]' : 'bg-transparent hover:bg-gray-50'}`}>
                              <div className="relative flex items-center mt-0.5">
                                <input type="radio" name="media" value={opt.val} checked={formData.form_data.agreements.social_media_consent === opt.val} onChange={e => setFormData({ ...formData, form_data: { ...formData.form_data, agreements: { ...formData.form_data.agreements, social_media_consent: e.target.value } } })} className="peer sr-only" />
                                <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center peer-checked:bg-black peer-checked:border-black bg-transparent transition-colors">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-bold text-black uppercase tracking-wider block mb-1">{opt.label}</span>
                                <span className="text-sm text-gray-700">{opt.desc}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Footer */}
                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-10 mt-12 border-t-[3px] border-black">
                  {step > 1 && (
                    <button type="button" onClick={handlePrev} className="px-8 py-4 bg-transparent border-2 border-black text-black font-sans font-bold hover:bg-gray-100 transition-colors uppercase text-sm tracking-widest flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Previous Section
                    </button>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 font-sans font-bold uppercase text-sm tracking-widest transition-colors ${step === 4 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black border-2 border-gray-300 hover:border-black'}`}
                  >
                    {isSubmitting ? 'Processing...' : step === 4 ? 'Sign & Submit Application' : (
                      <>Proceed to Next Section <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="font-sans text-xs text-gray-500 uppercase tracking-widest">© {new Date().getFullYear()} Little Beginnings Centre</p>
        </div>
      </div>
    </div>
  )
}

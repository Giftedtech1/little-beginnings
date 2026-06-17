import { useState, useEffect } from 'react'
import { Loader2, Trash2, UserPlus, FileSearch, CheckCircle, XCircle, History, UserCog, Link as LinkIcon, Users, Eye, EyeOff, UserCircle, BookOpen, LayoutDashboard, Menu, MessageCircle, Power, PowerOff, Lock, Archive, ArchiveRestore } from 'lucide-react'
import { getStudents, createStudent, getParents, linkParentToStudent, deleteStudent, archiveStudent, unarchiveStudent, getArchivedStudents } from '../services/studentService'
import { getPendingResults, updateResultStatus, getAdminResultsHistory } from '../services/resultService'
import { supabase } from '../services/supabaseClient'
import { getAllProfiles, toggleUserStatus } from '../services/authService'
import { getAdmissions, updateAdmissionStatus } from '../services/admissionService'
import { fetchAccessCodes, fetchPreAssessments, generateAccessCode } from '../services/assessmentService'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ConfirmModal from '../components/ui/ConfirmModal'
import PromptModal from '../components/ui/PromptModal'
import ReportViewerModal from '../components/ReportViewerModal'
import AdmissionViewerModal from '../components/AdmissionViewerModal'
import AssessmentViewerModal from '../components/AssessmentViewerModal'
import StudentProfileModal from '../components/StudentProfileModal'
import BlogTab from '../components/admin/BlogTab'
import NewsletterTab from '../components/admin/NewsletterTab'

export default function AdminPanel() {
  const [students, setStudents] = useState([])
  const [archivedStudents, setArchivedStudents] = useState([])
  const [studentView, setStudentView] = useState('active') // 'active' | 'archived'
  const [parents, setParents] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [pendingResults, setPendingResults] = useState([])
  const [historyResults, setHistoryResults] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [accessCodes, setAccessCodes] = useState([])
  const [preAssessments, setPreAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()
  const { user, role, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return // wait for auth to resolve
    if (!user) {
      navigate('/portal/login')
      return
    }
    if (role && !['admin', 'super_admin', 'admin_2', 'admin_3'].includes(role)) {
      toast.error("You don't have permission to view the admin panel.")
      navigate('/portal/login')
    }
  }, [user, role, authLoading, navigate, toast])

  // Custom Modal States
  const [confirmState, setConfirmState] = useState({ isOpen: false })
  const [promptState, setPromptState] = useState({ isOpen: false })
  const [viewingResult, setViewingResult] = useState(null)
  const [viewingAdmission, setViewingAdmission] = useState(null)
  const [viewingAssessment, setViewingAssessment] = useState(null)
  const [viewingStudent, setViewingStudent] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Modal States
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [studentForm, setStudentForm] = useState({ first_name: '', last_name: '', date_of_birth: '', sex: '', program: '', blood_group: '', genotype: '', registration_year: '', emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '' })
  const [isStudentSubmitting, setIsStudentSubmitting] = useState(false)

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [userForm, setUserForm] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'staff' })
  const [isUserSubmitting, setIsUserSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [linkForm, setLinkForm] = useState({ parent_id: '', student_id: '' })
  const [isLinkSubmitting, setIsLinkSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const [studentsData, archivedData, parentsData, usersData, pendingData, historyData, admissionsData, codesData, assessmentsData] = await Promise.all([
        getStudents(),
        getArchivedStudents(),
        getParents(),
        getAllProfiles(),
        getPendingResults(),
        getAdminResultsHistory(),
        getAdmissions(),
        fetchAccessCodes(),
        fetchPreAssessments()
      ])
      setStudents(studentsData)
      setArchivedStudents(archivedData)
      setParents(parentsData)
      setAllUsers(usersData)
      setPendingResults(pendingData)
      setHistoryResults(historyData)
      setAdmissions(admissionsData)
      setAccessCodes(codesData)
      setPreAssessments(assessmentsData)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const updated = await updateResultStatus(id, 'approved', user.id)
      setPendingResults(prev => prev.filter(r => r.id !== id))
      setHistoryResults(prev => [updated, ...prev])
      toast.success("Result approved successfully!")
    } catch (err) {
      toast.error("Failed to approve result")
    }
  }

  const handleReject = (id) => {
    setPromptState({
      isOpen: true,
      title: "Reject Result",
      message: "Please provide a reason for rejecting this upload:",
      placeholder: "e.g., File is unreadable...",
      onConfirm: async (msg) => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          const updated = await updateResultStatus(id, 'rejected', user.id, msg)
          setPendingResults(prev => prev.filter(r => r.id !== id))
          setHistoryResults(prev => [updated, ...prev])
          toast.success("Result rejected successfully.")
          setPromptState({ isOpen: false })
        } catch (err) {
          toast.error("Failed to reject result")
        }
      }
    })
  }

  const handleAdmissionStatus = async (id, status) => {
    try {
      const updated = await updateAdmissionStatus(id, status)
      setAdmissions(admissions.map(a => a.id === id ? updated : a))
      toast.success(`Admission marked as ${status}`)
    } catch (err) {
      toast.error("Failed to update admission status")
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setIsStudentSubmitting(true)
    try {
      const newStudent = await createStudent(studentForm)
      setStudents([newStudent, ...students])
      setIsAddStudentOpen(false)
      setStudentForm({ first_name: '', last_name: '', date_of_birth: '', sex: '', program: '', blood_group: '', genotype: '', registration_year: '', emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '' })
      toast.success("Student added successfully!")
    } catch (err) {
      toast.error("Failed to add student: " + err.message)
    } finally {
      setIsStudentSubmitting(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()

    const { password } = userForm;
    if (password.length < 8) return toast.error("Password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password)) return toast.error("Password must contain at least one uppercase letter.");
    if (!/[a-z]/.test(password)) return toast.error("Password must contain at least one lowercase letter.");
    if (!/[0-9]/.test(password)) return toast.error("Password must contain at least one number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return toast.error("Password must contain at least one special symbol.");

    setIsUserSubmitting(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: userForm
      })
      if (error) {
        let msg = error.message;
        try {
          if (error.context) {
            const errData = await error.context.json();
            msg = errData.error || msg;
          }
        } catch (e) {}
        throw new Error(msg || "Failed to create user");
      }
      toast.success("User created successfully!")
      setIsAddUserOpen(false)
      setUserForm({ first_name: '', last_name: '', email: '', password: '', role: 'staff' })
      
      const newUsers = await getAllProfiles()
      setAllUsers(newUsers)

      // Refresh parents list if we added a parent
      if (userForm.role === 'parent') {
        const parentsData = await getParents()
        setParents(parentsData)
      }
    } catch (err) {
      toast.error("Failed to add user: " + err.message)
    } finally {
      setIsUserSubmitting(false)
    }
  }

  const handleLinkSubmit = async (e) => {
    e.preventDefault()
    
    setConfirmState({
      isOpen: true,
      title: "Link Family",
      message: "Are you sure you want to permanently link this parent to this student?",
      isDestructive: false,
      confirmText: "Yes, Link Them",
      onConfirm: async () => {
        setIsLinkSubmitting(true)
        try {
          if (!linkForm.parent_id || !linkForm.student_id) throw new Error("Please select both a parent and a student.")
          await linkParentToStudent(linkForm.parent_id, linkForm.student_id)
          toast.success("Successfully linked parent and student!")
          setIsLinkOpen(false)
          setLinkForm({ parent_id: '', student_id: '' })
          setConfirmState({ isOpen: false })
        } catch (err) {
          if (err.code === '23505') {
            toast.error("This parent and student are already linked.")
          } else {
            toast.error("Failed to link: " + err.message)
          }
          setConfirmState({ isOpen: false })
        } finally {
          setIsLinkSubmitting(false)
        }
      }
    })
  }

  const handleDeleteStudent = (id) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Student",
      message: "WARNING: Are you sure you want to delete this student? This action cannot be undone and will delete all their results.",
      isDestructive: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteStudent(id)
          setStudents(students.filter(s => s.id !== id))
          toast.success("Student deleted successfully.")
        } catch (err) {
          toast.error("Failed to delete student: " + err.message)
        } finally {
          setConfirmState({ isOpen: false })
        }
      }
    })
  }

  const handleArchiveStudent = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Archive Student',
      message: 'Are you sure you want to archive this student? They can be restored later from the Archive view.',
      isDestructive: false,
      confirmText: 'Archive',
      onConfirm: async () => {
        try {
          await archiveStudent(id)
          setStudents(students.filter(s => s.id !== id))
          const archived = await getArchivedStudents()
          setArchivedStudents(archived)
          toast.success('Student archived.')
        } catch (err) {
          toast.error('Failed to archive student: ' + err.message)
        } finally {
          setConfirmState({ isOpen: false })
        }
      }
    })
  }

  const handleUnarchiveStudent = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Restore Student',
      message: 'Restore this student to the active list?',
      isDestructive: false,
      confirmText: 'Restore',
      onConfirm: async () => {
        try {
          await unarchiveStudent(id)
          setArchivedStudents(archivedStudents.filter(s => s.id !== id))
          const active = await getStudents()
          setStudents(active)
          toast.success('Student restored to active.')
        } catch (err) {
          toast.error('Failed to restore student: ' + err.message)
        } finally {
          setConfirmState({ isOpen: false })
        }
      }
    })
  }

  const handleDeleteUser = (id) => {
    setConfirmState({
      isOpen: true,
      title: "Delete User",
      message: "WARNING: Are you sure you want to securely delete this user? Their account will be permanently removed.",
      isDestructive: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const { error } = await supabase.functions.invoke('delete-user', {
            body: { user_id: id }
          })
          if (error) {
            let msg = error.message;
            try {
              if (error.context) {
                const errData = await error.context.json();
                msg = errData.error || msg;
              }
            } catch (e) {}
            throw new Error(msg || "Failed to delete user via backend");
          }
          
          setAllUsers(allUsers.filter(u => u.id !== id))
          setParents(parents.filter(p => p.id !== id))
          toast.success("User deleted securely.")
        } catch (err) {
          toast.error("Failed to delete user: " + err.message)
        } finally {
          setConfirmState({ isOpen: false })
        }
      }
    })
  }

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.is_active === false ? true : false;
    const actionText = newStatus ? 'Activate' : 'Deactivate';
    
    setConfirmState({
      isOpen: true,
      title: `${actionText} User`,
      message: `Are you sure you want to ${actionText.toLowerCase()} ${user.first_name} ${user.last_name}? ${newStatus ? 'They will be able to log in again.' : 'They will be immediately logged out and prevented from accessing the portal.'}`,
      isDestructive: !newStatus,
      confirmText: actionText,
      onConfirm: async () => {
        try {
          const updatedProfile = await toggleUserStatus(user.id, newStatus);
          setAllUsers(allUsers.map(u => u.id === user.id ? { ...u, is_active: updatedProfile.is_active } : u));
          toast.success(`User ${actionText.toLowerCase()}d successfully.`);
        } catch (err) {
          toast.error(`Failed to ${actionText.toLowerCase()} user: ` + err.message);
        } finally {
          setConfirmState({ isOpen: false });
        }
      }
    });
  }

  const TABS = [
    { id: 'overview',  icon: LayoutDashboard, label: 'Overview', roles: ['admin', 'super_admin', 'admin_2'] },
    { id: 'admissions',icon: UserPlus, label: `Admissions${admissions.filter(a=>a.status==='pending').length ? ` (${admissions.filter(a=>a.status==='pending').length})` : ''}`, roles: ['admin', 'super_admin', 'admin_2'] },
    { id: 'pre_assessments', icon: FileSearch, label: 'Pre-Assessments', roles: ['admin', 'super_admin', 'admin_2'] },
    { id: 'access_codes', icon: Lock, label: 'Access Codes', roles: ['admin', 'super_admin'] },
    { id: 'pending',   icon: FileSearch, label: `Pending Results${pendingResults.length ? ` (${pendingResults.length})` : ''}`, roles: ['admin', 'super_admin', 'admin_2'] },
    { id: 'history',   icon: History, label: 'History', roles: ['admin', 'super_admin', 'admin_2'] },
    { id: 'students',  icon: Users, label: 'Students', roles: ['admin', 'super_admin', 'admin_2'] },
    { id: 'users',     icon: UserCog, label: 'Users', roles: ['admin', 'super_admin'] },
    // NEW TABS
    { id: 'blog',      icon: BookOpen, label: 'Blog', roles: ['admin', 'super_admin', 'admin_2', 'admin_3'] },
    { id: 'newsletter',icon: Users, label: 'Newsletter', roles: ['admin', 'super_admin', 'admin_2'] },
  ]

  const visibleTabs = TABS.filter(t => t.roles.includes(role))

  // Ensure active tab is valid for role, otherwise default to the first valid one
  useEffect(() => {
    if (role && visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTab)) {
      setActiveTab(visibleTabs[0].id)
    }
  }, [role, activeTab, visibleTabs])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans force-light">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
          <h1 className="font-display font-extrabold text-xl text-dark tracking-tight">Admin<span className="text-primary">Panel</span></h1>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Management</p>
          {visibleTabs.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-dark'}`}>
                <Icon className={`w-4 h-4 ${activeTab === t.id ? 'text-primary' : 'text-gray-400'}`} />
                {t.label}
              </button>
            )
          })}
        </div>
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={() => navigate('/portal/profile')} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-dark transition-colors">
            <UserCircle className="w-4 h-4" /> My Profile
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-bold text-lg sm:text-xl text-dark">
              {TABS.find(t => t.id === activeTab)?.label.replace(/\(.*\)/, '').trim()}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === 'students' && (
              <>
                <button onClick={() => setIsLinkOpen(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-dark text-sm font-bold rounded-lg transition-all shadow-sm"><LinkIcon className="w-4 h-4" /> Link Family</button>
                <button onClick={() => setIsAddStudentOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm"><UserPlus className="w-4 h-4" /> Add Student</button>
              </>
            )}
            {activeTab === 'users' && (
              <button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm"><UserCog className="w-4 h-4" /> Add User</button>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: 'Pending Approvals', value: pendingResults.length, color: 'text-amber-600', border: 'border-amber-200' },
                    { label: 'Pending Admissions', value: admissions.filter(a=>a.status==='pending').length, color: 'text-blue-600', border: 'border-blue-200' },
                    { label: 'Total Students',    value: students.length,       color: 'text-emerald-600', border: 'border-emerald-200' },
                    { label: 'System Users',      value: allUsers.length,       color: 'text-purple-600',  border: 'border-purple-200' },
                  ].map(s => (
                    <div key={s.label} className={`bg-white rounded-2xl p-5 sm:p-6 border ${s.border} shadow-sm`}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
                      <p className={`font-display font-extrabold text-3xl sm:text-4xl ${s.color}`}>{loading ? '—' : s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-dark text-lg mb-1 flex items-center gap-2"><FileSearch className="w-5 h-5 text-amber-500" /> Pending Actions Required</h2>
                    <p className="text-sm text-muted">You have {pendingResults.length} reports waiting for approval.</p>
                  </div>
                  <button onClick={()=>setActiveTab('pending')} className="bg-black text-white hover:bg-gray-800 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm w-full sm:w-auto">
                    Review Pending
                  </button>
                </div>
              </div>
            )}

            {/* Admissions Tab */}
            {activeTab === 'admissions' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                ) : admissions.length === 0 ? (
                  <p className="text-muted text-sm text-center py-12">No admissions applications found.</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 bg-gray-50/50">
                    {admissions.map(adm => (
                      <div key={adm.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-dark text-base">{adm.child_name}</h3>
                            <p className="text-xs text-muted font-medium mt-0.5">DOB: {new Date(adm.child_dob).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${adm.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : adm.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : adm.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            {adm.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-6 space-y-1.5 border-t border-gray-100 pt-4">
                          <p><span className="font-semibold text-gray-800">Parent:</span> {adm.parent_name}</p>
                          <p className="truncate"><span className="font-semibold text-gray-800">Email:</span> <a href={`mailto:${adm.email}`} className="text-primary hover:underline">{adm.email}</a></p>
                          <p><span className="font-semibold text-gray-800">Phone:</span> <a href={`tel:${adm.phone}`} className="text-primary hover:underline">{adm.phone}</a></p>
                        </div>

                        <div className="mt-auto space-y-2">
                          <button onClick={() => setViewingAdmission(adm)} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-dark text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            <FileSearch className="w-3.5 h-3.5" /> View Full App
                          </button>
                          {adm.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleAdmissionStatus(adm.id, 'accepted')} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold py-2 rounded-lg transition-colors">Accept</button>
                              <button onClick={() => handleAdmissionStatus(adm.id, 'rejected')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold py-2 rounded-lg transition-colors">Reject</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pre-Assessments Tab */}
            {activeTab === 'pre_assessments' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                ) : preAssessments.length === 0 ? (
                  <p className="text-muted text-sm text-center py-12">No pre-assessments found.</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 bg-gray-50/50">
                    {preAssessments.map(pa => (
                      <div key={pa.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-dark text-base">{pa.child_name}</h3>
                            <p className="text-xs text-muted font-medium mt-0.5">{new Date(pa.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border bg-indigo-50 text-indigo-700 border-indigo-200">
                            Assessment
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-6 space-y-1.5 border-t border-gray-100 pt-4">
                          <p className="truncate"><span className="font-semibold text-gray-800">Parent Email:</span> <a href={`mailto:${pa.parent_email}`} className="text-primary hover:underline">{pa.parent_email}</a></p>
                          <p><span className="font-semibold text-gray-800">Code Used:</span> {pa.access_code}</p>
                        </div>
                        <div className="mt-auto">
                          <button onClick={() => setViewingAssessment(pa)} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-dark text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            <FileSearch className="w-3.5 h-3.5" /> View Assessment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Access Codes Tab */}
            {activeTab === 'access_codes' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button onClick={async () => {
                    try {
                      setLoading(true)
                      await generateAccessCode()
                      const newCodes = await fetchAccessCodes()
                      setAccessCodes(newCodes)
                      toast.success("New Access Code generated!")
                    } catch (err) {
                      toast.error("Failed to generate code.")
                    } finally {
                      setLoading(false)
                    }
                  }} className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm">
                    <Lock className="w-4 h-4" /> Generate New Code
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                  ) : accessCodes.length === 0 ? (
                    <p className="text-muted text-sm text-center py-12">No access codes found.</p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                          <th className="p-4">Access Code</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Created At</th>
                          <th className="p-4">Used By</th>
                          <th className="p-4">Used At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {accessCodes.map(code => (
                          <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-mono font-bold text-dark">{code.code}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${code.is_used ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {code.is_used ? 'USED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500">{new Date(code.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-gray-700 font-medium">{code.used_by_email || '—'}</td>
                            <td className="p-4 text-gray-500">{code.used_at ? new Date(code.used_at).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Pending Tab */}
            {activeTab === 'pending' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                ) : pendingResults.length === 0 ? (
                  <div className="text-center py-16"><CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" /><p className="text-gray-500 text-sm font-bold">All caught up! No pending approvals.</p></div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {pendingResults.map(res => (
                      <div key={res.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-dark text-sm sm:text-base">{res.students?.first_name} {res.students?.last_name}</h3>
                            {res.report_type && res.report_type !== 'pdf-link' && (
                              <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-wide">{res.report_type === 'bi-weekly' ? 'Bi-Weekly' : 'End of IP'}</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-700 truncate mb-1">{res.title}</p>
                          {res.profiles && <p className="text-xs text-gray-500 font-medium">Uploaded by: <span className="text-gray-700">{res.profiles.first_name} {res.profiles.last_name}</span></p>}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button onClick={() => setViewingResult(res)} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> Preview
                          </button>
                          <button onClick={() => handleApprove(res.id)} className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                          <button onClick={() => handleReject(res.id)} className="flex-1 sm:flex-none bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                ) : historyResults.length === 0 ? (
                  <p className="text-muted text-sm text-center py-12">No history yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {['Student', 'Report', 'Type', 'Status', 'Date'].map(h => (
                            <th key={h} className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {historyResults.map(res => (
                          <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-dark whitespace-nowrap">{res.students?.first_name} {res.students?.last_name}</td>
                            <td className="px-6 py-4">
                              <button onClick={() => setViewingResult(res)} className="text-primary font-semibold hover:underline flex items-center gap-1.5 text-sm">
                                <BookOpen className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate max-w-[200px]">{res.title}</span>
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              {res.report_type === 'bi-weekly' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-primary/20 bg-primary/10 text-primary">Bi-Weekly</span>}
                              {res.report_type === 'end-of-ip' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-purple-200 bg-purple-50 text-purple-700">End of IP</span>}
                              {(!res.report_type || res.report_type === 'pdf-link') && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200 bg-gray-100 text-gray-700">PDF</span>}
                            </td>
                            <td className="px-6 py-4">
                              {res.status === 'approved' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-200 bg-green-50 text-green-700">Approved</span>}
                              {res.status === 'rejected' && <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-red-200 bg-red-50 text-red-700">Rejected</span>}
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs font-medium whitespace-nowrap">{new Date(res.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                {/* Active / Archived Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStudentView('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${studentView === 'active' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    Active ({students.length})
                  </button>
                  <button
                    onClick={() => setStudentView('archived')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${studentView === 'archived' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Archive className="w-3.5 h-3.5" /> Archived ({archivedStudents.length})
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                  ) : studentView === 'active' ? (
                    students.length === 0 ? (
                      <p className="text-muted text-sm text-center py-12">No active students found.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>{['ID', 'Name', 'Reg. Year', 'Age', 'Program', 'Linked Parent', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {students.map(s => {
                              const age = s.date_of_birth ? (() => { const b = new Date(s.date_of_birth); const n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.getMonth() - b.getMonth() < 0 || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a })() : null
                              const linkedParents = s.linked_parents || []
                              return (
                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                  <td className="px-6 py-4"><span className="font-mono font-bold text-xs bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-md tracking-widest">{s.student_id ?? '----'}</span></td>
                                  <td className="px-6 py-4">
                                    <button onClick={() => setViewingStudent(s)} className="font-semibold text-dark hover:text-primary hover:underline whitespace-nowrap text-left">
                                      {s.first_name} {s.last_name}
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600 font-medium">{s.registration_year ?? '—'}</td>
                                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{age !== null ? `${age} yrs` : '—'}</td>
                                  <td className="px-6 py-4 text-gray-600 font-medium">{s.program || '—'}</td>
                                  <td className="px-6 py-4">
                                    {linkedParents.length > 0 ? (
                                      <div className="space-y-2">
                                        {linkedParents.map((parent, index) => (
                                          <div key={parent.id} className={index > 0 ? "pt-2 border-t border-gray-100" : ""}>
                                            <p className="font-semibold text-gray-800 text-xs whitespace-nowrap">{parent.first_name} {parent.last_name}</p>
                                            <a href={`mailto:${parent.email}`} className="text-xs text-primary hover:underline">{parent.email}</a>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">Not Linked</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4"><span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200 bg-gray-50 text-gray-700">{s.enrollment_status}</span></td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" onClick={() => handleArchiveStudent(s.id)} title="Archive Student">
                                        <Archive className="w-4 h-4" />
                                      </button>
                                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" onClick={() => handleDeleteStudent(s.id)} title="Delete Student">
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )
                  ) : (
                    archivedStudents.length === 0 ? (
                      <p className="text-muted text-sm text-center py-12">No archived students.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-amber-50 border-b border-amber-100">
                            <tr>{['ID', 'Name', 'Reg. Year', 'Program', 'Actions'].map(h => <th key={h} className="px-6 py-3.5 text-xs font-bold text-amber-700 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {archivedStudents.map(s => (
                              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group bg-amber-50/30">
                                <td className="px-6 py-4"><span className="font-mono font-bold text-xs bg-amber-100 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-md tracking-widest">{s.student_id ?? '----'}</span></td>
                                <td className="px-6 py-4 font-semibold text-dark whitespace-nowrap">{s.first_name} {s.last_name}</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{s.registration_year ?? '—'}</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{s.program || '—'}</td>
                                <td className="px-6 py-4">
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors" onClick={() => handleUnarchiveStudent(s.id)}>
                                    <ArchiveRestore className="w-3.5 h-3.5" /> Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}


            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                ) : allUsers.length === 0 ? (
                  <p className="text-muted text-sm text-center py-12">No users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>{['Staff ID', 'Name', 'Email', 'Role', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allUsers.map(u => (
                          <tr key={u.id} className={`transition-colors group ${u.is_active === false ? 'bg-gray-50/80 hover:bg-gray-100/80' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-6 py-4">
                              {u.staff_id ? <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md tracking-widest">{u.staff_id}</span>
                                : <span className="text-gray-400 text-xs font-mono">----</span>}
                            </td>
                            <td className="px-6 py-4 font-semibold text-dark whitespace-nowrap">
                              {u.first_name} {u.last_name}
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${u.role==='admin'||u.role==='super_admin'?'bg-purple-50 text-purple-700 border-purple-200':u.role.startsWith('admin_')?'bg-orange-50 text-orange-700 border-orange-200':'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${u.is_active !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {u.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                {role === 'super_admin' && (
                                  <button 
                                    className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${u.is_active === false ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}`} 
                                    onClick={() => handleToggleUserStatus(u)}
                                    title={u.is_active === false ? 'Activate User' : 'Deactivate User'}
                                  >
                                    {u.is_active === false ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                                  </button>
                                )}
                                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" onClick={() => handleDeleteUser(u.id)} title="Delete User">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'blog' && <BlogTab />}

            {/* Newsletter Tab */}
            {activeTab === 'newsletter' && <NewsletterTab />}

          </div>
        </div>
      </main>

      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-display font-bold text-xl mb-1">Add New Student</h2>
            <p className="text-sm text-gray-500 mb-6">Fields marked <span className="text-red-500">*</span> are required.</p>
            <form onSubmit={handleAddStudent} className="space-y-5">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Basic Info</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">First Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input required type="text" value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input required type="date" max={new Date().toISOString().split('T')[0]} value={studentForm.date_of_birth} onChange={e => setStudentForm({...studentForm, date_of_birth: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sex</label>
                    <select value={studentForm.sex} onChange={e => setStudentForm({...studentForm, sex: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                      <option value="">-- Select --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Registration Year <span className="text-red-500">*</span></label>
                    <select required value={studentForm.registration_year} onChange={e => setStudentForm({...studentForm, registration_year: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                      <option value="">-- Select Year --</option>
                      {Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => new Date().getFullYear() - i).map(yr => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Student ID Preview</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-sm font-mono font-bold text-primary">
                      {studentForm.registration_year ? `LBC-${String(studentForm.registration_year).slice(-2)}-XXX` : '— Select year first —'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-1">Program</label>
                    <input type="text" value={studentForm.program} onChange={e => setStudentForm({...studentForm, program: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="e.g. ABA Therapy" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Medical Info</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Blood Group</label>
                    <select value={studentForm.blood_group} onChange={e => setStudentForm({...studentForm, blood_group: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                      <option value="">-- Select --</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Genotype</label>
                    <select value={studentForm.genotype} onChange={e => setStudentForm({...studentForm, genotype: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                      <option value="">-- Select --</option>
                      {['AA','AS','AC','SS','SC'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-1">Contact Name</label>
                    <input type="text" value={studentForm.emergency_contact_name} onChange={e => setStudentForm({...studentForm, emergency_contact_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Phone</label>
                    <input type="tel" value={studentForm.emergency_contact_phone} onChange={e => setStudentForm({...studentForm, emergency_contact_phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Relationship</label>
                    <input type="text" value={studentForm.emergency_contact_relationship} onChange={e => setStudentForm({...studentForm, emergency_contact_relationship: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="e.g. Uncle" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddStudentOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 rounded-xl">Cancel</button>
                <button type="submit" disabled={isStudentSubmitting} className="flex-1 btn-primary justify-center disabled:opacity-50">
                  {isStudentSubmitting ? 'Saving...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User (Staff/Parent) Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-display font-bold text-xl mb-6">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">First Name</label>
                  <input required type="text" value={userForm.first_name} onChange={e => setUserForm({...userForm, first_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Last Name</label>
                  <input required type="text" value={userForm.last_name} onChange={e => setUserForm({...userForm, last_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Temporary Password</label>
                <div className="relative">
                  <input required type={showPassword ? 'text' : 'password'} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200" minLength="8" autoComplete="new-password" placeholder="Min 8 chars, 1 uppercase, 1 symbol" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Role</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                  <option value="staff">Staff (Teacher/Therapist)</option>
                  <option value="parent">Parent</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin_2">Admin 2 (Manager)</option>
                  <option value="admin_3">Admin 3 (Blog/Chat Only)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddUserOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 rounded-xl">Cancel</button>
                <button type="submit" disabled={isUserSubmitting} className="flex-1 btn-primary justify-center disabled:opacity-50">
                  {isUserSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Family Modal */}
      {isLinkOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
            <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-accent" /> Link Parent to Student
            </h2>
            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Select Parent</label>
                <select required value={linkForm.parent_id} onChange={e => setLinkForm({...linkForm, parent_id: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                  <option value="">-- Choose a Parent --</option>
                  {parents.map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Select Student</label>
                <select required value={linkForm.student_id} onChange={e => setLinkForm({...linkForm, student_id: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                  <option value="">-- Choose a Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      #{s.student_id ?? '----'} — {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsLinkOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-dark font-bold py-3 rounded-xl">Cancel</button>
                <button type="submit" disabled={isLinkSubmitting} className="flex-1 btn-primary justify-center disabled:opacity-50">
                  {isLinkSubmitting ? 'Linking...' : 'Link Family'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ConfirmModal 
        {...confirmState} 
        onCancel={() => setConfirmState({ isOpen: false })} 
      />
      <PromptModal 
        {...promptState} 
        onCancel={() => setPromptState({ isOpen: false })} 
      />
      <ReportViewerModal
        result={viewingResult}
        onClose={() => setViewingResult(null)}
      />
      <AdmissionViewerModal 
        admission={viewingAdmission}
        onClose={() => setViewingAdmission(null)}
      />
      <AssessmentViewerModal 
        assessment={viewingAssessment}
        onClose={() => setViewingAssessment(null)}
      />
      <StudentProfileModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />
    </div>
  )
}

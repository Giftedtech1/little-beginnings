import { supabase } from './supabaseClient'

/** Fetch pending results for Admin approval */
export async function getPendingResults() {
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      students ( * ),
      profiles!uploaded_by ( first_name, last_name )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

/** Fetch resolved results (history) for Admin */
export async function getAdminResultsHistory() {
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      students ( * ),
      profiles!uploaded_by ( first_name, last_name )
    `)
    .neq('status', 'pending')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

/** Fetch results uploaded by a specific teacher */
export async function getTeacherResults(teacherId) {
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      students ( * )
    `)
    .eq('uploaded_by', teacherId)
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}

/** Fetch ONLY approved results for a student (Parent View) */
export async function getStudentApprovedResults(studentId) {
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      students ( * )
    `)
    .eq('student_id', studentId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}

/** Legacy/Admin Fetch all results for a student regardless of status. */
export async function getResultsByStudent(studentId) {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Upload a media file to the results-media Storage bucket.
 * Returns { name, url, type } for storing in media_urls. */
export async function uploadResultMedia(studentId, file) {
  const ext = file.name.split('.').pop()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${studentId}/${Date.now()}_${safeName}`
  const { error: storageError } = await supabase.storage
    .from('results-media')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (storageError) throw storageError
  const { data: { publicUrl } } = supabase.storage.from('results-media').getPublicUrl(path)
  return { name: file.name, url: publicUrl, type: file.type }
}

/** Upload a PDF report to Supabase Storage (results-media bucket).
 * Returns { url, file_name, size } to match the expected shape. */
export async function uploadPDFToCpanel(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `pdfs/${Date.now()}_${safeName}`

  const { error: storageError } = await supabase.storage
    .from('results-media')
    .upload(path, file, { contentType: 'application/pdf', upsert: false })

  if (storageError) throw new Error(storageError.message || 'Failed to upload PDF')

  const { data: { publicUrl } } = supabase.storage.from('results-media').getPublicUrl(path)

  return { url: publicUrl, file_name: file.name, size: file.size }
}

/** Create a new result.
 * Accepts report_type ('pdf-link' | 'bi-weekly' | 'end-of-ip'),
 * form_data (JSONB), and media_urls (array). */
export async function createResult(result, uploaderId) {
  const insertData = { status: 'pending', uploaded_by: uploaderId, ...result }
  const { data, error } = await supabase.from('results').insert([insertData]).select().single()
  if (error) throw error
  return data
}

/** Update a result */
export async function updateResult(id, updates) {
  const { data, error } = await supabase.from('results').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

/** Update status of a result specifically with admin and message */
export async function updateResultStatus(id, newStatus, adminId, rejectionMessage = null) {
  const updates = { 
    status: newStatus,
    approved_by: adminId,
    approved_at: new Date().toISOString()
  }
  if (newStatus === 'rejected') {
    updates.rejection_message = rejectionMessage
  } else {
    updates.rejection_message = null
  }
  return updateResult(id, updates)
}

/** Delete a result. */
export async function deleteResult(id) {
  const { error } = await supabase.from('results').delete().eq('id', id)
  if (error) throw error
}

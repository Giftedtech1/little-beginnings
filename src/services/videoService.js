import { supabase } from './supabaseClient'

// ── Config ────────────────────────────────────────────────────────────────────
// Replace this with the URL to your upload_video.php file on cPanel
const CPANEL_UPLOAD_URL = 'https://www.little-beginnings.org/uploads/upload_video.php'

const MAX_SIZE_MB = 25
const MAX_SIZE_B  = MAX_SIZE_MB * 1024 * 1024

// ── Upload to cPanel ──────────────────────────────────────────────────────────
async function uploadVideoToCpanel(file) {
  const formData = new FormData()
  formData.append('video', file)

  const response = await fetch(CPANEL_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || `Upload failed (HTTP ${response.status})`)
  }

  return result // { url, file_name, size }
}

// ── Main upload function ──────────────────────────────────────────────────────
/**
 * Upload a video to cPanel and save metadata to Supabase.
 * @param {{ file: File, title: string, course: string, studentId: string }} params
 */
export async function uploadVideo({ file, title, course, studentId }) {
  // Client-side size guard
  if (file.size > MAX_SIZE_B) {
    throw new Error(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`)
  }

  // Upload to cPanel
  const { url, file_name } = await uploadVideoToCpanel(file)

  // Save metadata to Supabase
  const { data, error } = await supabase
    .from('videos')
    .insert([{
      title,
      course:     course || null,
      student_id: studentId,
      url,
      file_name,
      file_size:  file.size,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Fetch videos for a student ────────────────────────────────────────────────
export async function getVideosByStudent(studentId) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ── Delete a video record ─────────────────────────────────────────────────────
// Note: This only removes the Supabase record. The physical file on cPanel
// cannot be deleted from the browser. Remove it manually via cPanel File Manager
// if needed, or set up a server-side cleanup endpoint.
export async function deleteVideo(id) {
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
}

import { supabase } from './supabaseClient'

const STUDENT_SELECT = `
  *,
  parent_student_link (
    profiles (
      id,
      first_name,
      last_name,
      email
    )
  )
`

function mapLinkedParents(data) {
  return data.map(s => {
    const links = s.parent_student_link || []
    const parents = links.map(link => link.profiles).filter(Boolean)
    return { ...s, linked_parents: parents }
  })
}

/** Fetch all active (non-archived) students with their linked parent info. */
export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select(STUDENT_SELECT)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return mapLinkedParents(data)
}

/** Fetch all archived students with their linked parent info. */
export async function getArchivedStudents() {
  const { data, error } = await supabase
    .from('students')
    .select(STUDENT_SELECT)
    .eq('is_archived', true)
    .order('registration_year', { ascending: false })
  if (error) throw error
  return mapLinkedParents(data)
}

/** Fetch a single student by ID. */
export async function getStudentById(id) {
  const { data, error } = await supabase.from('students').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/** Generate the next student ID for a given registration year (e.g. LBC-24-001). */
async function generateStudentId(registrationYear) {
  const twoDigitYear = String(registrationYear).slice(-2)
  const { count, error } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('registration_year', registrationYear)
  if (error) throw error
  const seq = String((count ?? 0) + 1).padStart(3, '0')
  return `LBC-${twoDigitYear}-${seq}`
}

/** Create a new student record with auto-generated ID. */
export async function createStudent(student) {
  const { registration_year } = student
  if (!registration_year) throw new Error('Registration year is required.')

  const student_id = await generateStudentId(Number(registration_year))
  const { data, error } = await supabase
    .from('students')
    .insert([{ ...student, student_id, registration_year: Number(registration_year) }])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Update an existing student. */
export async function updateStudent(id, updates) {
  const { data, error } = await supabase.from('students').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

/** Delete a student. */
export async function deleteStudent(id) {
  const { error } = await supabase.from('students').delete().eq('id', id)
  if (error) throw error
}

/** Archive a student (soft delete). */
export async function archiveStudent(id) {
  const { data, error } = await supabase
    .from('students')
    .update({ is_archived: true })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Restore a student from the archive. */
export async function unarchiveStudent(id) {
  const { data, error } = await supabase
    .from('students')
    .update({ is_archived: false })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Fetch all parents from the profiles table. */
export async function getParents() {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'parent').order('first_name', { ascending: true })
  if (error) throw error
  return data
}

/** Link a parent to a student in the parent_student_link table. */
export async function linkParentToStudent(parentId, studentId) {
  const { data, error } = await supabase.from('parent_student_link').insert([{ parent_id: parentId, student_id: studentId }]).select().single()
  if (error) throw error
  return data
}

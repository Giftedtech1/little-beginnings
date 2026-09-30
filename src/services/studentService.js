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

/** Generate the next unique student ID for a given registration year (e.g. LBC-26-001). */
async function generateStudentId(registrationYear) {
  const twoDigitYear = String(registrationYear).slice(-2)
  const prefix = `LBC-${twoDigitYear}-`

  // Fetch all existing student_ids starting with this prefix to find the highest sequence number
  const { data, error } = await supabase
    .from('students')
    .select('student_id')
    .ilike('student_id', `${prefix}%`)

  if (error) {
    console.warn('Failed to fetch existing student IDs by prefix:', error)
  }

  const existingIds = new Set(
    (data || [])
      .map(s => s.student_id?.trim().toUpperCase())
      .filter(Boolean)
  )

  let maxSeq = 0
  for (const id of existingIds) {
    const match = id.match(new RegExp(`^LBC-${twoDigitYear}-(\\d+)$`, 'i'))
    if (match) {
      const num = parseInt(match[1], 10)
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num
      }
    }
  }

  let nextSeq = maxSeq + 1
  let candidateId = `${prefix}${String(nextSeq).padStart(3, '0')}`

  // Guard against any collisions with existing IDs
  while (existingIds.has(candidateId.toUpperCase())) {
    nextSeq++
    candidateId = `${prefix}${String(nextSeq).padStart(3, '0')}`
  }

  return { student_id: candidateId, nextSeq, prefix, existingIds }
}

/** Create a new student record with auto-generated ID and duplicate collision retry protection. */
export async function createStudent(student) {
  const { registration_year } = student
  if (!registration_year) throw new Error('Registration year is required.')

  const yearNum = Number(registration_year)

  // If a student_id was manually supplied, insert directly
  if (student.student_id) {
    const { data, error } = await supabase
      .from('students')
      .insert([{ ...student, registration_year: yearNum }])
      .select()
      .single()
    if (error) throw error
    return data
  }

  const { student_id: initialId, nextSeq: initialSeq, prefix, existingIds } = await generateStudentId(yearNum)

  let candidateId = initialId
  let currentSeq = initialSeq
  const MAX_RETRIES = 10
  let lastError = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { data, error } = await supabase
      .from('students')
      .insert([{ ...student, student_id: candidateId, registration_year: yearNum }])
      .select()
      .single()

    if (!error) {
      return data
    }

    // Check if the failure is a duplicate key constraint on student_id
    const isDuplicateKey =
      error.code === '23505' ||
      error.message?.includes('students_student_id_key') ||
      error.details?.includes('student_id') ||
      error.message?.toLowerCase().includes('duplicate key')

    if (isDuplicateKey) {
      existingIds.add(candidateId.toUpperCase())
      while (existingIds.has(candidateId.toUpperCase())) {
        currentSeq++
        candidateId = `${prefix}${String(currentSeq).padStart(3, '0')}`
      }
      lastError = error
      continue
    }

    // For any other error (validation, permissions, etc.), throw immediately
    throw error
  }

  throw lastError || new Error('Failed to generate a unique student ID after multiple attempts.')
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

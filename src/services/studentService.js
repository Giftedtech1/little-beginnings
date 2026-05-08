import { supabase } from './supabaseClient'

/** Fetch all students with their linked parent info. */
export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      parent_student_link (
        profiles (
          id,
          first_name,
          last_name,
          email
        )
      )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error

  // Extract all linked parents for easy access
  return data.map(s => {
    const links = s.parent_student_link || []
    const parents = links.map(link => link.profiles).filter(Boolean)
    return { ...s, linked_parents: parents }
  })
}

/** Fetch a single student by ID. */
export async function getStudentById(id) {
  const { data, error } = await supabase.from('students').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/** Create a new student record. */
export async function createStudent(student) {
  const { data, error } = await supabase.from('students').insert([student]).select().single()
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

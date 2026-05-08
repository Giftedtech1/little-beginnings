import { supabase } from './supabaseClient'

export const submitAdmission = async (admissionData) => {
  const { data, error } = await supabase
    .from('admissions')
    .insert([admissionData])
    .select()
    .single()

  if (error) {
    console.error('Submit admission error:', error)
    throw error
  }

  // If there's an access code, mark it as used
  if (admissionData.access_code_used) {
    const { error: rpcError } = await supabase.rpc('mark_access_code_used', { 
      code_param: admissionData.access_code_used, 
      email_param: admissionData.email 
    })
    if (rpcError) console.error("Could not mark code used:", rpcError)
  }

  return data
}

export const getAdmissions = async () => {
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get admissions error:', error)
    throw error
  }
  return data
}

export const updateAdmissionStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('admissions')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Update admission status error:', error)
    throw error
  }
  return data
}

export const uploadPassport = async (file) => {
  const ext = file.name.split('.').pop()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `passports/${Date.now()}_${safeName}`
  
  const { error: storageError } = await supabase.storage
    .from('admissions-media')
    .upload(path, file, { contentType: file.type, upsert: false })
    
  if (storageError) throw storageError
  
  const { data: { publicUrl } } = supabase.storage.from('admissions-media').getPublicUrl(path)
  return publicUrl
}

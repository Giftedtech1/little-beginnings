import { supabase } from './supabaseClient'

/**
 * Verify an access code
 */
export const verifyAccessCode = async (code) => {
  const { data, error } = await supabase
    .from('admission_access_codes')
    .select('*')
    .eq('code', code)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Invalid Access Code')
    }
    throw error
  }
  
  if (data.is_used) {
    throw new Error('This Access Code has already been used.')
  }
  
  return data
}

/**
 * Submit the pre-assessment form
 */
export const submitPreAssessment = async (payload) => {
  // payload: { access_code, child_name, parent_email, history_data, pre_intervention_data }
  const { data, error } = await supabase
    .from('pre_assessments')
    .insert([payload])
    .select()

  if (error) throw error
  
  // Mark the code as used (via rpc or edge function if public can't update, 
  // but since public can't update, we can either have a trigger in DB or just leave it for the edge function.
  // Actually, let's use an RPC to mark it as used securely. Or, we can just update it if we have an RPC.)
  // For simplicity, we'll assume an RPC `mark_code_used` exists or we handle it. Let's create an RPC in the migration.
  
  const { error: rpcError } = await supabase.rpc('mark_access_code_used', { code_param: payload.access_code, email_param: payload.parent_email })
  if (rpcError) console.error("Could not mark code used:", rpcError)
  
  return data
}

/**
 * Generate a new access code (Admin only)
 */
export const generateAccessCode = async () => {
  // Generate a random string e.g. LB-A7B8C
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase()
  const code = `LB-${randomChars}`
  
  const { data, error } = await supabase
    .from('admission_access_codes')
    .insert([{ code, is_used: false }])
    .select()
    
  if (error) throw error
  return data[0]
}

/**
 * Fetch all access codes (Admin only)
 */
export const fetchAccessCodes = async () => {
  const { data, error } = await supabase
    .from('admission_access_codes')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}

/**
 * Fetch all pre-assessments (Admin only)
 */
export const fetchPreAssessments = async () => {
  const { data, error } = await supabase
    .from('pre_assessments')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}

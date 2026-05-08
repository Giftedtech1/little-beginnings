import { supabase } from './supabaseClient'

export async function getPublicBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, image_url, category, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, published, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) throw error
  return data
}

export async function createBlogPost(postData) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...postData, author_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBlogPost(id, updates) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBlogPost(id) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function uploadBlogImage(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `blog/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('public_media')
    .upload(filePath, file, { contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('public_media')
    .getPublicUrl(filePath)

  return data.publicUrl
}

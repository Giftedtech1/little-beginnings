import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createBlogPost, updateBlogPost, uploadBlogImage } from '../services/blogService'
import { useToast } from '../context/ToastContext'

export default function BlogEditorModal({ post, onClose, onSave }) {
  const [title, setTitle] = useState(post?.title || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [category, setCategory] = useState(post?.category || 'General')
  const [imageUrl, setImageUrl] = useState(post?.image_url || '')
  const [published, setPublished] = useState(post?.published || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const toast = useToast()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  const generateSlug = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') + '-' + Math.random().toString(36).substr(2, 5)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const url = await uploadBlogImage(file)
      setImageUrl(url)
    } catch (error) {
      console.error('Cover image upload error:', error)
      toast.error(error?.message || 'Failed to upload cover image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleEditorImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !editor) return

    try {
      const url = await uploadBlogImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Editor image upload error:', error)
      toast.error(error?.message || 'Failed to insert image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !editor.getHTML()) {
      toast.error('Title and content are required')
      return
    }

    setIsSubmitting(true)
    try {
      const postData = {
        title,
        slug: post?.slug || generateSlug(title),
        excerpt,
        category,
        image_url: imageUrl,
        content: editor.getHTML(),
        published
      }

      if (post) {
        await updateBlogPost(post.id, postData)
        toast.success('Post updated successfully')
      } else {
        await createBlogPost(postData)
        toast.success('Post created successfully')
      }
      onSave()
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Failed to save post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="font-bold text-xl">{post ? 'Edit Post' : 'Create New Post'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title..."
              className="w-full text-3xl font-bold border-none focus:ring-0 px-0 bg-transparent placeholder-gray-300"
            />
            
            {/* Toolbar */}
            {editor && (
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-2 bg-gray-50 flex-wrap">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><b>B</b></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}><i>I</i></button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>H2</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 rounded font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>H3</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>• List</button>
                <div className="h-4 w-px bg-gray-300 mx-2" />
                <label className="cursor-pointer px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1 text-sm">
                  <ImageIcon className="w-4 h-4" /> Insert Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleEditorImageUpload} />
                </label>
              </div>
            )}
            
            <div className="flex-1 border border-gray-200 rounded-xl bg-white overflow-hidden">
              <EditorContent editor={editor} className="h-full" />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Publish Status</label>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-sm font-medium">{published ? 'Published' : 'Draft'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
                <option value="General">General</option>
                <option value="Academics">Academics</option>
                <option value="Activities">Activities</option>
                <option value="Parenting">Parenting Tips</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Short Excerpt</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 resize-none text-sm"
                placeholder="A brief summary for the blog card..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                {imageUrl ? (
                  <div className="relative group">
                    <img src={imageUrl} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                    <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    {isUploadingImage ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <label className="cursor-pointer text-sm font-semibold text-primary hover:text-primary-dark">
                          Click to upload
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary px-8 flex items-center justify-center disabled:opacity-50 min-w-[120px]">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

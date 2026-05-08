import { useState, useEffect } from 'react'
import { getAllBlogPosts, deleteBlogPost } from '../../services/blogService'
import { Loader2, Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import ConfirmModal from '../ui/ConfirmModal'
import BlogEditorModal from '../BlogEditorModal'

export default function BlogTab() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [confirmState, setConfirmState] = useState({ isOpen: false })
  const toast = useToast()

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const data = await getAllBlogPosts()
      setPosts(data)
    } catch (error) {
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Post",
      message: "Are you sure you want to delete this blog post? This action cannot be undone.",
      isDestructive: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteBlogPost(id)
          setPosts(posts.filter(p => p.id !== id))
          toast.success("Post deleted successfully")
        } catch (err) {
          toast.error("Failed to delete post")
        } finally {
          setConfirmState({ isOpen: false })
        }
      }
    })
  }

  const openEditor = (post = null) => {
    setEditingPost(post)
    setIsEditorOpen(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="font-bold text-dark flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Manage Blog Posts
        </h2>
        <button onClick={() => openEditor()} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-bold">No blog posts found.</p>
          <button onClick={() => openEditor()} className="mt-4 text-primary font-bold text-sm hover:underline">
            Create your first post
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-dark">
                    <button onClick={() => openEditor(post)} className="hover:text-primary hover:underline text-left">
                      {post.title}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${post.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditor(post)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {isEditorOpen && (
        <BlogEditorModal 
          post={editingPost} 
          onClose={() => setIsEditorOpen(false)} 
          onSave={() => {
            setIsEditorOpen(false)
            fetchPosts()
          }} 
        />
      )}

      <ConfirmModal 
        {...confirmState} 
        onCancel={() => setConfirmState({ isOpen: false })} 
      />
    </div>
  )
}

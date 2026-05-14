import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, Tag, Share2, Link2, Check, Loader2, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { getBlogPostBySlug } from '../services/blogService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function estimateReadTime(content) {
  if (!content) return 1
  const text = content.replace(/<[^>]+>/g, '')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function ShareButton({ post }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href
  const title = post?.title || ''

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noreferrer"
        className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-colors"
        title="Share on Twitter"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank" rel="noreferrer"
        className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
        title="Share on Facebook"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      </a>
      <button
        onClick={copyLink}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
        title="Copy link"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchPost = async () => {
      try {
        setLoading(true)
        const data = await getBlogPostBySlug(slug)
        setPost(data)
      } catch (err) {
        setError('This post may have been removed or unpublished.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto mb-4" />
            <p className="text-muted text-sm">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-dark dark:text-white mb-3">Post Not Found</h1>
          <p className="text-muted dark:text-gray-400 mb-8 max-w-sm">{error || 'The post you are looking for does not exist.'}</p>
          <Link to="/#blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const readTime = estimateReadTime(post.content)
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />

      {/* Hero / Header */}
      <section className="pt-28 pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/#blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </motion.div>

          {/* Category + Meta */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            {post.category && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#e6f6fb', color: '#0192c6' }}
              >
                <Tag className="w-3 h-3" /> {post.category}
              </span>
            )}
            <span className="text-muted text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-muted text-sm flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark dark:text-white leading-tight mb-8"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg sm:text-xl text-muted dark:text-gray-300 leading-relaxed mb-10 border-l-4 pl-5"
              style={{ borderColor: '#0192c6' }}
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Top Share Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-gray-100 dark:border-slate-700 mb-0"
          >
            <div className="flex items-center gap-3 text-sm text-muted dark:text-gray-400">
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
                LB
              </div>
              <div>
                <p className="font-bold text-dark dark:text-white text-sm">Little Beginnings</p>
                <p className="text-xs">Learning Center</p>
              </div>
            </div>
            <ShareButton post={post} />
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      {post.image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"
        >
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-slate-800">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Article Body */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
      >
        <div
          className={`
            prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-extrabold prose-headings:text-dark dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-brand prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-dark dark:prose-strong:text-white
            prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:bg-brand/5 dark:prose-blockquote:bg-brand/10 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-dark dark:prose-blockquote:text-gray-200
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-hr:border-gray-200 dark:prose-hr:border-slate-700
            prose-code:text-brand prose-code:bg-brand/10 prose-code:rounded prose-code:px-1 prose-code:font-normal
          `}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>

      {/* Bottom CTA + Share */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="border-t border-gray-100 dark:border-slate-700 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <ShareButton post={post} />
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> More Articles
          </Link>
        </div>

        {/* CTA Banner */}
        <div
          className="mt-12 rounded-3xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: '#0192c6' }}
        >
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Little Beginnings Learning Center</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">
            Ready to support your child's journey?
          </h2>
          <p className="text-white/80 text-sm mb-7 max-w-md mx-auto">
            Our certified specialists are here to help. Schedule an assessment or apply for admission today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center font-bold px-7 py-3 rounded-full bg-white text-brand hover:bg-gray-100 transition-colors shadow-md"
            >
              Apply for Admission
            </Link>
            <a
              href="/#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center font-bold px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

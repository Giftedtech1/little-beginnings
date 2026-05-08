import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Loader2 } from 'lucide-react'
import WaveDivider from './WaveDivider'
import { getPublicBlogPosts } from '../services/blogService'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPublicBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error('Failed to load blog posts:', error)
        setFetchError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <section id="blog" className="py-24 bg-teal-pale min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="section-title">
            Our <span className="text-brand">Blog</span>
          </h2>
          <p className="section-subtitle">
            Expert articles, tips, and guides to help you support your child at home and in school.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : fetchError ? (
          <div className="text-center py-20 text-red-500 text-sm">
            Could not load blog posts. Please try again later.
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted">
            No blog posts available at the moment.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '150px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <motion.article
                key={post.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-card dark:shadow-none border border-transparent dark:border-slate-700 overflow-hidden group cursor-pointer"
              >
                <div className="h-52 overflow-hidden relative bg-gray-100">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-slate-800/90 text-primary dark:text-white text-xs font-bold px-3 py-1 rounded-full">
                      {post.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted dark:text-gray-400 mb-3">
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 5 min read
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-dark dark:text-white text-base leading-snug mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-muted dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-white hover:text-primary-light transition-colors"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <span className="btn-outline cursor-default opacity-50">
            More Articles Coming Soon <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      <WaveDivider color="#ffffff" variant="wave" height="md" className="mt-16" />
    </section>
  )
}

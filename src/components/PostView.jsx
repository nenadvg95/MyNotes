import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext.jsx'
import CommentSection from './CommentSection.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostView() {
  const { slug } = useParams()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (active) {
          setPost(data)
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [slug])

  async function handleDelete() {
    if (!confirm('Delete this entry for good?')) return
    await supabase.from('posts').delete().eq('id', post.id)
    navigate('/')
  }

  if (loading) return <p className="muted">Loading…</p>
  if (!post) return <p className="muted">This entry doesn't exist.</p>

  return (
    <article className="entry-shell">
      <div className="entry-meta-row">
        <span className="entry-date">{formatDate(post.created_at)}</span>
        {!post.published && <span className="draft-tag">Draft</span>}
      </div>
      <h1 className="entry-full-title">{post.title}</h1>
      <div className="entry-body">
        {post.content.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {isAdmin && (
        <div className="entry-admin-bar">
          <Link to={`/edit/${post.slug}`} className="btn btn-ghost">
            Edit
          </Link>
          <button className="btn btn-ghost btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      <CommentSection postId={post.id} />
    </article>
  )
}

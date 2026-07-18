import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function excerpt(text, len = 220) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > len ? clean.slice(0, len).trim() + '…' : clean
}

export default function PostList() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (active) {
          setPosts(data || [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="muted">Loading entries…</p>

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p className="eyebrow">Nothing here yet</p>
        <h2>The first page is blank.</h2>
        {isAdmin && (
          <Link to="/new" className="btn btn-primary">
            Write your first entry
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="entry-list">
      {posts.map((post, i) => (
        <Link to={`/post/${post.slug}`} className="entry-card" key={post.id}>
          <div className="entry-card-meta">
            <span className="entry-index">{String(posts.length - i).padStart(2, '0')}</span>
            <span className="entry-date">{formatDate(post.created_at)}</span>
            {!post.published && <span className="draft-tag">Draft</span>}
          </div>
          <h2 className="entry-title">{post.title}</h2>
          <p className="entry-excerpt">{excerpt(post.content)}</p>
        </Link>
      ))}
    </div>
  )
}

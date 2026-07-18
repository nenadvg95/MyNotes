import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function CommentSection({ postId }) {
  const { isAdmin } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [posting, setPosting] = useState(false)

  async function loadComments() {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!content.trim()) return
    if (!isAdmin && !authorName.trim()) {
      setError('Add your name so people know who said it.')
      return
    }
    setPosting(true)
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author_name: isAdmin ? 'Nenad' : authorName.trim(),
      content: content.trim(),
      is_admin: isAdmin,
    })
    setPosting(false)
    if (error) {
      setError(error.message)
      return
    }
    setContent('')
    loadComments()
  }

  async function handleDelete(id) {
    await supabase.from('comments').delete().eq('id', id)
    loadComments()
  }

  return (
    <section className="comments">
      <p className="eyebrow">
        {comments.length === 0 ? 'No thoughts yet' : `${comments.length} thought${comments.length === 1 ? '' : 's'}`}
      </p>

      {!loading && (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className={`comment ${c.is_admin ? 'comment-admin' : ''}`}>
              <div className="comment-head">
                <span className="comment-author">{c.author_name}</span>
                <span className="comment-date">{formatDate(c.created_at)}</span>
              </div>
              <p className="comment-body">{c.content}</p>
              {isAdmin && (
                <button className="comment-delete" onClick={() => handleDelete(c.id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        {!isAdmin && (
          <input
            className="comment-name-input"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        )}
        <textarea
          className="comment-text-input"
          placeholder={isAdmin ? 'Reply as Nenad…' : 'Say something…'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-ghost" disabled={posting}>
          {posting ? 'Posting…' : isAdmin ? 'Reply' : 'Comment'}
        </button>
      </form>
    </section>
  )
}

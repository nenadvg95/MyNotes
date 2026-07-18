import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

export default function PostEditor() {
  const { slug } = useParams()
  const isEditing = !!slug
  const navigate = useNavigate()

  const [postId, setPostId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        if (data) {
          setPostId(data.id)
          setTitle(data.title)
          setContent(data.content)
          setPublished(data.published)
        }
        setLoading(false)
      })
  }, [slug, isEditing])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim()) {
      setError('Give it a title and some words.')
      return
    }
    setSaving(true)

    if (isEditing) {
      const { error } = await supabase
        .from('posts')
        .update({ title, content, published, updated_at: new Date().toISOString() })
        .eq('id', postId)
      setSaving(false)
      if (error) return setError(error.message)
      navigate(`/post/${slug}`)
    } else {
      const baseSlug = slugify(title) || 'entry'
      const finalSlug = `${baseSlug}-${Date.now().toString(36)}`
      const { error } = await supabase
        .from('posts')
        .insert({ title, content, published, slug: finalSlug })
      setSaving(false)
      if (error) return setError(error.message)
      navigate(`/post/${finalSlug}`)
    }
  }

  if (loading) return <p className="muted">Loading…</p>

  return (
    <div className="entry-shell">
      <form className="editor-form" onSubmit={handleSubmit}>
        <p className="eyebrow">{isEditing ? 'Editing entry' : 'New entry'}</p>
        <input
          className="editor-title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          className="editor-body-input"
          placeholder="Write freely. Leave a blank line between paragraphs."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
        />
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published (visible to everyone)</span>
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="editor-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Publish entry'}
          </button>
        </div>
      </form>
    </div>
  )
}

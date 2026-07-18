import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, ADMIN_EMAIL } from '../supabaseClient'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })
    setBusy(false)
    if (error) {
      setError('Wrong password.')
      return
    }
    navigate('/')
  }

  return (
    <div className="entry-shell">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Author access</p>
        <h1>Sign in</h1>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

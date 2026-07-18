import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isAdmin) return <Navigate to="/login" replace />
  return children
}

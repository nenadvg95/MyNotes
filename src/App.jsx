import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import PostList from './components/PostList.jsx'
import PostView from './components/PostView.jsx'
import PostEditor from './components/PostEditor.jsx'
import Login from './components/Login.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'

export default function App() {
  return (
    <div className="page">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:slug" element={<PostView />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/new"
            element={
              <RequireAdmin>
                <PostEditor />
              </RequireAdmin>
            }
          />
          <Route
            path="/edit/:slug"
            element={
              <RequireAdmin>
                <PostEditor />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

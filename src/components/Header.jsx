import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Header() {
  const { isAdmin, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="wordmark">
          MyNotes
          <span className="wordmark-index">by Nenad</span>
        </Link>
        <nav className="site-nav">
          {isAdmin ? (
            <>
              <Link to="/new" className="nav-link nav-link-accent">
                New entry
              </Link>
              <button className="nav-link nav-button" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

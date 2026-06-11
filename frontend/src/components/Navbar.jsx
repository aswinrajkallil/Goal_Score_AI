import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          ⚽ GoalScore AI
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/fixtures"
            className={`nav-link ${isActive("/fixtures") ? "active" : ""}`}
          >
            Fixtures
          </Link>
          <Link
            to="/standings"
            className={`nav-link ${isActive("/standings") ? "active" : ""}`}
          >
            Standings
          </Link>
          <Link
            to="/chat"
            className={`nav-link ${isActive("/chat") ? "active" : ""}`}
          >
            AI Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
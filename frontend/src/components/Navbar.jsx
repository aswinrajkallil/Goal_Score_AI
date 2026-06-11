import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-container">
        <Link to="/" className="logo" aria-label="GoalScore AI Home">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">
            GoalScore <span className="logo-highlight">AI</span>
          </span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className={`hamburger-btn ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Links */}
        <div
          id="nav-menu"
          className={`nav-links ${menuOpen ? "open" : ""}`}
          role="menubar"
        >
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            role="menuitem"
          >
            Home
          </Link>
          <Link
            to="/fixtures"
            className={`nav-link ${isActive("/fixtures") ? "active" : ""}`}
            role="menuitem"
          >
            Fixtures
          </Link>
          <Link
            to="/standings"
            className={`nav-link ${isActive("/standings") ? "active" : ""}`}
            role="menuitem"
          >
            Standings
          </Link>
          <Link
            to="/chat"
            className={`nav-link chat-link ${isActive("/chat") ? "active" : ""}`}
            role="menuitem"
          >
            <span className="chat-link-pulse"></span>
            GoalScore AI Chat
          </Link>
        </div>
      </div>
      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          className="navbar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}

export default Navbar;
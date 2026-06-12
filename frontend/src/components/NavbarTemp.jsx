import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ hasLiveMatches = false }) {
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Manage focus: move focus into menu on open and trap focus
  useEffect(() => {
    if (!menuOpen) return;

    const el = menuRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // focus first focusable element
    if (first) first.focus();

    const handleKey = (e) => {
      if (e.key === "Tab") {
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Restore focus to hamburger when menu closes
  useEffect(() => {
    if (!menuOpen) {
      // small delay to avoid stealing focus during route navigation
      setTimeout(() => {
        hamburgerRef.current?.focus();
      }, 50);
    }
  }, [menuOpen]);

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
        ref={hamburgerRef}
      >
      <div className="hamburger-icon">
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
      </button>

        {/* Navigation Links */}
        <div
          id="nav-menu"
          ref={menuRef}
          className={`nav-links ${menuOpen ? "open" : ""}`}
          role="menubar"
          aria-hidden={!menuOpen}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            role="menuitem"
          >
            Home
          </Link>
          <Link
            to="/fixtures"
            onClick={() => setMenuOpen(false)}
            className={`nav-link ${isActive("/fixtures") ? "active" : ""}`}
            role="menuitem"
          >
            Fixtures
            {hasLiveMatches && (
              <span className="nav-live-indicator" aria-label="Live matches active">
                LIVE
              </span>
            )}
          </Link>
          <Link
            to="/standings"
            onClick={() => setMenuOpen(false)}
            className={`nav-link ${isActive("/standings") ? "active" : ""}`}
            role="menuitem"
          >
            Standings
          </Link>
          <Link
            to="/chat"
            onClick={() => setMenuOpen(false)}
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

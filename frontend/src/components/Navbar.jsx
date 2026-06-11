import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">⚽ GoalScore AI</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/fixtures">Fixtures</Link>
        <Link to="/standings">Standings</Link>
        <Link to="/chat">AI Chat</Link>
      </div>
    </nav>
  );
}

export default Navbar;
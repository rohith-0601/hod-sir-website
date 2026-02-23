import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  // Hide navbar on Home and Admin
  if (location.pathname === "/" || location.pathname === "/update" || location.pathname === "/research" || location.pathname === "/publication") {
    return null;
  }

  return (
    <nav className="academic-navbar">

      <div className="nav-container">

        {/* Left Brand */}
        <div className="nav-brand">
          <span className="brand-name">
            Dr. Digvijay S. Pawar
          </span>
        </div>

        {/* Right Links */}
        <div className="nav-links">

          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <NavLink to="/teaching" className="nav-link">
            Teaching
          </NavLink>

          <NavLink to="/research" className="nav-link">
            Research
          </NavLink>

          <NavLink to="/publication" className="nav-link">
            Publications
          </NavLink>

          <NavLink to="/gallery" className="nav-link">
            Gallery
          </NavLink>

          <NavLink to="/other" className="nav-link">
            Other
          </NavLink>

        </div>
      </div>

    </nav>
  );
};

export default Navbar;

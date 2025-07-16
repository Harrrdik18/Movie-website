import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavbarAlt.css";

const NavbarAlt = ({ onSearch, isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.querySelector(".search-input-alt")?.focus();
      }, 300);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar-alt ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand-alt">
          <Link to="/" className="logo-alt">
            <div className="logo-icon">🎬</div>
            <span className="logo-text">CineVault</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <div className={`search-container-alt ${isSearchOpen ? "open" : ""}`}>
            <button className="search-toggle" onClick={toggleSearch}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search movies & series..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input-alt"
              />
            </div>
          </div>

          <div className="auth-section">
            {isLoggedIn ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `profile-link ${isActive ? "active" : ""}`
                }
              >
                <div className="profile-avatar">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </NavLink>
            ) : (
              <div className="auth-buttons">
                <NavLink to="/login" className="auth-btn login-btn">
                  Sign In
                </NavLink>
                <NavLink to="/register" className="auth-btn register-btn">
                  Join Now
                </NavLink>
              </div>
            )}
          </div>
        </div>

        <div className={`navbar-menu-alt ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link-alt ${isActive ? "active" : ""}`
              }
              end
            >
              <span className="link-text">Home</span>
              <div className="link-underline"></div>
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `nav-link-alt ${isActive ? "active" : ""}`
              }
            >
              <span className="link-text">Movies</span>
              <div className="link-underline"></div>
            </NavLink>
            <NavLink
              to="/tv-series"
              className={({ isActive }) =>
                `nav-link-alt ${isActive ? "active" : ""}`
              }
            >
              <span className="link-text">Series</span>
              <div className="link-underline"></div>
            </NavLink>
            <NavLink
              to="/genre"
              className={({ isActive }) =>
                `nav-link-alt ${isActive ? "active" : ""}`
              }
            >
              <span className="link-text">Genres</span>
              <div className="link-underline"></div>
            </NavLink>
            <NavLink
              to="/country"
              className={({ isActive }) =>
                `nav-link-alt ${isActive ? "active" : ""}`
              }
            >
              <span className="link-text">Countries</span>
              <div className="link-underline"></div>
            </NavLink>
          </div>
        </div>

        <button className="menu-toggle-alt" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarAlt;

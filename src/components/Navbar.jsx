import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          CineGlance
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
      </div>

      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="navbar-start">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
            Home
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? 'active' : ''}>
            Movies
          </NavLink>
          <NavLink to="/tv-series" className={({ isActive }) => isActive ? 'active' : ''}>
            TV Series
          </NavLink>
          <NavLink to="/genre" className={({ isActive }) => isActive ? 'active' : ''}>
            Genre
          </NavLink>
          <NavLink to="/country" className={({ isActive }) => isActive ? 'active' : ''}>
            Country
          </NavLink>
        </div>

        <div className="navbar-end">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

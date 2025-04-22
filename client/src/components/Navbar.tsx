import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the CSS file for styling

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">MenuX</h1>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
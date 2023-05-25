import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="flex">
        <img src={logo} alt="" />
        <h4>Forecaster</h4>
      </Link>
    </nav>
  );
};

export default Navbar;

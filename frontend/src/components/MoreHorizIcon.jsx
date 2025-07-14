import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './MoreHorizIcon.css';

const MoreHorizIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="more-horiz-icon-container" ref={dropdownRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth={2}
        onClick={toggleDropdown}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      {isOpen && (
        <div className="dropdown-menu">
          <NavLink to="/community" className="dropdown-item" activeClassName="active">
            Community
          </NavLink>
          <NavLink to="/lost-and-found" className="dropdown-item" activeClassName="active">
            Lost and Found
          </NavLink>
          <NavLink to="/profile" className="dropdown-item" activeClassName="active">
            Profile
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default MoreHorizIcon;
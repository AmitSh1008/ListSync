import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import '../Styles/Navbar.css';

function HamburgerMenu({ isLoggedIn, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
  
    const closeMenu = () => {
      setIsOpen(false);
    };
  
    const menuItems = (
      <ul className="menu-items">
        {isLoggedIn ? (
          <>
            <li className={location.pathname === '/lists' ? 'active' : ''}>
              <Link to="/lists" onClick={closeMenu}>רשימות</Link>
            </li>
            <li>
              <a href="#" onClick={() => { onLogout(); closeMenu(); }}>התנתק</a>
            </li>
          </>
        ) : (
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/" onClick={closeMenu}>התחבר/הירשם</Link>
          </li>
        )}
      </ul>
    );
  
    return (
        <nav className={`responsive-menu ${isMobile ? 'mobile' : ''}`}>
          {isMobile && (
            <button className="menu-toggle" onClick={toggleMenu}>
              {isOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          )}
          {isMobile ? (
            <>
              <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}></div>
              <div className={`menu ${isOpen ? 'open' : ''}`}>
                {menuItems}
              </div>
            </>
          ) : (
            <div className="desktop-menu">{menuItems}</div>
          )}
        </nav>
      );
    }

export default HamburgerMenu;

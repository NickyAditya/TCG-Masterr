import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css'; // Using the existing CSS file
import { AuthContext } from '../App'; // Import the context

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  // Get user state from context
  const { user, setUser } = useContext(AuthContext);

  // Effect to sync the local user state with props and localStorage
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      // Fallback to localStorage if props are not provided
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          // Also update the parent component if setUser is provided
          if (setUser) setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error reading user from localStorage:", error);
      }
    }
  }, [user, setUser]);

  // Handle userLogin events
  useEffect(() => {
    const handleUserLogin = (event) => {
      console.log("Navbar detected login:", event.detail);
      setCurrentUser(event.detail);
    };

    window.addEventListener('userLogin', handleUserLogin);
    
    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    if (setUser) setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">TCG Master</Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
        
        {currentUser ? (
          <>
            <li className="user-greeting">Hi, {currentUser.email}</li>
            {currentUser.role === 'admin' && (
              <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link></li>
            )}
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login" onClick={() => setIsMenuOpen(false)} className="login-btn">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
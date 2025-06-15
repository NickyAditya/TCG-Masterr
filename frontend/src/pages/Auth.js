// src/pages/Auth.js
import React, { useEffect, useState, useContext } from 'react';
import './Auth.css';
import './AuthStyles.css'; // Import our scoped styles
import 'boxicons/css/boxicons.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Import the context

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/');
      return;
    }    const container = document.getElementById('auth-container');
    setTimeout(() => {
      container.classList.add('sign-in');
    }, 200);
  }, [navigate]);

  const toggle = () => {
    setError('');    const container = document.getElementById('auth-container');
    container.classList.toggle('sign-in');
    container.classList.toggle('sign-up');
  };  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/login', loginData);
      const userData = res.data;

      // Update the global user state through context
      // This will also update localStorage and dispatch events
      if (setUser) {
        setUser(userData);
      }

      // Navigate based on user role - do this after setting the user state
      // This ensures the navbar will already have the updated state when the next page renders
      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 100); // Small delay to ensure state updates first
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/register', { 
        username: registerData.username, 
        email: registerData.email, 
        password: registerData.password, 
        role: 'user' 
      });
      
      // Show success message
      alert('Registration successful! Please login.');
      
      // Reset form and toggle to login
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      toggle();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };  return (
    <div id="auth-container" className="container">
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <h2>Create an Account</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleRegister}>
                <div className="input-group">
                  <i className='bx bxs-user'></i>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    required
                    value={registerData.username}
                    onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <i className='bx bx-mail-send'></i>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required
                    value={registerData.email}
                    onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={registerData.password}
                    onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required
                    value={registerData.confirmPassword}
                    onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign up'}
                </button>
              </form>
              <p>
                <span>Already have an account?</span>
                <b onClick={toggle} className="pointer">Sign in here</b>
              </p>
            </div>
          </div>
        </div>

        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <h2>Welcome Back</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <i className='bx bxs-user'></i>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    required
                    value={loginData.username}
                    onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <i className='bx bxs-lock-alt'></i>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign in'}
                </button>
                <p>
                  <span>Don't have an account?</span>
                  <b onClick={toggle} className="pointer">Sign up here</b>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="row content-row">
        {/* SIGN IN CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
            <h2>TCG Master</h2>
            <p>Master Card Born Here!</p>
          </div>
          <div className="img sign-in">
          </div>
        </div>
        {/* SIGN UP CONTENT */}
        <div className="col align-items-center flex-col">
          <div className="img sign-up">
          </div>
          <div className="text sign-up">
            <h2>Join Us!</h2>
            <p>Buy, sell, and trade the best TCG cards today!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
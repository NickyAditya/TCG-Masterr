import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-container">
      <AdminNavbar />
      
      <Routes>
        <Route path="/" element={<UserManagement />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    email: '',
    role: 'user',
    password: ''
  });
  
  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const openAddModal = () => {
    setCurrentUser({
      id: '',
      username: '',
      email: '',
      role: 'user',
      password: ''
    });
    setModalMode('add');
    setIsModalOpen(true);
  };
  
  const openEditModal = (user) => {
    setCurrentUser({
      ...user,
      password: '' // Don't include password in edit mode
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setModalMode('delete');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        // Add new user
        await axios.post('http://localhost:5000/api/users', currentUser);
      } else if (modalMode === 'edit') {
        // Update existing user
        await axios.put(`http://localhost:5000/api/users/${currentUser.id}`, currentUser);
      } else if (modalMode === 'delete') {
        // Delete user
        await axios.delete(`http://localhost:5000/api/users/${currentUser.id}`);
      }
      
      // Refresh user list
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="user-management">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <h2>User List</h2>
          <button className="admin-btn add-btn" onClick={openAddModal}>
            Add New User
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="action-btn edit" onClick={() => openEditModal(user)}>
                          Edit
                        </button>
                        <button className="action-btn delete" onClick={() => openDeleteModal(user)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal for Add/Edit/Delete */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Add New User'}
                {modalMode === 'edit' && 'Edit User'}
                {modalMode === 'delete' && 'Delete User'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {modalMode !== 'delete' ? (
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={currentUser.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      name="role"
                      value={currentUser.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">
                      {modalMode === 'edit' ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={currentUser.password}
                      onChange={handleInputChange}
                      required={modalMode === 'add'}
                    />
                  </div>
                </div>
              ) : (
                <div className="modal-body">
                  <p>Are you sure you want to delete user <strong>{currentUser.username}</strong>?</p>
                  <p>This action cannot be undone.</p>
                </div>
              )}
              
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn ${
                    modalMode === 'delete' ? 'delete-btn' : 
                    modalMode === 'add' ? 'add-btn' : 'edit-btn'
                  }`}
                >
                  {modalMode === 'add' && 'Add User'}
                  {modalMode === 'edit' && 'Update User'}
                  {modalMode === 'delete' && 'Delete User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

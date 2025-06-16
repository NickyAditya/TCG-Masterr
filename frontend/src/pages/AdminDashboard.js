import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="admin-container">
      <AdminNavbar />
      
      <div className="admin-tabs">
        <Link 
          to="/admin/users" 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </Link>
        <Link 
          to="/admin/cards" 
          className={`admin-tab ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          Cards
        </Link>
        <Link 
          to="/admin/transactions" 
          className={`admin-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </Link>
      </div>
      
      <Routes>
        <Route path="/" element={<UserManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/cards" element={<CardManagement />} />
        <Route path="/transactions" element={<TransactionManagement />} />
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
                  <th>Balance</th>
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
                      <td>Rp.{user.balance}</td>
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

// Card Management Component
function CardManagement() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    id: '',
    name: '',
    game: 'pokemon', // pokemon, yugioh, mtg
    set: '',
    rarity: '',
    price: 0,
    stock: 0,
    image: ''
  });
  
  // Load cards on component mount
  useEffect(() => {
    fetchCards();
  }, []);
  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cards');
      
      // Map backend data to frontend format if needed
      const mappedCards = response.data.map(card => ({
        id: card.id,
        name: card.name,
        game: card.game,
        set: card.card_set,
        rarity: card.rarity,
        price: parseFloat(card.price),
        stock: card.stock,
        image: card.image
      }));
      
      setCards(mappedCards);
      setError('');
    } catch (err) {
      console.error('Error fetching cards:', err);
      
      // More specific error message if it might be a database setup issue
      if (err.response && err.response.status === 500) {
        setError('Failed to load cards. Please make sure the cards_table.sql has been imported to your database.');
      } else {
        setError('Failed to load cards. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const openAddModal = () => {
    setCurrentCard({
      id: '',
      name: '',
      game: 'pokemon',
      set: '',
      rarity: '',
      price: 0,
      stock: 0,
      image: ''
    });
    setModalMode('add');
    setIsModalOpen(true);
  };
  
  const openEditModal = (card) => {
    setCurrentCard({...card});
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const openDeleteModal = (card) => {
    setCurrentCard(card);
    setModalMode('delete');
    setIsModalOpen(true);
  };
  
  const openStockModal = (card) => {
    setCurrentCard({...card});
    setModalMode('stock');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number inputs
    if (name === 'price' || name === 'stock') {
      setCurrentCard(prevState => ({
        ...prevState,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setCurrentCard(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {      // Prepare the card data for API
      const cardData = {
        name: currentCard.name,
        game: currentCard.game,
        set: currentCard.set, // Backend expects this as card_set, but API handles the conversion
        rarity: currentCard.rarity,
        price: currentCard.price,
        stock: currentCard.stock,
        image: currentCard.image
      };
      
      setIsSubmitting(true); // Start submitting
      
      if (modalMode === 'add') {
        // Add new card via API
        await axios.post('http://localhost:5000/api/cards', cardData);
        // Refresh the card list
        fetchCards();
      } else if (modalMode === 'edit') {
        // Update existing card via API
        await axios.put(`http://localhost:5000/api/cards/${currentCard.id}`, cardData);
        // Refresh the card list
        fetchCards();
      } else if (modalMode === 'stock') {
        // Update only the stock via API
        await axios.patch(`http://localhost:5000/api/cards/${currentCard.id}/stock`, { 
          stock: currentCard.stock 
        });
        // Refresh the card list
        fetchCards();
      } else if (modalMode === 'delete') {
        // Delete card via API
        await axios.delete(`http://localhost:5000/api/cards/${currentCard.id}`);
        // Refresh the card list
        fetchCards();
      }
      
      // Close modal after operation
      closeModal();
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // End submitting
    }
  };

  // Function to get game display name
  const getGameDisplayName = (game) => {
    switch(game) {
      case 'pokemon': return 'Pokémon';
      case 'yugioh': return 'Yu-Gi-Oh!';
      case 'mtg': return 'MTG';
      default: return game;
    }
  };

  return (
    <div className="user-management">
      <div className="admin-header">
        <h1>Card Management</h1>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <h2>Card Inventory</h2>
          <button className="admin-btn add-btn" onClick={openAddModal}>
            Add New Card
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading cards...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Game</th>
                  <th>Set</th>
                  <th>Rarity</th>
                  <th>Price ($)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.length > 0 ? (
                  cards.map(card => (
                    <tr key={card.id} className={card.stock === 0 ? 'out-of-stock-row' : ''}>
                      <td>{card.id}</td>
                      <td>
                        <div className="card-thumbnail">
                          <img src={card.image || '/images/cards/card-placeholder.jpg'} alt={card.name} />
                        </div>
                      </td>
                      <td>{card.name}</td>
                      <td>
                        <span className={`game-badge ${card.game}`}>
                          {getGameDisplayName(card.game)}
                        </span>
                      </td>
                      <td>{card.set}</td>
                      <td>
                        <span className={`rarity-badge ${card.rarity.toLowerCase().replace(' ', '-')}`}>
                          {card.rarity}
                        </span>
                      </td>
                      <td>${card.price.toFixed(2)}</td>
                      <td>
                        <span className={`stock-badge ${card.stock === 0 ? 'out-of-stock' : ''}`}>
                          {card.stock}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="action-btn stock" onClick={() => openStockModal(card)}>
                          Stock
                        </button>
                        <button className="action-btn edit" onClick={() => openEditModal(card)}>
                          Edit
                        </button>
                        <button className="action-btn delete" onClick={() => openDeleteModal(card)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No cards found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal for Add/Edit/Delete/Stock */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Add New Card'}
                {modalMode === 'edit' && 'Edit Card'}
                {modalMode === 'delete' && 'Delete Card'}
                {modalMode === 'stock' && 'Update Stock'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {modalMode !== 'delete' ? (
                <div className="modal-body">
                  {/* Only show these fields for add and edit modes */}
                  {(modalMode === 'add' || modalMode === 'edit') && (
                    <>
                      <div className="form-group">
                        <label htmlFor="name">Card Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={currentCard.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="game">Game</label>
                        <select
                          id="game"
                          name="game"
                          value={currentCard.game}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="pokemon">Pokémon</option>
                          <option value="yugioh">Yu-Gi-Oh!</option>
                          <option value="mtg">Magic: The Gathering</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="set">Card Set</label>
                        <input
                          type="text"
                          id="set"
                          name="set"
                          value={currentCard.set}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="rarity">Rarity</label>
                        <input
                          type="text"
                          id="rarity"
                          name="rarity"
                          value={currentCard.rarity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="price">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          id="price"
                          name="price"
                          value={currentCard.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="image">Image URL</label>
                        <input
                          type="text"
                          id="image"
                          name="image"
                          value={currentCard.image}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                    {/* Show stock field for all modes except delete */}
                  <div className="form-group">
                    <label htmlFor="stock">Stock Quantity</label>
                    {modalMode === 'stock' ? (
                      <div className="stock-update-container">
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={currentCard.stock}
                          onChange={handleInputChange}
                          required
                          min="0"
                        />
                        <div className="stock-controls">
                          <button 
                            type="button" 
                            onClick={() => setCurrentCard({...currentCard, stock: Math.max(0, currentCard.stock - 1)})}
                            disabled={currentCard.stock <= 0}
                          >-</button>
                          <button 
                            type="button" 
                            onClick={() => setCurrentCard({...currentCard, stock: currentCard.stock + 1})}
                          >+</button>
                        </div>
                      </div>
                    ) : (
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={currentCard.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    )}
                    {currentCard.stock === 0 && (
                      <small className="out-of-stock">This card is out of stock!</small>
                    )}
                    {currentCard.stock > 0 && currentCard.stock <= 3 && (
                      <small className="low-stock">Low stock warning!</small>
                    )}
                  </div>
                </div>
              ) : (
                <div className="modal-body">
                  <p>Are you sure you want to delete <strong>{currentCard.name}</strong>?</p>
                  <p>This action cannot be undone.</p>
                </div>
              )}
              
              <div className="modal-footer">
                <button type="button" className="btn cancel-btn" onClick={closeModal}>
                  Cancel
                </button>                <button 
                  type="submit" 
                  className={`btn ${
                    modalMode === 'delete' ? 'delete-btn' : 
                    modalMode === 'add' ? 'add-btn' : 
                    modalMode === 'stock' ? 'stock-btn' : 'edit-btn'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : (
                    modalMode === 'add' ? 'Add Card' :
                    modalMode === 'edit' ? 'Update Card' :
                    modalMode === 'delete' ? 'Delete Card' : 
                    'Update Stock'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Transaction Management Component
function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  
  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const viewTransactionDetails = async (transaction) => {
    setCurrentTransaction(transaction);
    setLoadingDetails(true);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/${transaction.id}`);
      setTransactionItems(response.data);
      setShowDetails(true);
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      setError('Failed to load transaction details.');
    } finally {
      setLoadingDetails(false);
    }
  };
  
  const closeDetails = () => {
    setShowDetails(false);
    setCurrentTransaction(null);
    setTransactionItems([]);
  };
  
  const updateTransactionStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}/status`, { status: newStatus });
      
      // Update the transaction in the local state
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t.id === id ? { ...t, status: newStatus } : t
        )
      );
      
      if (currentTransaction && currentTransaction.id === id) {
        setCurrentTransaction({ ...currentTransaction, status: newStatus });
      }
      
    } catch (err) {
      console.error('Error updating transaction status:', err);
      setError('Failed to update transaction status.');
    }
  };
  
  // Filter functions
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Filter by status
      if (filterStatus !== 'all' && transaction.status !== filterStatus) {
        return false;
      }
      
      // Filter by date range
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        const transactionDate = new Date(transaction.transaction_date);
        if (transactionDate < fromDate) {
          return false;
        }
      }
      
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999); // End of the day
        const transactionDate = new Date(transaction.transaction_date);
        if (transactionDate > toDate) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="transaction-management">
      <div className="admin-header">
        <h1>Transaction Logs</h1>
      </div>
      
      <div className="admin-content">
        <div className="content-header">
          <h2>Transaction History</h2>
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>From:</label>
              <input 
                type="date" 
                value={filterDateFrom} 
                onChange={(e) => setFilterDateFrom(e.target.value)} 
              />
            </div>
            
            <div className="filter-group">
              <label>To:</label>
              <input 
                type="date" 
                value={filterDateTo} 
                onChange={(e) => setFilterDateTo(e.target.value)} 
              />
            </div>
            
            <button 
              className="admin-btn" 
              onClick={() => {
                setFilterStatus('all');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredTransactions().length > 0 ? (
                  getFilteredTransactions().map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.username} (ID: {transaction.user_id})</td>
                      <td>{formatDate(transaction.transaction_date)}</td>
                      <td>Rp. {parseFloat(transaction.total_amount).toLocaleString('id-ID')}</td>
                      <td>
                        <span className={`status-badge ${transaction.status}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="action-btn view" 
                          onClick={() => viewTransactionDetails(transaction)}
                        >
                          Details
                        </button>
                        <div className="status-actions">
                          <select 
                            value={transaction.status}
                            onChange={(e) => updateTransactionStatus(transaction.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Transaction Details Modal */}
      {showDetails && currentTransaction && (
        <div className="modal-overlay">
          <div className="modal transaction-details-modal">
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="close-btn" onClick={closeDetails}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="transaction-info">
                <div className="info-row">
                  <strong>Transaction ID:</strong> 
                  <span>{currentTransaction.id}</span>
                </div>
                <div className="info-row">
                  <strong>User:</strong> 
                  <span>{currentTransaction.username} (ID: {currentTransaction.user_id})</span>
                </div>
                <div className="info-row">
                  <strong>Date:</strong> 
                  <span>{formatDate(currentTransaction.transaction_date)}</span>
                </div>
                <div className="info-row">
                  <strong>Status:</strong> 
                  <span className={`status-badge ${currentTransaction.status}`}>
                    {currentTransaction.status}
                  </span>
                </div>
                <div className="info-row">
                  <strong>Total Amount:</strong> 
                  <span>Rp. {parseFloat(currentTransaction.total_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <h3>Items</h3>
              
              {loadingDetails ? (
                <div className="loading">Loading details...</div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Card</th>
                        <th>Game</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionItems.length > 0 ? (
                        transactionItems.map(item => (
                          <tr key={item.id}>
                            <td className="card-info">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  onError={(e) => e.target.src = "/images/cards/card-placeholder.jpg"}
                                  className="card-thumb"
                                />
                              )}
                              <span>{item.name}</span>
                            </td>
                            <td>{item.game}</td>
                            <td>{item.quantity}</td>
                            <td>Rp. {parseFloat(item.price).toLocaleString('id-ID')}</td>
                            <td>Rp. {(item.quantity * item.price).toLocaleString('id-ID')}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-data">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className={`btn status-btn-${currentTransaction.status === 'completed' ? 'completed' : 'pending'}`}
                onClick={() => {
                  const newStatus = currentTransaction.status === 'completed' ? 'pending' : 'completed';
                  updateTransactionStatus(currentTransaction.id, newStatus);
                }}
              >
                {currentTransaction.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
              </button>
              <button 
                className="btn cancel-btn" 
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

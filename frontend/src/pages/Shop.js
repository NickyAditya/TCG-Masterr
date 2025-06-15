import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Shop.css';

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    // Initial fetch when component mounts - only run once
  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    const fetchCards = async () => {
    setLoading(true);
    setError(''); // Clear any previous errors
    
    try {
      const response = await axios.get('http://localhost:5000/api/cards');
      
      // Process the cards from the database
      const dbCards = response.data;
      
      // Store all cards so we can filter without making API calls
      setAllCards(dbCards);
      
      // Apply filters based on the selected category and search query
      filterCards(dbCards);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to load cards. Please check your database connection or contact support.');
      setLoading(false);
      setCards([]); // Clear cards on error
    }
  };
  // Store all cards in state so we can filter them without making API calls
  const [allCards, setAllCards] = useState([]);

  // Fetch cards only once on component mount
  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filter cards when category or search changes
  useEffect(() => {
    if (allCards.length > 0) {
      setLoading(true);
      // Use setTimeout to prevent UI freezing during filtering
      setTimeout(() => {
        filterCards(allCards);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);
  const filterCards = (allDbCards) => {
    // Don't need to set loading again during filtering if we're already in loading state
    
    // Convert database cards to the format expected by our UI
    const formattedCards = allDbCards.map(card => ({
      id: card.id,
      name: card.name,
      price: parseFloat(card.price),
      image: card.image || '/images/cards/card-placeholder.jpg',
      rarity: card.rarity || 'Common',
      set: card.card_set || '',
      inStock: card.stock > 0,
      stockCount: card.stock,
      category: card.game // 'pokemon', 'yugioh', or 'mtg'
    }));
    
    let filteredCards = [];
    
    // Apply category filter
    if (selectedCategory === 'all') {
      filteredCards = formattedCards;
    } else {
      filteredCards = formattedCards.filter(card => card.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Always ensure we have at least 8 cards (2 rows of 4) for consistent layout
    // or a multiple of 4 cards to fill complete rows
    const cardsPerRow = 4;
    const minRows = 2;
    
    // Calculate how many cards we need to have complete rows
    const totalRows = Math.max(minRows, Math.ceil(filteredCards.length / cardsPerRow));
    const targetCardCount = totalRows * cardsPerRow;
    
    // Create final array with active cards first
    let finalCards = [...filteredCards];
    
    // Add empty placeholder cards if needed to complete rows
    if (finalCards.length < targetCardCount) {
      // How many placeholders do we need?
      const placeholdersNeeded = targetCardCount - finalCards.length;
      
      // Add placeholders
      for (let i = 0; i < placeholdersNeeded; i++) {
        finalCards.push({ 
          id: `placeholder-${i}`, 
          name: '', 
          price: 0, 
          image: '',
          rarity: '',
          set: '',
          inStock: false,
          category: 'placeholder',
          isPlaceholder: true
        });
      }
    }
    
    setCards(finalCards);
    setLoading(false);
  };
  
  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fallback image for cards without images
  const handleImageError = (e) => {
    e.target.src = '/images/cards/card-placeholder.jpg';
  };
  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>TCG Card Shop</h1>
        <p>Browse our premium selection of trading cards from Pokémon, Yu-Gi-Oh!, and Magic: The Gathering</p>
      </div>
      
      <div className="shop-filters">
        <div className="filter-group">
          <div className="category-tabs">
            <button 
              className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Cards
            </button>
            <button 
              className={`category-tab ${selectedCategory === 'pokemon' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('pokemon')}
            >
              Pokémon
            </button>
            <button 
              className={`category-tab ${selectedCategory === 'yugioh' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('yugioh')}
            >
              Yu-Gi-Oh!
            </button>
            <button 
              className={`category-tab ${selectedCategory === 'mtg' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('mtg')}
            >
              Magic: The Gathering
            </button>
          </div>
        </div>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search cards..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
        <div className="shop-content">
        {loading ? (
          <div className="loading">Loading cards...</div>
        ) : error ? (
          <div className="error-message">
            <h3>Error loading cards</h3>
            <p>{error}</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="no-results">
            <h3>No cards found</h3>
            <p>Try changing your search criteria</p>
          </div>
        ) : (
          <div className="card-grid">
            {/* Fill with actual cards and placeholders to maintain consistent layout */}
            {cards.map(card => (
              card.isPlaceholder ? (
                // Placeholder cards - invisible but maintain grid structure
                <div 
                  className="card-item placeholder" 
                  key={`placeholder-${card.id}`} 
                  aria-hidden="true"
                ></div>
              ) : (
                // Real cards with content
                <div className="card-item" key={`${card.category}-${card.id}`}>
                  <div className="card-image">
                    <img 
                      src={card.image} 
                      alt={card.name}
                      onError={handleImageError} 
                      loading="lazy"
                    />
                    {!card.inStock && <span className="out-of-stock">Out of Stock</span>}
                  </div>
                  <div className="card-details">
                    <h3 className="card-name">{card.name}</h3>
                    <div className="card-meta">
                      <span className="card-set">{card.set}</span>                      <span className={`card-rarity ${card.rarity ? card.rarity.toLowerCase().replace(' ', '-') : 'common'}`}>
                        {card.rarity || 'Common'}
                      </span>
                    </div>
                    <div className="card-purchase">
                      <span className="card-price">${card.price.toFixed(2)}</span>
                      <button 
                        className="add-to-cart" 
                        disabled={!card.inStock}
                      >
                        {card.inStock ? 'Add to Cart' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                  <div className="card-game-tag">
                    <span className={`game-tag ${card.category}`}>
                      {card.category === 'pokemon' ? 'Pokémon' : 
                       card.category === 'yugioh' ? 'Yu-Gi-Oh!' : 'MTG'}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;

import React, { useState, useEffect } from 'react';
import './Shop.css';

// Sample card data (in a real app, you would fetch this from an API)
const cardData = {
  pokemon: [
    { id: 1, name: 'Charizard', price: 199.99, image: '/images/cards/pokemon/charizard1.jpg', rarity: 'Rare', set: 'Base Set', inStock: true },
    { id: 2, name: 'Pikachu', price: 49.99, image: '/images/cards/pokemon/pikachu1.jpg', rarity: 'Common', set: 'Base Set', inStock: true },
    { id: 3, name: 'Mewtwo', price: 129.99, image: '/images/cards/pokemon/mewtwo.jpg', rarity: 'Rare', set: 'Base Set', inStock: true },
    { id: 4, name: 'Blastoise', price: 149.99, image: '/images/cards/pokemon/blastoise1.png', rarity: 'Rare', set: 'Base Set', inStock: false },
    { id: 5, name: 'Venusaur', price: 139.99, image: '/images/cards/pokemon/venusaur1.jpg', rarity: 'Rare', set: 'Base Set', inStock: true },
  ],
  yugioh: [
    { id: 1, name: 'Blue-Eyes White Dragon', price: 89.99, image: '/images/cards/yugioh/blueeyes.webp', rarity: 'Ultra Rare', set: 'Legend of Blue Eyes', inStock: true },
    { id: 2, name: 'Dark Magician', price: 79.99, image: '/images/cards/yugioh/darkmagic.jpg', rarity: 'Ultra Rare', set: 'Legend of Blue Eyes', inStock: true },
    { id: 3, name: 'Exodia the Forbidden One', price: 149.99, image: '/images/cards/yugioh/exodia.jpeg', rarity: 'Ultra Rare', set: 'Legend of Blue Eyes', inStock: false },
    { id: 4, name: 'Red-Eyes Black Dragon', price: 69.99, image: '/images/cards/yugioh/redeyes.jpg', rarity: 'Ultra Rare', set: 'Metal Raiders', inStock: true },
    { id: 5, name: 'Summoned Skull', price: 29.99, image: '/images/cards/yugioh/summoned-skull.jpg', rarity: 'Ultra Rare', set: 'Metal Raiders', inStock: true },
    { id: 6, name: 'Black Luster Soldier', price: 99.99, image: '/images/cards/yugioh/black-luster-soldier.jpg', rarity: 'Ultra Rare', set: 'Invasion of Chaos', inStock: true }
  ],
  mtg: [
    { id: 1, name: 'Black Lotus', price: 9999.99, image: '/images/cards/mtg/black-lotus.jpg', rarity: 'Mythic Rare', set: 'Alpha', inStock: false },
    { id: 2, name: 'Jace, the Mind Sculptor', price: 149.99, image: '/images/cards/mtg/jace.jpg', rarity: 'Mythic Rare', set: 'Worldwake', inStock: true },
    { id: 3, name: 'Liliana of the Veil', price: 129.99, image: '/images/cards/mtg/liliana.jpg', rarity: 'Mythic Rare', set: 'Innistrad', inStock: true },
    { id: 4, name: 'Tarmogoyf', price: 89.99, image: '/images/cards/mtg/tarmogoyf.jpg', rarity: 'Mythic Rare', set: 'Future Sight', inStock: true },
    { id: 5, name: 'Force of Will', price: 119.99, image: '/images/cards/mtg/force-of-will.jpg', rarity: 'Rare', set: 'Alliances', inStock: true },
    { id: 6, name: 'Mox Sapphire', price: 7999.99, image: '/images/cards/mtg/mox-sapphire.jpg', rarity: 'Rare', set: 'Beta', inStock: false }
  ]
};

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading cards from an API
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      let filteredCards = [];
      
      if (selectedCategory === 'all') {
        filteredCards = [
          ...cardData.pokemon.map(card => ({ ...card, category: 'pokemon' })),
          ...cardData.yugioh.map(card => ({ ...card, category: 'yugioh' })),
          ...cardData.mtg.map(card => ({ ...card, category: 'mtg' }))
        ];
      } else {
        filteredCards = cardData[selectedCategory].map(card => ({ ...card, category: selectedCategory }));
      }
      
      // Apply search filter if query exists
      if (searchQuery) {
        filteredCards = filteredCards.filter(card => 
          card.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setCards(filteredCards);
      setLoading(false);
    }, 500); // Simulated delay to show loading state
  }, [selectedCategory, searchQuery]);
  
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
        <p>Browse our selection of trading cards</p>
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
        ) : cards.length === 0 ? (
          <div className="no-results">
            <h3>No cards found</h3>
            <p>Try changing your search criteria</p>
          </div>
        ) : (
          <div className="card-grid">
            {cards.map(card => (
              <div className="card-item" key={`${card.category}-${card.id}`}>
                <div className="card-image">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    onError={handleImageError} 
                  />
                  {!card.inStock && <span className="out-of-stock">Out of Stock</span>}
                </div>
                <div className="card-details">
                  <h3 className="card-name">{card.name}</h3>
                  <div className="card-meta">
                    <span className="card-set">{card.set}</span>
                    <span className={`card-rarity ${card.rarity.toLowerCase().replace(' ', '-')}`}>
                      {card.rarity}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;

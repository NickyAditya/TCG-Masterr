import React, { useState, useEffect } from 'react';
import './Shop.css'; // We'll reuse some of the Shop styles

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the user's inventory
    setLoading(true);
    
    // This would be an API call in a real app
    setTimeout(() => {
      // Example inventory data - in a real app, this would come from your API
      const sampleInventory = [
        { 
          id: 1, 
          name: 'Charizard', 
          category: 'pokemon',
          image: '/images/cards/pokemon/charizard1.jpg', 
          rarity: 'Rare', 
          set: 'Base Set',
          purchaseDate: '2025-05-20',
          condition: 'Near Mint'
        },
        { 
          id: 2, 
          name: 'Blue-Eyes White Dragon', 
          category: 'yugioh',
          image: '/images/cards/yugioh/blueeyes.webp', 
          rarity: 'Ultra Rare', 
          set: 'Legend of Blue Eyes',
          purchaseDate: '2025-06-01',
          condition: 'Excellent'
        }
      ];
      
      setInventory(sampleInventory);
      setLoading(false);
    }, 1000);
  }, []);

  // Fallback image for cards without images
  const handleImageError = (e) => {
    e.target.src = '/images/cards/card-placeholder.jpg';
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>My Card Inventory</h1>
        <p>Manage your collection of trading cards</p>
      </div>
      
      <div className="shop-content">
        {loading ? (
          <div className="loading">Loading your inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="no-results">
            <h3>No cards in your inventory</h3>
            <p>Visit the shop to find some awesome cards!</p>
          </div>
        ) : (
          <div className="card-grid">
            {inventory.map(card => (
              <div className="card-item" key={card.id}>
                <div className="card-image">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    onError={handleImageError} 
                  />
                </div>
                <div className="card-details">
                  <h3 className="card-name">{card.name}</h3>
                  <div className="card-meta">
                    <span className="card-set">{card.set}</span>
                    <span className={`card-rarity ${card.rarity.toLowerCase().replace(' ', '-')}`}>
                      {card.rarity}
                    </span>
                  </div>
                  <div className="inventory-details">
                    <p>Condition: {card.condition}</p>
                    <p>Added: {new Date(card.purchaseDate).toLocaleDateString()}</p>
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

export default Inventory;

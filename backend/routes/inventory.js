const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Create database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tcg_db"
});

// Get user's inventory
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT ui.*, c.name, c.game as category, c.image, c.rarity, c.card_set as \`set\`
    FROM user_inventory ui
    JOIN cards c ON ui.card_id = c.id
    WHERE ui.user_id = ?
    ORDER BY ui.purchase_date DESC
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ message: 'Error fetching inventory' });
    }
    
    res.json(results);
  });
});

// Add card to user's inventory (checkout process)
router.post('/add', (req, res) => {
  console.log('Checkout request received:', req.body);
  
  // Verifikasi dahulu bahwa semua tabel yang diperlukan ada
  db.query(`SHOW TABLES LIKE 'user_inventory'`, (err, results) => {
    if (err || results.length === 0) {
      console.error('Table user_inventory does not exist:', err || 'Empty results');
      return res.status(500).json({ 
        message: 'Database setup incomplete: user_inventory table missing.', 
        action: 'Please run setup-database.js to create required tables.' 
      });
    }
    
    // Lanjutkan pemrosesan jika tabel ada
    processCheckout();
  });
  
  // Helper function untuk memproses checkout
  function processCheckout() {
    const { userId, items, totalAmount } = req.body;
    
    if (!userId) {
      console.error('Missing userId in request');
      return res.status(400).json({ message: 'Missing userId in request' });
    }
    
    if (!items || !Array.isArray(items)) {
      console.error('Missing items array in request');
      return res.status(400).json({ message: 'Missing items array in request' });
    }
    
    if (items.length === 0) {
      console.error('Empty items array in request');
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Validate each item in the cart
    for (const item of items) {
      if (!item.cardId || !item.quantity || !item.price) {
        console.error('Invalid item data:', item);
        return res.status(400).json({ message: 'Invalid item data in cart' });
      }
    }
    
    console.log('Request validation passed');
    
    // Start transaction
    db.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ message: 'Error processing order' });
      }
      
      // Create transaction record
      console.log('Creating transaction for user ID:', userId, 'with total amount:', totalAmount);
      const transactionSql = `
        INSERT INTO transactions (user_id, total_amount, status)
        VALUES (?, ?, 'completed')
      `;
      
      db.query(transactionSql, [userId, totalAmount], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error creating transaction:', err);
            console.error('Error SQL state:', err.sqlState);
            console.error('Error SQL message:', err.sqlMessage);
            console.error('Error SQL code:', err.code);
            
            // Cek apakah user_id valid
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
              return res.status(400).json({ message: 'Invalid user ID. User might not exist in database.' });
            }
            
            res.status(500).json({ 
              message: 'Error processing order',
              detail: err.sqlMessage,
              code: err.code
            });
          });
        }
        
        const transactionId = result.insertId;
        
        // Batch insert all inventory items
        const inventoryValues = [];
        const orderItemValues = [];
        const updates = [];
        
        // Prepare batch values
        items.forEach(item => {
          // Values for user_inventory table
          for (let i = 0; i < item.quantity; i++) {
            inventoryValues.push([
              userId,
              item.cardId,
              new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
              'Near Mint' // Default condition
            ]);
          }
          
          // Values for order_items table
          orderItemValues.push([
            transactionId,
            item.cardId,
            item.quantity,
            item.price
          ]);
          
          // Update stock levels
          updates.push(new Promise((resolve, reject) => {
            db.query(
              'UPDATE cards SET stock = stock - ? WHERE id = ? AND stock >= ?',
              [item.quantity, item.cardId, item.quantity],
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
          }));
        });
          // Insert into user_inventory (individual cards)
        if (inventoryValues.length > 0) {
          const inventorySql = `
            INSERT INTO user_inventory (user_id, card_id, purchase_date, \`condition\`)
            VALUES ?
          `;
          
          db.query(inventorySql, [inventoryValues], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error adding to inventory:', err);
                console.error('Error SQL state:', err.sqlState);
                console.error('Error SQL message:', err.sqlMessage);
                console.error('Error SQL code:', err.code);
                // Berikan pesan error yang lebih spesifik
                let errorMessage = 'Error adding to inventory';
                
                // Penanganan untuk beberapa kasus error umum
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                  errorMessage = 'Invalid card or user id. Foreign key constraint failed.';
                } else if (err.code === 'ER_DUP_ENTRY') {
                  errorMessage = 'Duplicate entry. This item might already be in your inventory.';
                }
                
                res.status(500).json({ 
                  message: errorMessage,
                  detail: err.sqlMessage,
                  code: err.code
                });
              });
            }
            
            // Insert into order_items
            const orderItemsSql = `
              INSERT INTO order_items (transaction_id, card_id, quantity, price)
              VALUES ?
            `;
            
            db.query(orderItemsSql, [orderItemValues], (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error creating order items:', err);
                  res.status(500).json({ message: 'Error processing order' });
                });
              }
              
              // Update card stock levels
              Promise.all(updates)
                .then(() => {
                  // Commit the transaction
                  db.commit(err => {
                    if (err) {
                      return db.rollback(() => {
                        console.error('Error committing transaction:', err);
                        res.status(500).json({ message: 'Error processing order' });
                      });
                    }
                    
                    res.status(201).json({
                      message: 'Order processed successfully',
                      transactionId,
                      items: items.length
                    });
                  });
                })
                .catch(err => {
                  db.rollback(() => {
                    console.error('Error updating stock:', err);
                    res.status(500).json({ message: 'Error updating stock levels' });
                  });
                });
            });
          });
        } else {
          db.rollback(() => {
            res.status(400).json({ message: 'No valid items to add to inventory' });
          });
        }
      });
    });
  }
});

module.exports = router;

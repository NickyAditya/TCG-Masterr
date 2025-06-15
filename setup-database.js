const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Read SQL files
const usersSql = fs.readFileSync(path.join(__dirname, 'tcg_db.sql'), 'utf8');
const cardsSql = fs.readFileSync(path.join(__dirname, 'cards_table.sql'), 'utf8');

// Create connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  multipleStatements: true // Allow multiple SQL statements
});

console.log('Connecting to MySQL...');

// Connect and create database if it doesn't exist
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }

  console.log('Connected to MySQL successfully');
  
  // Create database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS tcg_db', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      process.exit(1);
    }
    
    console.log('Database tcg_db created or already exists');
    
    // Use the database
    connection.query('USE tcg_db', (err) => {
      if (err) {
        console.error('Error using database:', err);
        process.exit(1);
      }
      
      console.log('Using tcg_db database');
      
      // Execute users SQL
      connection.query(usersSql, (err) => {
        if (err) {
          console.error('Error executing users SQL:', err);
          process.exit(1);
        }
        
        console.log('Users table created successfully');
        
        // Execute cards SQL
        connection.query(cardsSql, (err) => {
          if (err) {
            console.error('Error executing cards SQL:', err);
            process.exit(1);
          }
          
          console.log('Cards table created successfully');
          console.log('Database setup complete!');
          
          // Close connection
          connection.end();
        });
      });
    });
  });
});

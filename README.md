# TCG-Masterr
Website TCG Menggunakan React

## Setup

1. Create database `tcg_db` in MySQL/PHPMyAdmin
2. Import `tcg_db.sql` to create user table
3. Import `cards_table.sql` to create cards table with sample data

   OR   Use the automatic setup script (after installing backend dependencies):
   ```
   cd backend
   npm run setup-db
   ```
4. Install dependencies:
   ```
   cd backend
   npm install
   
   cd ../frontend
   npm install
   ```
5. Run backend and frontend:
   ```
   # Terminal 1
   cd backend
   npm start
   
   # Terminal 2
   cd frontend
   npm start
   ```

## Features

- User authentication (login/register)
- Admin dashboard for user and card management
- Card inventory system
- Shop page with card listings
- Role-based access control

## Admin Access

- Username: admin
- Password: admin123

## Card Management

The admin dashboard allows:
- Viewing all cards in inventory
- Adding new cards
- Updating card information
- Updating card stock quantity
- Deleting cards

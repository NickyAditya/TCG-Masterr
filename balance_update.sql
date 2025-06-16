-- Add balance field to users table
ALTER TABLE users ADD COLUMN balance DECIMAL(12,2) DEFAULT 0.00;

-- Update existing users to have 0 balance
UPDATE users SET balance = 0.00 WHERE balance IS NULL;

-- Make sure the balance field is not null
ALTER TABLE users MODIFY COLUMN balance DECIMAL(12,2) NOT NULL DEFAULT 0.00;
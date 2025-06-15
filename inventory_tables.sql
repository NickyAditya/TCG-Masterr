-- Create user_inventory table
CREATE TABLE IF NOT EXISTS `user_inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `card_id` INT NOT NULL,
  `purchase_date` DATE NOT NULL,
  `condition` ENUM('Mint', 'Near Mint', 'Excellent', 'Good', 'Light Played', 'Played', 'Poor') DEFAULT 'Near Mint',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_inventory_user` (`user_id`),
  INDEX `idx_user_inventory_card` (`card_id`)
);

-- Create transactions table for order history
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `transaction_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_transactions_user` (`user_id`)
);

-- Create order_items table to track items in each transaction
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` INT NOT NULL,
  `card_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON DELETE CASCADE,
  INDEX `idx_order_items_transaction` (`transaction_id`),
  INDEX `idx_order_items_card` (`card_id`)
);

-- Cards table structure
CREATE TABLE IF NOT EXISTS `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `game` enum('pokemon','yugioh','mtg') NOT NULL,
  `card_set` varchar(255) DEFAULT NULL,
  `rarity` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stock` int NOT NULL DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample data for cards table
INSERT INTO `cards` (`name`, `game`, `card_set`, `rarity`, `price`, `stock`, `image`) VALUES
('Charizard', 'pokemon', 'Base Set', 'Rare', 199.99, 3, '/images/cards/pokemon/charizard1.jpg'),
('Venusaur', 'pokemon', 'Base Set', 'Rare', 79.99, 5, '/images/cards/pokemon/venusaur1.jpg'),
('Blastoise', 'pokemon', 'Base Set', 'Rare', 89.99, 4, '/images/cards/pokemon/blastoise1.png'),
('Pikachu', 'pokemon', 'Base Set', 'Common', 19.99, 12, '/images/cards/pokemon/pikachu1.jpg'),
('Mewtwo', 'pokemon', 'Base Set', 'Rare', 69.99, 2, '/images/cards/pokemon/mewtwo.jpg'),
('Dark Magician', 'yugioh', 'Legend of Blue Eyes', 'Ultra Rare', 49.99, 3, '/images/cards/yugioh/dark-magician.jpg'),
('Blue-Eyes White Dragon', 'yugioh', 'Legend of Blue Eyes', 'Ultra Rare', 89.99, 5, '/images/cards/yugioh/blueeyes.webp'),
('Exodia the Forbidden One', 'yugioh', 'Legend of Blue Eyes', 'Ultra Rare', 129.99, 1, '/images/cards/yugioh/exodia.jpeg'),
('Red-Eyes Black Dragon', 'yugioh', 'Metal Raiders', 'Ultra Rare', 59.99, 4, '/images/cards/yugioh/redeyes.jpg'),
('Black Lotus', 'mtg', 'Alpha', 'Mythic Rare', 9999.99, 0, '/images/cards/mtg/black-lotus.jpg'),
('Jace, the Mind Sculptor', 'mtg', 'Worldwake', 'Mythic Rare', 199.99, 2, '/images/cards/mtg/jace.jpg');

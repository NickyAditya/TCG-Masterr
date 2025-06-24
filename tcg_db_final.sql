-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 24 Jun 2025 pada 01.53
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tcg_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cards`
--

CREATE TABLE `cards` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `game` enum('pokemon','yugioh','mtg') NOT NULL,
  `card_set` varchar(255) DEFAULT NULL,
  `rarity` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stock` int NOT NULL DEFAULT '0',
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `cards`
--

INSERT INTO `cards` (`id`, `name`, `game`, `card_set`, `rarity`, `price`, `stock`, `image`) VALUES
(2, 'Venusaur', 'pokemon', 'Base Set', 'Rare', 100000.00, 2, '/images/cards/pokemon/venusaur1.jpg'),
(3, 'Blastoise', 'pokemon', 'Base Set', 'Rare', 20000.00, 1, '/images/cards/pokemon/blastoise1.png'),
(4, 'Pikachu', 'pokemon', 'Base Set', 'common', 35000.00, 4, '/images/cards/pokemon/pikachu1.jpg'),
(5, 'Mewtwo', 'pokemon', 'Base Set', 'Rare', 120000.00, 4, '/images/cards/pokemon/mewtwo.jpg'),
(6, 'Dark Magician', 'yugioh', 'Legend of Blue Eyes', 'Ultra Rare', 800000.00, 3, '/images/cards/yugioh/darkmagic.jpg'),
(7, 'Blue-Eyes White Dragon', 'yugioh', 'Legend of Blue Eyes', 'ultra-rare', 950000.00, 4, '/images/cards/yugioh/blueeyes.webp'),
(8, 'Exodia the Forbidden One', 'yugioh', 'Legend of Blue Eyes', 'Ultra Rare', 1000000.00, 0, '/images/cards/yugioh/exodia.jpeg'),
(9, 'Red-Eyes Black Dragon', 'yugioh', 'Metal Raiders', 'Ultra Rare', 890000.00, 2, '/images/cards/yugioh/redeyes.jpg'),
(10, 'Black Lotus', 'mtg', 'Alpha', 'Mythic Rare', 42000000.00, 0, '/images/cards/mtg/1750061747687-596.webp');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `transaction_id` int NOT NULL,
  `card_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `transaction_id`, `card_id`, `quantity`, `price`) VALUES
(7, 3, 4, 1, 19.99),
(8, 4, 2, 1, 100000.00),
(9, 4, 3, 1, 20000.00),
(10, 5, 4, 1, 35000.00),
(11, 6, 3, 1, 20000.00),
(12, 7, 2, 1, 100000.00),
(13, 8, 4, 1, 35000.00),
(14, 9, 4, 1, 35000.00),
(15, 10, 4, 1, 35000.00),
(16, 11, 5, 1, 120000.00),
(17, 12, 9, 1, 890000.00),
(18, 13, 2, 1, 100000.00),
(19, 14, 5, 1, 120000.00),
(20, 15, 4, 1, 35000.00),
(21, 15, 8, 1, 1000000.00),
(22, 16, 4, 1, 35000.00),
(23, 16, 10, 1, 42000000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `transaction_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `transaction_date`, `total_amount`, `status`) VALUES
(3, 2, '2025-06-16 01:22:37', 19.99, 'completed'),
(4, 2, '2025-06-16 01:30:45', 120000.00, 'completed'),
(5, 2, '2025-06-16 02:11:52', 35000.00, 'completed'),
(6, 2, '2025-06-16 02:15:07', 20000.00, 'completed'),
(7, 2, '2025-06-16 02:25:06', 100000.00, 'completed'),
(8, 2, '2025-06-16 02:25:17', 35000.00, 'completed'),
(9, 2, '2025-06-16 02:29:17', 35000.00, 'completed'),
(10, 2, '2025-06-16 02:30:43', 35000.00, 'completed'),
(11, 2, '2025-06-16 03:18:18', 120000.00, 'completed'),
(12, 2, '2025-06-16 03:52:31', 890000.00, 'completed'),
(13, 2, '2025-06-16 08:34:05', 100000.00, 'completed'),
(14, 2, '2025-06-16 16:53:16', 120000.00, 'completed'),
(15, 2, '2025-06-17 07:16:22', 1035000.00, 'completed'),
(16, 2, '2025-06-18 12:46:32', 42035000.00, 'completed');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `balance`) VALUES
(1, 'admin', 'admin@tcgmaster.com', '$2a$10$UHbK4qid.kI0uREHR2Ecm.Jbc5oDiLL9W43/mprZRFpOXk5gGELqq', 'admin', 0.00),
(2, 'nicky', 'nicky@gmail.com', '$2b$10$Uzv3lyHpBbAoaOzaq631tu2QuPsmBKNMSFEpGmuFP5sR/z9b2IkAC', 'user', 467990000.00),
(3, 'bagus1', 'bagus@gmail.com', '$2b$10$eHqgIcvREjfbyS6mn.Ftguzw.B32l5JkQNRr1uQLpLoa2I.eHDg7C', 'user', 0.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_inventory`
--

CREATE TABLE `user_inventory` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `card_id` int NOT NULL,
  `purchase_date` date NOT NULL,
  `condition` enum('Mint','Near Mint','Excellent','Good','Light Played','Played','Poor') DEFAULT 'Near Mint'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `user_inventory`
--

INSERT INTO `user_inventory` (`id`, `user_id`, `card_id`, `purchase_date`, `condition`) VALUES
(7, 2, 4, '2025-06-16', 'Near Mint'),
(8, 2, 2, '2025-06-16', 'Near Mint'),
(9, 2, 3, '2025-06-16', 'Near Mint'),
(10, 2, 4, '2025-06-16', 'Near Mint'),
(11, 2, 3, '2025-06-16', 'Near Mint'),
(12, 2, 2, '2025-06-16', 'Near Mint'),
(13, 2, 4, '2025-06-16', 'Near Mint'),
(14, 2, 4, '2025-06-16', 'Near Mint'),
(15, 2, 4, '2025-06-16', 'Near Mint'),
(16, 2, 5, '2025-06-16', 'Near Mint'),
(17, 2, 9, '2025-06-16', 'Near Mint'),
(18, 2, 2, '2025-06-16', 'Near Mint'),
(19, 2, 5, '2025-06-16', 'Near Mint'),
(20, 2, 4, '2025-06-17', 'Near Mint'),
(21, 2, 8, '2025-06-17', 'Near Mint'),
(22, 2, 4, '2025-06-18', 'Near Mint'),
(23, 2, 10, '2025-06-18', 'Near Mint');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_items_transaction` (`transaction_id`),
  ADD KEY `idx_order_items_card` (`card_id`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transactions_user` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `user_inventory`
--
ALTER TABLE `user_inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_inventory_user` (`user_id`),
  ADD KEY `idx_user_inventory_card` (`card_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `user_inventory`
--
ALTER TABLE `user_inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_inventory`
--
ALTER TABLE `user_inventory`
  ADD CONSTRAINT `user_inventory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_inventory_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

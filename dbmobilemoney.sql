-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 03, 2025 at 12:23 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbmobilemoney`
--

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `agentID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `agentcode` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`agentID`, `userID`, `agentcode`) VALUES
(12, 15, '40001'),
(13, 14, '40003'),
(14, 17, '40005'),
(16, 21, '40009'),
(17, 22, '40010'),
(18, 23, '40011');

-- --------------------------------------------------------

--
-- Table structure for table `dailyCashIn`
--

CREATE TABLE `dailyCashIn` (
  `cashInID` int(11) NOT NULL,
  `agentID` int(11) NOT NULL,
  `cashInDate` date NOT NULL,
  `openingCashBalance` double NOT NULL,
  `openingMobileBalance` double(10,2) NOT NULL,
  `transactionID` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dailyCashIn`
--

INSERT INTO `dailyCashIn` (`cashInID`, `agentID`, `cashInDate`, `openingCashBalance`, `openingMobileBalance`, `transactionID`) VALUES
(1, 12, '2025-09-28', 20000, 50000.00, 'TXN-YV7NYZ8S'),
(3, 13, '2025-09-28', 35000, 35000.00, 'TXN-BT5X5NHY'),
(4, 14, '2025-09-29', 30000, 40000.00, 'TXN-P0L0PL1Z'),
(5, 12, '2025-10-02', 20000, 30000.00, 'TXN-F73ZJ5UE'),
(6, 12, '2025-10-02', 89000, 79000.00, 'TXN-CW9N3XSR'),
(7, 12, '2025-10-02', 78000, 50000.00, 'TXN-Q5DJWZDY'),
(8, 17, '2025-10-02', 30202, 50000.00, 'TXN-T2MLRNQF'),
(9, 17, '2025-10-02', 64800, 58000.00, 'TXN-CR94EROZ'),
(10, 17, '2025-10-02', 90000, 60000.00, 'TXN-XDYR2PY3'),
(11, 12, '2025-10-03', 20000, 50000.00, 'TXN-JU35HLRF'),
(12, 12, '2025-10-03', 80000, 70000.00, 'TXN-5ES9TPDY'),
(13, 12, '2025-10-03', 50000, 25000.00, 'TXN-N2WFMUEB'),
(14, 18, '2025-10-03', 40000, 60000.00, 'TXN-ULDN16LO'),
(15, 18, '2025-10-03', 68880, 6892.00, 'TXN-HY612ON9'),
(16, 18, '2025-10-03', 20000, 50000.00, 'TXN-KQKTLDAB');

-- --------------------------------------------------------

--
-- Table structure for table `dailyCashOut`
--

CREATE TABLE `dailyCashOut` (
  `cashOutID` int(11) NOT NULL,
  `cashInDate` date NOT NULL,
  `closingCashBalance` double(10,2) NOT NULL,
  `closingMobileBalance` double NOT NULL,
  `transactionID` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dailyCashOut`
--

INSERT INTO `dailyCashOut` (`cashOutID`, `cashInDate`, `closingCashBalance`, `closingMobileBalance`, `transactionID`) VALUES
(1, '2025-09-28', 24000.00, 40009, 'TXN-YV7NYZ8S'),
(2, '2025-09-28', 9000.00, 8000, 'TXN-BT5X5NHY'),
(3, '2025-09-29', 8900.00, 8000, 'TXN-P0L0PL1Z'),
(4, '2025-10-02', 44003.00, 50009, 'TXN-7ES6VJDU'),
(5, '2025-10-02', 329823.00, 7880021, 'TXN-Q5DJWZDY'),
(6, '2025-10-02', 5000.00, 40000, 'TXN-T2MLRNQF'),
(7, '2025-10-02', 62651.00, 564736, 'TXN-CR94EROZ'),
(8, '2025-10-02', 85000.00, 65000, 'TXN-XDYR2PY3'),
(9, '2025-10-03', 35000.00, 35000, 'TXN-JU35HLRF'),
(10, '2025-10-03', 24000.00, 50000, 'TXN-N2WFMUEB'),
(11, '2025-10-03', 60000.00, 40000, 'TXN-ULDN16LO'),
(12, '2025-10-03', 8000.00, 98000, 'TXN-HY612ON9'),
(13, '2025-10-03', 50000.00, 20000, 'TXN-KQKTLDAB');

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `managerID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `fullName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`managerID`, `userID`, `fullName`) VALUES
(1, 1, 'asante ngwira');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `phoneno` varchar(14) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('manager','agent') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `username`, `phoneno`, `password`, `role`) VALUES
(1, 'asante', '0999 123 458', 'hash', 'manager'),
(14, 'lauren', '08898989', 'hash', 'agent'),
(15, 'willam', '099098912', 'hash', 'agent'),
(17, 'jim', '099932832', 'hash', 'agent'),
(18, 'felix', '0998323284', 'hash', 'agent'),
(21, 'dan', '0998323284', 'hash', 'agent'),
(22, 'grace', '09983271', 'hash', 'agent'),
(23, 'thoko', '0987654432', 'hash', 'agent');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`agentID`),
  ADD UNIQUE KEY `agentCode` (`agentcode`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `dailyCashIn`
--
ALTER TABLE `dailyCashIn`
  ADD PRIMARY KEY (`cashInID`);

--
-- Indexes for table `dailyCashOut`
--
ALTER TABLE `dailyCashOut`
  ADD PRIMARY KEY (`cashOutID`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`managerID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `agentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `dailyCashIn`
--
ALTER TABLE `dailyCashIn`
  MODIFY `cashInID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `dailyCashOut`
--
ALTER TABLE `dailyCashOut`
  MODIFY `cashOutID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `managerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `managers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

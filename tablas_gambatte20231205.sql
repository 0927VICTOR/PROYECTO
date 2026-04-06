-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gambatte_db
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `idAccount` int NOT NULL AUTO_INCREMENT,
  `balance` double DEFAULT '0',
  PRIMARY KEY (`idAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank` (
  `idBank` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idBank`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buy_services`
--

DROP TABLE IF EXISTS `buy_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buy_services` (
  `idBuy_services` int NOT NULL AUTO_INCREMENT,
  `nameService` varchar(45) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` int DEFAULT NULL,
  `user_login_id` int NOT NULL,
  `hour` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idBuy_services`),
  KEY `fk_buy_services_user_login1_idx` (`user_login_id`),
  CONSTRAINT `fk_buy_services_user_login1` FOREIGN KEY (`user_login_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `idCard` int NOT NULL AUTO_INCREMENT,
  `user_login_id` int NOT NULL,
  `cardNumber` varchar(300) DEFAULT NULL,
  `cvv` varchar(300) DEFAULT NULL,
  `expYear` varchar(300) DEFAULT NULL,
  `month` varchar(300) DEFAULT NULL,
  `termAndConditions` tinyint DEFAULT NULL,
  PRIMARY KEY (`idCard`),
  KEY `fk_card_user_login1_idx` (`user_login_id`),
  CONSTRAINT `fk_card_user_login1` FOREIGN KEY (`user_login_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `id` int NOT NULL,
  `ESPANOL` varchar(100) DEFAULT NULL,
  `ENGLISH` varchar(100) DEFAULT NULL,
  `ISO2` varchar(50) DEFAULT NULL,
  `ISO3` varchar(50) DEFAULT NULL,
  `PHONE_CODE` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deposit`
--

DROP TABLE IF EXISTS `deposit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposit` (
  `idDeposit` int NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `ecommerce` varchar(45) DEFAULT NULL,
  `depositDate` date DEFAULT NULL,
  `state` int DEFAULT NULL,
  `account_idaccount` int NOT NULL,
  `idCard` int DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `hour` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idDeposit`),
  KEY `fk_deposit_account1_idx` (`account_idaccount`),
  CONSTRAINT `fk_deposit_account1` FOREIGN KEY (`account_idaccount`) REFERENCES `account` (`idAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `document_type`
--

DROP TABLE IF EXISTS `document_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_type` (
  `idDocument_type` int NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idDocument_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `idExpenses` int NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `expensesDate` date DEFAULT NULL,
  `state` int DEFAULT NULL,
  `keyAccount` varchar(45) DEFAULT NULL,
  `swiftCode` varchar(45) DEFAULT NULL,
  `account_idaccount` int NOT NULL,
  `bank` int NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `hour` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idExpenses`),
  KEY `fk_expenses_account1_idx` (`account_idaccount`),
  KEY `fk_expenses_bank1_idx` (`bank`),
  CONSTRAINT `fk_expenses_account1` FOREIGN KEY (`account_idaccount`) REFERENCES `account` (`idAccount`),
  CONSTRAINT `fk_expenses_bank1` FOREIGN KEY (`bank`) REFERENCES `bank` (`idBank`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `idPayment` int NOT NULL AUTO_INCREMENT,
  `investmentValue` double DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `date` date DEFAULT NULL,
  `hour` varchar(25) DEFAULT NULL,
  `result` double DEFAULT NULL,
  `status` int DEFAULT NULL,
  `total` double DEFAULT NULL,
  `account_idAccount` int NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `price` varchar(100) DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `value` double DEFAULT NULL,
  `movement` varchar(45) DEFAULT NULL,
  `statusPayment` int DEFAULT NULL,
  PRIMARY KEY (`idPayment`),
  KEY `fk_payment_account1_idx` (`account_idAccount`),
  CONSTRAINT `fk_payment_account1` FOREIGN KEY (`account_idAccount`) REFERENCES `account` (`idAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `idRol` int NOT NULL AUTO_INCREMENT,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idRol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `idTransaction` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `transactionType` varchar(45) DEFAULT NULL,
  `transactionNumber` varchar(50) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `status` int DEFAULT NULL,
  `user_login_id` int NOT NULL,
  `buy_services_idbuy_services` int DEFAULT NULL,
  `hour` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`idTransaction`),
  KEY `fk_transaction_user_login1_idx` (`user_login_id`),
  KEY `fk_transaction_buy_services1_idx` (`buy_services_idbuy_services`),
  CONSTRAINT `fk_transaction_buy_services1` FOREIGN KEY (`buy_services_idbuy_services`) REFERENCES `buy_services` (`idBuy_services`),
  CONSTRAINT `fk_transaction_user_login1` FOREIGN KEY (`user_login_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUser` varchar(8) DEFAULT NULL,
  `fullName` varchar(45) DEFAULT NULL,
  `secondName` varchar(45) DEFAULT NULL,
  `password` varchar(300) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone` varchar(17) DEFAULT NULL,
  `documentNumber` varchar(45) DEFAULT NULL,
  `documentType` int DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `statusActive` tinyint DEFAULT NULL,
  `avatar` varchar(150) DEFAULT NULL,
  `rol_idrol` int NOT NULL,
  `account_idaccount` int NOT NULL,
  `termsAndConditions` tinyint DEFAULT NULL,
  `finishRegister` double DEFAULT NULL,
  `documentImagenFront` varchar(150) DEFAULT NULL,
  `documentImagenPost` varchar(150) DEFAULT NULL,
  `indicative` varchar(45) DEFAULT NULL,
  `postalCode` varchar(45) DEFAULT NULL,
  `hour` varchar(25) DEFAULT NULL,
  `accountVerify` tinyint DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_login_rol_idx` (`rol_idrol`),
  KEY `fk_user_login_account1_idx` (`account_idaccount`),
  KEY `fk_user_login_document_type1_idx` (`documentType`),
  CONSTRAINT `fk_user_login_account1` FOREIGN KEY (`account_idaccount`) REFERENCES `account` (`idAccount`),
  CONSTRAINT `fk_user_login_document_type1` FOREIGN KEY (`documentType`) REFERENCES `document_type` (`idDocument_type`),
  CONSTRAINT `fk_user_login_rol` FOREIGN KEY (`rol_idrol`) REFERENCES `rol` (`idRol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'gambatte_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05  9:50:04

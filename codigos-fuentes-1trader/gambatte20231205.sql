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

CREATE DATABASE gambatte_db;

USE gambatte_db;

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
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,0),(2,0),(3,0),(4,65);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `bank`
--

LOCK TABLES `bank` WRITE;
/*!40000 ALTER TABLE `bank` DISABLE KEYS */;
INSERT INTO `bank` VALUES (1,'Banco Azteca'),(2,'Bancomer'),(3,'HCBC'),(4,'Banorte'),(5,'Bangercito'),(6,'Bancopel');
/*!40000 ALTER TABLE `bank` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `buy_services`
--

LOCK TABLES `buy_services` WRITE;
/*!40000 ALTER TABLE `buy_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `buy_services` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (1,4,'U2FsdGVkX1/6sFeX6WG2OOyRSoz0SoJesz9CdRd5PU4vUumc/jqC3VCtpR4ZUKmy','U2FsdGVkX181BiAp7a/Nfi47nK2C32JfHGLZSVLIdfY=','U2FsdGVkX18VP8+wkmWo42Y9zHpHnsHbqF7tUmCbf18=','U2FsdGVkX180Bpz9arl/wHeu09XQbQKLvE9gvF8PriU=',1),(2,4,'U2FsdGVkX19s//sAkLMVmWiDJsAKun+PkSuf8m+zg7U=','U2FsdGVkX19MeYb6HpOiMQe2C2y9C9eL1VRnK9rUzF0=','U2FsdGVkX18Jl5VGY2wfA9k2vrHyyq4tOmMlDDmWGEM=','U2FsdGVkX18hxS7X2yHApSbUTK52JA5kIAwIsGQiFl0=',1);
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'Afganistán','Afghanistan','AF','AFG',93),(2,'Albania','Albania','AL','ALB',355),(3,'Alemania','Germany','DE','DEU',49),(4,'Algeria','Algeria','DZ','DZA',213),(5,'Andorra','Andorra','AD','AND',376),(6,'Angola','Angola','AO','AGO',244),(7,'Antártida','Antarctica','AQ','ATA',672),(8,'Antillas Neerlandesas','Netherlands Antilles','AN','ANT',599),(9,'Arabia Saudita','Saudi Arabia','SA','SAU',966),(10,'Argentina','Argentina','AR','ARG',54),(11,'Armenia','Armenia','AM','ARM',374),(12,'Aruba','Aruba','AW','ABW',297),(13,'Australia','Australia','AU','AUS',61),(14,'Austria','Austria','AT','AUT',43),(15,'Azerbayán','Azerbaijan','AZ','AZE',994),(16,'Bahrein','Bahrain','BH','BHR',973),(17,'Bangladesh','Bangladesh','BD','BGD',880),(18,'Bélgica','Belgium','BE','BEL',32),(19,'Belice','Belize','BZ','BLZ',501),(20,'Benín','Benin','BJ','BEN',229),(21,'Bhután','Bhutan','BT','BTN',975),(22,'Bielorrusia','Belarus','BY','BLR',375),(23,'Birmania','Myanmar','MM','MMR',95),(24,'Bolivia','Bolivia','BO','BOL',591),(25,'Bosnia y Herzegovina','Bosnia and Herzegovina','BA','BIH',387),(26,'Botsuana','Botswana','BW','BWA',267),(27,'Brasil','Brazil','BR','BRA',55),(28,'Brunéi','Brunei','BN','BRN',673),(29,'Bulgaria','Bulgaria','BG','BGR',359),(30,'Burkina Faso','Burkina Faso','BF','BFA',226),(31,'Burundi','Burundi','BI','BDI',257),(32,'Cabo Verde','Cape Verde','CV','CPV',238),(33,'Camboya','Cambodia','KH','KHM',855),(34,'Camerún','Cameroon','CM','CMR',237),(35,'Canadá','Canada','CA','CAN',1),(36,'Chad','Chad','TD','TCD',235),(37,'Chile','Chile','CL','CHL',56),(38,'China','China','CN','CHN',86),(39,'Chipre','Cyprus','CY','CYP',357),(40,'Ciudad del Vaticano','Vatican City State','VA','VAT',39),(41,'Colombia','Colombia','CO','COL',57),(42,'Comoras','Comoros','KM','COM',269),(43,'Congo','Congo','CG','COG',242),(44,'Congo','Congo','CD','COD',243),(45,'Corea del Norte','North Korea','KP','PRK',850),(46,'Corea del Sur','South Korea','KR','KOR',82),(47,'Costa de Marfil','Ivory Coast','CI','CIV',225),(48,'Costa Rica','Costa Rica','CR','CRI',506),(49,'Croacia','Croatia','HR','HRV',385),(50,'Cuba','Cuba','CU','CUB',53),(51,'Dinamarca','Denmark','DK','DNK',45),(52,'Ecuador','Ecuador','EC','ECU',593),(53,'Egipto','Egypt','EG','EGY',20),(54,'El Salvador','El Salvador','SV','SLV',503),(55,'Emiratos Árabes Unidos','United Arab Emirates','AE','ARE',971),(56,'Eritrea','Eritrea','ER','ERI',291),(57,'Escocia','Scotland','GB','',44),(58,'Eslovaquia','Slovakia','SK','SVK',421),(59,'Eslovenia','Slovenia','SI','SVN',386),(60,'España','Spain','ES','ESP',34),(61,'Estados Unidos de América','United States of America','US','USA',1),(62,'Estonia','Estonia','EE','EST',372),(63,'Etiopía','Ethiopia','ET','ETH',251),(64,'Filipinas','Philippines','PH','PHL',63),(65,'Finlandia','Finland','FI','FIN',358),(66,'Fiyi','Fiji','FJ','FJI',679),(67,'Francia','France','FR','FRA',33),(68,'Gabón','Gabon','GA','GAB',241),(69,'Gales','Wales','GB','',44),(70,'Gambia','Gambia','GM','GMB',220),(71,'Georgia','Georgia','GE','GEO',995),(72,'Ghana','Ghana','GH','GHA',233),(73,'Gibraltar','Gibraltar','GI','GIB',350),(74,'Grecia','Greece','GR','GRC',30),(75,'Groenlandia','Greenland','GL','GRL',299),(76,'Guatemala','Guatemala','GT','GTM',502),(77,'Guinea','Guinea','GN','GIN',224),(78,'Guinea Ecuatorial','Equatorial Guinea','GQ','GNQ',240),(79,'Guinea-Bissau','Guinea-Bissau','GW','GNB',245),(80,'Guyana','Guyana','GY','GUY',592),(81,'Haití','Haiti','HT','HTI',509),(82,'Honduras','Honduras','HN','HND',504),(83,'Hong kong','Hong Kong','HK','HKG',852),(84,'Hungría','Hungary','HU','HUN',36),(85,'India','India','IN','IND',91),(86,'Indonesia','Indonesia','ID','IDN',62),(87,'Inglaterra','England','GB','',44),(88,'Irak','Iraq','IQ','IRQ',964),(89,'Irán','Iran','IR','IRN',98),(90,'Irlanda','Ireland','IE','IRL',353),(91,'Irlanda del Norte','Northern Irland','GB','',44),(92,'Isla de Man','Isle of Man','IM','IMN',44),(93,'Isla de Navidad','Christmas Island','CX','CXR',61),(94,'Islandia','Iceland','IS','ISL',354),(95,'Islas Cocos (Keeling)','Cocos (Keeling) Islands','CC','CCK',61),(96,'Islas Cook','Cook Islands','CK','COK',682),(97,'Islas Feroe','Faroe Islands','FO','FRO',298),(98,'Islas Maldivas','Maldives','MV','MDV',960),(99,'Islas Malvinas','Falkland Islands (Malvinas)','FK','FLK',500),(100,'Islas Marshall','Marshall Islands','MH','MHL',692),(101,'Islas Pitcairn','Pitcairn Islands','PN','PCN',870),(102,'Islas Salomón','Solomon Islands','SB','SLB',677),(103,'Israel','Israel','IL','ISR',972),(104,'Italia','Italy','IT','ITA',39),(105,'Japón','Japan','JP','JPN',81),(106,'Jordania','Jordan','JO','JOR',962),(107,'Kazajistán','Kazakhstan','KZ','KAZ',7),(108,'Kenia','Kenya','KE','KEN',254),(109,'Kirgizstán','Kyrgyzstan','KG','KGZ',996),(110,'Kiribati','Kiribati','KI','KIR',686),(111,'Kuwait','Kuwait','KW','KWT',965),(112,'Laos','Laos','LA','LAO',856),(113,'Lesoto','Lesotho','LS','LSO',266),(114,'Letonia','Latvia','LV','LVA',371),(115,'Líbano','Lebanon','LB','LBN',961),(116,'Liberia','Liberia','LR','LBR',231),(117,'Libia','Libya','LY','LBY',218),(118,'Liechtenstein','Liechtenstein','LI','LIE',423),(119,'Lituania','Lithuania','LT','LTU',370),(120,'Luxemburgo','Luxembourg','LU','LUX',352),(121,'Macao','Macao','MO','MAC',853),(122,'Macedônia','Macedonia','MK','MKD',389),(123,'Madagascar','Madagascar','MG','MDG',261),(124,'Malasia','Malaysia','MY','MYS',60),(125,'Malawi','Malawi','MW','MWI',265),(126,'Mali','Mali','ML','MLI',223),(127,'Malta','Malta','MT','MLT',356),(128,'Marruecos','Morocco','MA','MAR',212),(129,'Mauricio','Mauritius','MU','MUS',230),(130,'Mauritania','Mauritania','MR','MRT',222),(131,'Mayotte','Mayotte','YT','MYT',262),(132,'México','Mexico','MX','MEX',52),(133,'Micronesia','Estados Federados de','FM','FSM',691),(134,'Moldavia','Moldova','MD','MDA',373),(135,'Mónaco','Monaco','MC','MCO',377),(136,'Mongolia','Mongolia','MN','MNG',976),(137,'Montenegro','Montenegro','ME','MNE',382),(138,'Mozambique','Mozambique','MZ','MOZ',258),(139,'Namibia','Namibia','NA','NAM',264),(140,'Nauru','Nauru','NR','NRU',674),(141,'Nepal','Nepal','NP','NPL',977),(142,'Nicaragua','Nicaragua','NI','NIC',505),(143,'Niger','Niger','NE','NER',227),(144,'Nigeria','Nigeria','NG','NGA',234),(145,'Niue','Niue','NU','NIU',683),(146,'Noruega','Norway','NO','NOR',47),(147,'Nueva Caledonia','New Caledonia','NC','NCL',687),(148,'Nueva Zelanda','New Zealand','NZ','NZL',64),(149,'Omán','Oman','OM','OMN',968),(150,'Países Bajos','Netherlands','NL','NLD',31),(151,'Pakistán','Pakistan','PK','PAK',92),(152,'Palau','Palau','PW','PLW',680),(153,'Panamá','Panama','PA','PAN',507),(154,'Papúa Nueva Guinea','Papua New Guinea','PG','PNG',675),(155,'Paraguay','Paraguay','PY','PRY',595),(156,'Perú','Peru','PE','PER',51),(157,'Polinesia Francesa','French Polynesia','PF','PYF',689),(158,'Polonia','Poland','PL','POL',48),(159,'Portugal','Portugal','PT','PRT',351),(160,'Puerto Rico','Puerto Rico','PR','PRI',1),(161,'Qatar','Qatar','QA','QAT',974),(162,'Reino Unido','United Kingdom','GB','GBR',44),(163,'República Centroafricana','Central African Republic','CF','CAF',236),(164,'República Checa','Czech Republic','CZ','CZE',420),(165,'Ruanda','Rwanda','RW','RWA',250),(166,'Rumanía','Romania','RO','ROU',40),(167,'Rusia','Russia','RU','RUS',7),(168,'Samoa','Samoa','WS','WSM',685),(169,'San Bartolomé','Saint Barthélemy','BL','BLM',590),(170,'San Marino','San Marino','SM','SMR',378),(171,'San Pedro y Miquelón','Saint Pierre and Miquelon','PM','SPM',508),(172,'Santa Elena','Ascensión y Tristán de Acuña','SH','SHN',290),(173,'Santo Tomé y Príncipe','Sao Tome and Principe','ST','STP',239),(174,'Senegal','Senegal','SN','SEN',221),(175,'Serbia','Serbia','RS','SRB',381),(176,'Seychelles','Seychelles','SC','SYC',248),(177,'Sierra Leona','Sierra Leone','SL','SLE',232),(178,'Singapur','Singapore','SG','SGP',65),(179,'Siria','Syria','SY','SYR',963),(180,'Somalia','Somalia','SO','SOM',252),(181,'Sri lanka','Sri Lanka','LK','LKA',94),(182,'Sudáfrica','South Africa','ZA','ZAF',27),(183,'Sudán','Sudan','SD','SDN',249),(184,'Suecia','Sweden','SE','SWE',46),(185,'Suiza','Switzerland','CH','CHE',41),(186,'Surinám','Suriname','SR','SUR',597),(187,'Swazilandia','Swaziland','SZ','SWZ',268),(188,'Tadjikistán','Tajikistan','TJ','TJK',992),(189,'Tailandia','Thailand','TH','THA',66),(190,'Taiwán','Taiwan','TW','TWN',886),(191,'Tanzania','Tanzania','TZ','TZA',255),(192,'Timor Oriental','East Timor','TL','TLS',670),(193,'Togo','Togo','TG','TGO',228),(194,'Tokelau','Tokelau','TK','TKL',690),(195,'Tonga','Tonga','TO','TON',676),(196,'Tunez','Tunisia','TN','TUN',216),(197,'Turkmenistán','Turkmenistan','TM','TKM',993),(198,'Turquía','Turkey','TR','TUR',90),(199,'Tuvalu','Tuvalu','TV','TUV',688),(200,'Ucrania','Ukraine','UA','UKR',380),(201,'Uganda','Uganda','UG','UGA',256),(202,'Uruguay','Uruguay','UY','URY',598),(203,'Uzbekistán','Uzbekistan','UZ','UZB',998),(204,'Vanuatu','Vanuatu','VU','VUT',678),(205,'Venezuela','Venezuela','VE','VEN',58),(206,'Vietnam','Vietnam','VN','VNM',84),(207,'Wallis y Futuna','Wallis and Futuna','WF','WLF',681),(208,'Yemen','Yemen','YE','YEM',967),(209,'Yibuti','Djibouti','DJ','DJI',253),(210,'Zambia','Zambia','ZM','ZMB',260),(211,'Zimbabue','Zimbabwe','ZW','ZWE',263);
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `deposit`
--

LOCK TABLES `deposit` WRITE;
/*!40000 ALTER TABLE `deposit` DISABLE KEYS */;
INSERT INTO `deposit` VALUES (1,250,'','2023-10-20',1,4,1,NULL,'16:36 PM'),(2,250,'','2023-10-20',1,4,2,NULL,'19:12 PM');
/*!40000 ALTER TABLE `deposit` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `document_type`
--

LOCK TABLES `document_type` WRITE;
/*!40000 ALTER TABLE `document_type` DISABLE KEYS */;
INSERT INTO `document_type` VALUES (1,'CC'),(2,'CE'),(3,'PASAPORTE'),(4,'NI');
/*!40000 ALTER TABLE `document_type` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,100,'2023-10-20',1,'54534','lk54',4,1,NULL,'19:15 PM');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,10,NULL,'2023-10-20','17:08 PM',0,1,15,4,'Netflix Inc','€378.05',0.18549933,0.6999817,'Up',1),(2,10,NULL,'2023-11-04','13:15 PM',5,1,15,4,'Netflix Inc','€403.35',0.8501047,3.399994,'Up',1),(3,10,NULL,'2023-11-09','21:03 PM',5.5,1,15.5,4,'Netflix Inc','€409.80',0.8118051,3.2999878,'Up',0);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Admin'),(2,'User'),(3,'User system');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,'2023-10-20','Deposit','1',250,1,4,NULL,'17:06 PM'),(2,'2023-10-20','Deposit','2',250,1,4,NULL,'19:14 PM'),(3,'2023-10-20','Expense','1',100,1,4,NULL,'19:16 PM');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'7HU5ALTS','Yirleison Palomeque',NULL,'$2b$10$S40CPBApxNoZRn08hbH8Gug5xhQf2DUpx2XSPw1fAgYowBMuGZieu','yppalomeque@gmail.com','3053027611',NULL,NULL,1,0,NULL,1,2,1,0,NULL,NULL,'41',NULL,NULL,2,NULL),(4,'7FS5MJWX','Samuel Moreno',NULL,'$2b$10$20KGBwiZdIKXaC3MVjmjqO1R8paLymtUl6hFcEye9811Tzp9xS2zS','samuel@gmail.com','3324423423',NULL,NULL,1,1,'775dd9dd-a39e-4ddc-8453-24ee4dfecec9-2023_10-20-avatar-cap-america.jpg',2,4,1,1,'3070da6e-0f60-416f-8a31-29fa4320406f-2023_10-20-cc_frente.jpeg','51fa80d9-03fe-430a-aed3-15f10156e894-2023_10-20-cc_posterior.jpeg','41',NULL,NULL,1,'');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05  9:46:53

-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: escuelahuetardb
-- ------------------------------------------------------
-- Server version	8.2.0


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
-- Table structure for table `encargado`
--
Create database escuelaHuetarDB
USE escuelaHuetarDB;


DROP TABLE IF EXISTS `encargado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encargado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estadoCivil` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ocupacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacionalidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `encargadoestudiante`
--

DROP TABLE IF EXISTS `encargadoestudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encargadoestudiante` (
  `estudianteId` int NOT NULL,
  `encargadoId` int NOT NULL,
  `parentesco` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`estudianteId`,`encargadoId`),
  KEY `encargadoId` (`encargadoId`),
  CONSTRAINT `encargadoestudiante_ibfk_1` FOREIGN KEY (`estudianteId`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE,
  CONSTRAINT `encargadoestudiante_ibfk_2` FOREIGN KEY (`encargadoId`) REFERENCES `encargado` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `sexo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `padecimientos` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hermanosEstudiantes` tinyint(1) DEFAULT NULL,
  `vacunasCompletas` tinyint(1) DEFAULT NULL,
  `beca` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `traslado` tinyint(1) DEFAULT NULL,
  `repitente` tinyint(1) DEFAULT NULL,
  `gradoEscolarId` int DEFAULT NULL,
  `encargadoLegalId` int DEFAULT NULL,
  `nacionalidad` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `gradoEscolarId` (`gradoEscolarId`),
  KEY `estudiante_ibfk_2` (`encargadoLegalId`),
  CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`gradoEscolarId`) REFERENCES `gradoescolar` (`id`) ON DELETE SET NULL,
  CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`encargadoLegalId`) REFERENCES `encargado` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



-- TABLA GRADO
CREATE TABLE gradoEscolar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);

-- TABLA SECCION
CREATE TABLE seccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gradoId INT NOT NULL,
    nombre VARCHAR(10) NOT NULL,
    capacidad INT,
    UNIQUE (gradoId, nombre),
    FOREIGN KEY (gradoId) REFERENCES gradoEscolar(id)
        ON DELETE CASCADE
);
-- Table structure for table `gradoescolar`
--



--
-- Table structure for table `matricula`
--

DROP TABLE IF EXISTS `matricula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matricula` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estudianteId` int NOT NULL,
  `gradoEscolarId` int NOT NULL,
  `usuarioId` int NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `estudianteId` (`estudianteId`),
  KEY `gradoEscolarId` (`gradoEscolarId`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `matricula_ibfk_1` FOREIGN KEY (`estudianteId`) REFERENCES `estudiante` (`id`),
  CONSTRAINT `matricula_ibfk_2` FOREIGN KEY (`gradoEscolarId`) REFERENCES `gradoescolar` (`id`),
  CONSTRAINT `matricula_ibfk_3` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nacionalidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `usuario` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-23 19:22:10
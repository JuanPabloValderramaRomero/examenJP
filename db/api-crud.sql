-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-03-2026 a las 05:50:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `api-crud`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `api_users`
--

CREATE TABLE `api_users` (
  `Api_user_id` int(11) NOT NULL,
  `Api_user` varchar(60) NOT NULL,
  `Api_password` varchar(255) NOT NULL,
  `Api_role` varchar(30) NOT NULL,
  `Api_status` enum('Active','Inactive') NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `api_users`
--

INSERT INTO `api_users` (`Api_user_id`, `Api_user`, `Api_password`, `Api_role`, `Api_status`, `Created_at`, `Updated_at`) VALUES
(1, 'user@email.com', '$2b$10$A.RezjA04B1GcvfGDnnve.elhd56BPN.44qUtvgyVG5Jy8IkwxoFi', 'Admin', 'Active', '2026-02-16 01:22:51', NULL),
(6, 'juan', '$2b$10$Bwa2rcIeyiQI2LnwUMMFSu3EEQyaMZb26EznHLGF59xmilEpIklSC', 'Admin', 'Active', '2026-03-17 04:25:12', NULL),
(7, 'pablo@gmail.com', '$2b$10$bC4oVjATXPz.7DrC5ap0cuDzjazqdQkqwwPrC0eYMQ6TXY70zufRC', '', 'Active', '2026-03-19 19:13:18', NULL),
(8, 'Maria@gmail.com', '$2b$10$qVfnQiH7H.RtAFx9XR9hmeCkaqFKoOU6XgLeVAFoW5mxxpH83SpHq', 'Jardinero', 'Active', '2026-03-19 19:30:04', NULL),
(9, 'jose@gmail.com', '$2b$10$4ryMPVwq6Fj1AhZt7xSLZuYlVd8/1V9jH/ScNQZu8Ut8bQ.ojrzYu', 'Pintor', 'Active', '2026-03-19 19:41:38', NULL),
(10, 'robin@gmail.com', '$2b$10$3jG.WDFKex.T1Ic5XPQC/e3gk9mds9bypzqUfW1jgrf./QLJfSHIy', 'Barbero', 'Active', '2026-03-20 04:35:11', NULL),
(11, 'camilo@gmail.com', '$2b$10$SGVvV8Q0wttw3uQR.2lrxukzODdRxTWe11dmrSLdaauQN5EEvdtKG', 'Pintor', 'Active', '2026-03-20 04:38:14', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modules`
--

CREATE TABLE `modules` (
  `Modules_id` int(11) UNSIGNED NOT NULL,
  `Modules_name` varchar(30) NOT NULL,
  `Modules_description` varchar(300) DEFAULT NULL,
  `Modules_route` varchar(80) DEFAULT NULL,
  `Modules_icon` varchar(30) DEFAULT NULL,
  `Modules_submodule` tinyint(3) NOT NULL DEFAULT 0,
  `Modules_parent_module` varchar(11) DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `modules`
--

INSERT INTO `modules` (`Modules_id`, `Modules_name`, `Modules_description`, `Modules_route`, `Modules_icon`, `Modules_submodule`, `Modules_parent_module`, `create_at`, `update_at`) VALUES
(1, 'Dashboard', 'This is dashboard', 'dashboard', 'bi-speedometer', 0, 'NULL', '2024-05-16 23:13:05', '0000-00-00 00:00:00'),
(2, 'User', 'This is user', 'user', 'bi-person-circle', 0, 'NULL', '2024-05-16 23:13:23', '0000-00-00 00:00:00'),
(3, 'Module', 'This is module', 'module', 'bi-box-fill', 0, 'NULL', '2024-05-16 23:13:53', '2024-05-28 06:07:47'),
(4, 'User Status', 'This is module the User Status', 'userStatus', 'bi-people-fill', 1, '2', '2024-05-25 22:13:17', NULL),
(5, 'Role', 'This is module the Role', 'role', 'bi-person-lock', 1, '2', '2024-05-26 00:03:41', NULL),
(6, 'Role Modules', 'This is Role Modules', 'roleModule', 'bi-boxes', 1, '3', '2024-05-27 20:46:42', NULL),
(8, 'Modulo Ventas 1', 'this is module', NULL, NULL, 0, NULL, '2026-02-27 21:31:03', '2026-03-02 10:15:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profiles`
--

CREATE TABLE `profiles` (
  `Profile_id` int(11) UNSIGNED NOT NULL,
  `Profile_email` varchar(255) NOT NULL,
  `Profile_name` varchar(30) NOT NULL,
  `Profile_photo` varchar(255) DEFAULT NULL,
  `User_id_fk` int(11) UNSIGNED DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `profiles`
--

INSERT INTO `profiles` (`Profile_id`, `Profile_email`, `Profile_name`, `Profile_photo`, `User_id_fk`, `create_at`, `update_at`) VALUES
(3, 'laura@gmail.com', 'Laura Camila', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUzNr-zMxcqeJwrncR5YG1EN-ygMrD\nAz1_U5gwTqfJsg&s', 4, '2024-05-24 06:24:11', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `Roles_id` int(11) UNSIGNED NOT NULL,
  `Roles_name` varchar(30) NOT NULL,
  `Roles_description` varchar(300) DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`Roles_id`, `Roles_name`, `Roles_description`, `create_at`, `update_at`) VALUES
(1, 'Admin', 'This is admin', '2024-05-16 23:11:57', '0000-00-00 00:00:00'),
(2, 'Test', 'This is test', '2024-05-16 23:12:18', '0000-00-00 00:00:00'),
(3, 'Secretario', 'Se encarga de la secretaria', '2026-03-19 18:55:06', NULL),
(4, 'jardinero', 'Se encarga de los jardines', '2026-03-19 19:29:38', NULL),
(5, 'Pintor', 'Encargado de Pintar', '2026-03-19 19:41:07', NULL),
(6, 'chef', 'cocina', '2026-03-20 04:14:58', NULL),
(7, 'Barbero', 'Encargado de los pelos', '2026-03-20 04:34:41', NULL),
(8, 'manicurista', 'manicurista de belleza', '2026-03-20 04:44:06', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_modules`
--

CREATE TABLE `role_modules` (
  `RoleModules_id` int(11) UNSIGNED NOT NULL,
  `Modules_fk` int(11) UNSIGNED DEFAULT NULL,
  `Roles_fk` int(11) UNSIGNED DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `role_modules`
--

INSERT INTO `role_modules` (`RoleModules_id`, `Modules_fk`, `Roles_fk`, `create_at`, `update_at`) VALUES
(13, 1, 1, '2026-02-27 20:02:51', '2026-02-27 20:02:51'),
(14, 2, 1, '2026-02-27 20:02:51', '2026-02-27 20:02:51'),
(15, 2, 2, '2026-02-27 21:41:28', '2026-03-02 10:15:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_status`
--

CREATE TABLE `user_status` (
  `User_status_id` int(11) UNSIGNED NOT NULL,
  `User_status_name` varchar(30) NOT NULL,
  `User_status_description` varchar(300) DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `user_status`
--

INSERT INTO `user_status` (`User_status_id`, `User_status_name`, `User_status_description`, `create_at`, `update_at`) VALUES
(1, 'Active', 'Active', '2024-05-18 05:44:01', NULL),
(2, 'Inactive', 'Inactive', '2024-05-18 05:44:01', NULL),
(3, 'Blocked', 'This is Blocked', '2024-05-28 01:05:28', '0000-00-00 00:00:00'),
(4, 'Delete', 'Delete', '2024-06-02 01:44:23', '0000-00-00 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `api_users`
--
ALTER TABLE `api_users`
  ADD PRIMARY KEY (`Api_user_id`),
  ADD UNIQUE KEY `Api_user` (`Api_user`);

--
-- Indices de la tabla `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`Modules_id`),
  ADD UNIQUE KEY `Modules_name` (`Modules_name`);

--
-- Indices de la tabla `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`Profile_id`),
  ADD UNIQUE KEY `Profile_email` (`Profile_email`),
  ADD KEY `fk_user_profile` (`User_id_fk`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Roles_id`),
  ADD UNIQUE KEY `Roles_name` (`Roles_name`);

--
-- Indices de la tabla `role_modules`
--
ALTER TABLE `role_modules`
  ADD PRIMARY KEY (`RoleModules_id`),
  ADD KEY `fk_module` (`Modules_fk`),
  ADD KEY `fk_roles` (`Roles_fk`);

--
-- Indices de la tabla `user_status`
--
ALTER TABLE `user_status`
  ADD PRIMARY KEY (`User_status_id`),
  ADD UNIQUE KEY `User_status_name` (`User_status_name`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `api_users`
--
ALTER TABLE `api_users`
  MODIFY `Api_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `modules`
--
ALTER TABLE `modules`
  MODIFY `Modules_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `profiles`
--
ALTER TABLE `profiles`
  MODIFY `Profile_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `Roles_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `role_modules`
--
ALTER TABLE `role_modules`
  MODIFY `RoleModules_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `user_status`
--
ALTER TABLE `user_status`
  MODIFY `User_status_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

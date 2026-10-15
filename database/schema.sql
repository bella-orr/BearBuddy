-- This file creates the tables for the database schema for the BearBuddy application.
-- Senior Design Project 2026/2027
-- Team 49

--uses the BearBuddy database
USE BearBuddy;
GO

-- Creates the table: users
CREATE TABLE dbo.users(
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()

);
GO
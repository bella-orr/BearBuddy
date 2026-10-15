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

-- Table: class_schedule
CREATE TABLE dbo.class_schedule (
    schedule_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    building VARCHAR(255),
    room VARCHAR(100),
    meeting_days VARCHAR(100),
    start_time TIME,
    end_time TIME,

    CONSTRAINT FK_ClassSchedule_User
        FOREIGN KEY (user_id)
        REFERENCES dbo.users(user_id)
);
GO


-- Table: personal_event
CREATE TABLE dbo.personal_event (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(MAX),
    type VARCHAR(100),
    start_time DATETIME2 NOT NULL,
    end_time DATETIME2 NOT NULL,
    location VARCHAR(255),

    CONSTRAINT FK_PersonalEvent_User
        FOREIGN KEY (user_id)
        REFERENCES dbo.users(user_id)
);
GO

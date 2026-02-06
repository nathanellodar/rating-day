-- RatingDay Database Initialization Script
-- This script creates the database schema for the RatingDay application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ratingday;

USE ratingday;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    score INT NOT NULL CHECK (
        score >= 1
        AND score <= 10
    ),
    note TEXT,
    UNIQUE KEY unique_user_date (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users (username);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_ratings_user_id ON ratings (user_id);

CREATE INDEX idx_ratings_date ON ratings (date);

-- Insert sample data for testing
INSERT INTO
    users (username, email, password)
VALUES (
        'john_doe',
        'john@example.com',
        '$2a$10$example.hash.for.john'
    ),
    (
        'jane_smith',
        'jane@example.com',
        '$2a$10$example.hash.for.jane'
    ),
    (
        'bob_wilson',
        'bob@example.com',
        '$2a$10$example.hash.for.bob'
    );

INSERT INTO
    ratings (
        userId,
        title,
        description,
        rating,
        category
    )
VALUES (
        1,
        'Great Product',
        'This product exceeded my expectations!',
        5,
        'Electronics'
    ),
    (
        1,
        'Good Service',
        'The customer service was helpful.',
        4,
        'Service'
    ),
    (
        2,
        'Average Experience',
        'It was okay, nothing special.',
        3,
        'Food'
    ),
    (
        2,
        'Excellent Movie',
        'One of the best movies I have seen this year.',
        5,
        'Entertainment'
    ),
    (
        3,
        'Poor Quality',
        'The quality was not as expected.',
        2,
        'Clothing'
    ),
    (
        3,
        'Fantastic Book',
        'Could not put it down!',
        5,
        'Books'
    );
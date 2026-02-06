const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    getRatings,
    createRating,
    updateRating,
    deleteRating,
    getAllUsersWithRatings,
    getUserRatings,
} = require('../controllers/ratingController');

// GET /users - Get all users with their ratings stats
router.get('/users', authenticateToken, getAllUsersWithRatings);

// GET /users/:userId - Get specific user's ratings
router.get('/users/:userId', authenticateToken, getUserRatings);

// GET / - List user's ratings
router.get('/', authenticateToken, getRatings);

// POST / - Create a new rating
router.post('/', authenticateToken, createRating);

// PUT /:id - Update a rating
router.put('/:id', authenticateToken, updateRating);

// DELETE /:id - Delete a rating
router.delete('/:id', authenticateToken, deleteRating);

module.exports = router;
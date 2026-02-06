const { Rating, User } = require('../models');
const { Op } = require('sequelize');

const getRatings = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: ratings } = await Rating.findAndCountAll({
            where: { userId: req.user.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username'],
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
        });

        res.json({
            ratings,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getRating = async (req, res) => {
    try {
        const { id } = req.params;

        const rating = await Rating.findOne({
            where: { id, userId: req.user.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username'],
            }],
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        res.json({ rating });
    } catch (error) {
        console.error('Get rating error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createRating = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { date, score, note } = req.body;

        // Validate score value
        if (score < 1 || score > 10) {
            return res.status(400).json({ message: 'Score must be between 1 and 10' });
        }

        // Validate date
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        // Normalize date to start of day and check for existing rating on same day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const existingRating = await Rating.findOne({
            where: {
                userId: req.user.id,
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lt]: endOfDay,
                },
            },
        });

        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this date' });
        }

        const newRating = await Rating.create({
            userId: req.user.id,
            date: startOfDay,
            score,
            note,
        });

        const ratingWithUser = await Rating.findByPk(newRating.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['username'],
            }],
        });

        res.status(201).json({ rating: ratingWithUser });
    } catch (error) {
        console.error('Create rating error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'You have already rated this date' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, note } = req.body;

        // Validate score value if provided
        if (score !== undefined && (score < 1 || score > 10)) {
            return res.status(400).json({ message: 'Score must be between 1 and 10' });
        }

        const ratingRecord = await Rating.findOne({
            where: { id, userId: req.user.id },
        });

        if (!ratingRecord) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Update fields
        if (score !== undefined) ratingRecord.score = score;
        if (note !== undefined) ratingRecord.note = note;

        await ratingRecord.save();

        const updatedRating = await Rating.findByPk(id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['username'],
            }],
        });

        res.json({ rating: updatedRating });
    } catch (error) {
        console.error('Update rating error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;

        const rating = await Rating.findOne({
            where: { id, userId: req.user.id },
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        await rating.destroy();

        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        console.error('Delete rating error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getRatings,
    getRating,
    createRating,
    updateRating,
    deleteRating,
};
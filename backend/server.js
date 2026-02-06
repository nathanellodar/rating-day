require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/rating');
app.use('/api/auth', authRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack || err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: 'Something went wrong!' });
    } else {
        res.status(500).json({ message: err.message || 'Something went wrong!', stack: err.stack });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync database (in development)
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync();
            console.log('Database synchronized.');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
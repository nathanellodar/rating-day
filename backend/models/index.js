const { Sequelize } = require('sequelize');
const sequelize = require("../config/database");

module.exports = {
    sequelize,
};

const User = require('./User')(sequelize);
const Rating = require('./Rating')(sequelize);

// Define associations
User.hasMany(Rating, {
    foreignKey: 'userId',
    as: 'ratings',
});

Rating.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

module.exports = {
    sequelize,
    User,
    Rating,
};
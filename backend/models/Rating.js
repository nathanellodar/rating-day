const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Rating = sequelize.define('Rating', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10,
            },
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'ratings',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'date']
            }
        ]
    });

    return Rating;
};
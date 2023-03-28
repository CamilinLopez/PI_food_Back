const { DataTypes, Sequelize } = require("sequelize");

module.exports = (database) => {
    database.define("Recetas", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        healthScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        analyzedInstructions: {
            type: DataTypes.JSON,
            allowNull: false
        },
        from: {
            type: DataTypes.STRING,
            defaultValue: "db",
        }
    },
        {
            timestamps: false
        }
    )
}
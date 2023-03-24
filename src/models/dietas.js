const { DataTypes } = require("sequelize");

module.exports = (database) => {
    database.define("diets", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
        {
            timestamps: false
        })
}
const { Sequelize } = require("sequelize");
require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const modelRecetas = require("./models/recetas");
const modelDietas = require("./models/dietas");


const database = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`, { logging: false, native: false });

modelRecetas(database);
modelDietas(database);

console.log(database.models);

const { Recetas, diets } = database.models;

diets.belongsToMany(Recetas, { through: "dietasRecetas" });
Recetas.belongsToMany(diets, { through: "dietasRecetas" });


module.exports = {
    ...database.models,
    database
}
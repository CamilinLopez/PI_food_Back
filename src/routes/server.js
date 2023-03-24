const express = require("express");
const cors = require("cors");

const server = express();

const { RouterRecetas } = require("../routes/recetas");
const { RouterDietas } = require("../routes/dietas");

server.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

server.use(express.json());

server.use("/recipes", RouterRecetas);
server.use("/diets", RouterDietas);



module.exports = server;
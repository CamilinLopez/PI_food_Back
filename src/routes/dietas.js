const express = require("express");
const RouterDietas = express.Router();

const { getDiets,getAllDiets } = require("../controllers/dietsController");

RouterDietas.get("/", async (req, res) => {
    try {
        const data = await getDiets();
        if (data.error) throw new Error(data.error);

        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

RouterDietas.get("/getAllDiets", async (req, res) => {
    try {
        const data = await getAllDiets();
        if(data.error) throw new Error(data.error);

        res.status(200).send(data);
    } catch (error) {
        
    }
} )


module.exports = { RouterDietas }
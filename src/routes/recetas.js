const express = require("express");
const RouterRecetas = express.Router();
const { joinData, getByIdRecipe, getByNameRecipe, createRecipe, getDataFilter } = require("../controllers/recipesController");

RouterRecetas.get("/All", async (req, res) => {

    try {
        const data = (await joinData());
        if (data.error) throw new Error(data.error);

        res.status(200).json(data);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

RouterRecetas.get("/getDataFilter", async (req, res) => {
    const { dataFuete, typeDiet, ordenarByScore } = req.query;

    try {
        const data = await getDataFilter(dataFuete, typeDiet, ordenarByScore);
        if (data.error) throw new Error(data.error);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error.message)
    }
});

RouterRecetas.get("/tomar", (req, res) => {
    console.log("mama")
    res.status(200).json({ data: "bien" })
});

RouterRecetas.get("/:idRecipe", async (req, res) => {
    const { idRecipe } = req.params;
    try {
        const dataSummary = await getByIdRecipe(idRecipe);
        if (dataSummary.error) throw new Error(dataSummary.error);

        res.status(200).json(dataSummary);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

RouterRecetas.get("/", async (req, res) => {
    const { name } = req.query;
    try {
        const data = await getByNameRecipe(name);

        if (data.error) throw new Error(data.error);

        res.status(200).json(data);

    } catch (error) {
        res.status(404).send(error.message);
    }
});

RouterRecetas.post("/", async (req, res) => {
    const { title, image, summary, healthScore, analyzedInstructions, dietas } = req.body;
    try {
        const data = await createRecipe(title, image, summary, healthScore, analyzedInstructions, dietas);

        if (data.error) throw new Error(data.error);

        res.status(200).send(data);
    } catch (error) {
        res.status(404).send(error.message);
    }
});



module.exports = { RouterRecetas };
const { Sequelize, or } = require("sequelize");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;

const { Recetas, diets } = require("../DB");


const getData = async () => {
    try {
        const data = ((await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=10`)).data).results;

        const resultados = data.map(({ id, title, summary, diets, healthScore, analyzedInstructions, image, vegetarian, vegan }) => {
            return {
                id,
                title,
                summary,
                diets,
                healthScore,
                analyzedInstructions,
                image,
                vegetarian,
                vegan,
                from: "api"
            }
        })
        return resultados;
    } catch (error) {
        return { error: error.message }
    }
}

const getDbFood = async (where, order) => {
    try {
        let data = await Recetas.findAll({
            include: [
                {
                    model: diets,
                    attributes: ["name"],
                    where,
                    through: {
                        attributes: []
                    }
                }
            ],
            order
        });

        return data;
    } catch (error) {
        return { error: error.message }
    }
}

const getDbRecipesByDiets = async () => {
    try {
        const data = await Recetas.findAll({
            include: [
                {
                    model: diets,
                }
            ],
            order: [
                [Sequelize.fn('LEFT', Sequelize.col('title'), 1), 'ASC']
            ]
        });
        return data;
    } catch (error) {
        return { error: error.message }
    }
}

const joinData = async () => {
    try {
        const dataApi = await getData();
        const dataDb = await getDbFood();

        if (dataApi.error) throw new Error(dataApi.error);
        if (dataDb.error) throw new Error(dataDb.error);

        const dataAll = dataApi.concat(dataDb);

        return dataAll;
    } catch (error) {
        return { error: error.message };
    }
}

const getByIdRecipe = async (idRecipe) => {
    try {
        if (!idRecipe) throw new Error("Agrege un id");

        const dataJoin = await joinData();
        const data = dataJoin.find(item => item.id === parseInt(idRecipe));

        if (!data) throw new Error("No existe esta receta");

        return data;
    } catch (error) {
        return { error: error.message };
    }
}

const getByNameRecipe = async (name) => {
    try {
        if (!name) throw new Error("No hay un nombre pasado por query");

        const dataJoin = await joinData();

        const data = dataJoin.filter(item => item.title.toLowerCase().includes(name.toLowerCase()));

        if (!data.length) return [{status: "No found", id:1}]; //throw new Error(`No hay recetas con el nombre ${name}`);

        return data;
    } catch (error) {
        return { error: error.message };
    }
}

const createRecipe = async (title, image, summary, healthScore, analyzedInstructions, dietas) => {
    try {
        if (!title || !image || !summary || !healthScore || !analyzedInstructions || !dietas) throw new Error("Faltan datos para crear la receta");

        const [nameR, created] = await Recetas.findOrCreate({
            where: { title },
            defaults: { title, image, summary, healthScore, analyzedInstructions }
        });
        if (!created) throw new Error(`Ya existe la receta con el nombre ${title}`);

        const getDiets = await diets.findAll({
            where: { name: dietas }
        });

        await nameR.addDiets(getDiets);

        if (!getDiets.length) throw new Error(`Se ha creado la receta ${title} pero no se ha relacionado por que no se ha encontrado la dieta ${dietas}`)

        return `La receta ${title} se ha creado en la base de datos food`;
    } catch (error) {
        return { error: error.message };
    }
}

const getDataFilter = async (dataFuete, typeDiet, ordenarByScore) => {

    try {
        let data = await joinData();

        if (data.error) throw new Error(data.error);

        if (dataFuete !== "All" & dataFuete !== undefined) data = data.filter(({ from }) => from === dataFuete);
        if (typeDiet !== "All" && typeDiet !== undefined) {
            data = data.filter(recipe => {
                if (recipe.from === "api") return recipe.diets.includes(typeDiet);
                if (recipe.from === "db") return recipe.diets.some(diet => diet.name === typeDiet);
            })
        }
        if (ordenarByScore === "orderAlfabetic") data.sort((a, b) => a.title.localeCompare(b.title));
        if (ordenarByScore === "acendente") data.sort((a, b) => a.healthScore - b.healthScore)
        if (ordenarByScore === "decendente") data.sort((a, b) => b.healthScore - a.healthScore)

        return data;
    } catch (error) {
        return { error: error.message };
    }


}



module.exports = { joinData, getByIdRecipe, getByNameRecipe, createRecipe, getDataFilter };

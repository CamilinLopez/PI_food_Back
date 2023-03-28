const { diets } = require("../DB");
const { joinData } = require("./recipesController");


const getDiets = async () => {
    let arr = [];
    try {
        const data = await joinData();
        if (data.error) throw new Error(data.error);

        let dietas = data.map(({ diets }) => {
            return diets;
        });

        dietas = dietas.map(subarray => {
            return subarray.map(obj => obj.name ? obj.name : obj)
        });

        for (let i = 0; i < dietas.length; i++) { arr = arr.concat(dietas[i]) }

        arr.forEach((index) => {
            diets.findOrCreate({
                where: { name: index }
            })
        });

        const dbDiets = await diets.findAll();

        return dbDiets;
    } catch (error) {
        return { error: error.message };
    }
}

const getAllDiets = async () => {
    try {
        await getDiets();
        let data = (await diets.findAll({
            attributes: ["name"],
            raw: true
        }));
        if (!data.length) throw new Error("No hay dietas");
        data = data.map(({name}) => name);
        return data;
    } catch (error) {
        return { error: error.message };
    }
}
module.exports = { getDiets, getAllDiets };


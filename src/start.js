const server = require("./routes/server");
const { database } = require("./DB");

const PORT = 3001;

database.sync({ force: false }).then(() => {
    console.log("database conectada");
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}).catch((err) => console.log(err.message));
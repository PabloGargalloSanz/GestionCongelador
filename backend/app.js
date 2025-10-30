import express from "express";
import logger from "./middlewares/logger.js";
import ENV from "./utils/envLoader.js";


const app = express();

app.use(express.json());
app.use(logger);

if(!fs.existsSync(ENV.CLOUD_STORAGE_PATH)) {
    fs.mkdirSync(ENV.CLOUD_STORAGE_PATH, {recursive:true});
}

//Endpoint raiz
app.get('/', (req,res) => {
    res.send ({
        mensaje: "Bienvenido"
    })
});

//Escuchar en el puerto
app.listen(ENV.PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});
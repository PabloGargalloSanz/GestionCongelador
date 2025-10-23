import express from "express";
import logger from './middlewares/logger.js'

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(logger);

//Endpoint raiz
app.get('/', (req,res) => {
    res.send ({
        mensaje: "Bienvenido"
    })
});

//Escuchar en el puerto
app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});
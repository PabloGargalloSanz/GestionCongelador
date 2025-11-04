import express from 'express';
import logger from './middlewares/logger.js';
import ENV from './utils/envLoader.js';
import pool from './db/db.js';


const app = express();

app.use(express.json());
app.use(logger);

//Endpoint raiz
app.get('/', (req,res) => {
    res.send ({
        mensaje: "Bienvenido"
    })
});

// Conectarse a la base de datos
pool.connect()
    .then(() => {
        console.log('✅ Conectado a la base de datos');
    }).catch((error) =>{
        console.log('❌ Error al conectarse a la base de datos ', error);
})

//Escuchar en el puerto
app.listen(ENV.PORT, () => {
    console.log('Servidor escuchando en el puerto ' + process.env.DB_PORT);
});
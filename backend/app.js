import express from 'express';
import cors from 'cors';    
import ENV from './utils/envLoader.js';
import pool from './db/db.js';
import mainRouter from './routes/mainRouter.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { activityLogger } from './middlewares/activityLogger.js';
import path from 'path';

const app = express();

app.use(express.static(path.join('..', 'frontend')));

app.use(cors());
app.set('trust proxy', true);
app.use(express.json());
app.use(activityLogger);
app.use('/api', mainRouter);


//Endpoint raiz
app.get('/api', (req,res) => {
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


app.use(globalErrorHandler);

//Escuchar en el puerto
app.listen(ENV.PORT, () => {
    console.log('Servidor escuchando en el puerto ' + process.env.PORT);
});
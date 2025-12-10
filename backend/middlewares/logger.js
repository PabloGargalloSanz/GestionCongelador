import newLog from '../services/logs.service.js';

const logger = async (req, res, next) => {
    
    const data = {
        fecha_log: new Date().toISOString().split('T')[0],
        hora_log: new Date().toTimeString().split(' ')[0],
        metodo: req.method,
        ip: req.ip,
        direccion: req.url 
    };

    //Guarda en la Base de Datos
    try {
        await newLog(data); 
        console.log("Log guardado en la base de datos");
    } catch (error) {
        console.error("Error al guardar el log en la base de datos:", error);
    }
    
    next();
};

export default logger;
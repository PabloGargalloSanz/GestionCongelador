import fs from "fs";
import path from "path";

const logger = (req, res, next) => {

    const fecha = new Date().toISOString().split('T')[0];
    const string = `[${new Date().toISOString()}] ${req.method} - ${req.url} - ${req.ip}`;

    const direccion = path.join(process.cwd(), 'logs');
    const nombreArchivo = path.join(direccion, fecha + '.log');

    console.log(string);

    //Crear carpeta logs si no esta creada
    try {
        fs.mkdirSync(direccion, { recursive: true});
    } catch (error) {
        console.error("Error al crear la carpeta logs: ", error);
        return next();
    }

    //Escribe en el archivo log, nombreado por fecha, el log del server
    fs.appendFile(nombreArchivo, string + '\n',
        (error) => {
            if(error) {
                console.log("Error al escribir el archivo log:",error);
            }
        }
    );
    next();

};

export default logger;
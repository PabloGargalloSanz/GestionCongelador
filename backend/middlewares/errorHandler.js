import { logError } from '../services/logs.service.js';

export const globalErrorHandler = async (err, req, res, next) => {
    const ip = req.ip || '0.0.0.0'; //evitar posibles problemas insercion
    const statusCode = err.status  || 500;
    const action = err.action || 'SYSTEM_ERROR'; 
    const rute = req.originalUrl;
    const method = req.method;
    const details = err.details || null;
    
    const userId = req.userId || (req.user ? req.user.id : null); // con token tenemos id
    
    logError(userId, action, ip, method, rute, err.message +" ( "+ details + " )", statusCode);
    
    console.error(`[${action}] - Error: ${err.message}`);

    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
};
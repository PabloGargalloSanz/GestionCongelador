import { logAll } from '../services/logs.service.js';

export const activityLogger = (req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const ip = req.ip || '0.0.0.0';
            let userId = req.userId || null;
            const rute = req.originalUrl;
            const method = req.method;
            let action = req.action;
            const details = 'Acción realizada con exito';
            const statusCode = res.statusCode;
            
            logAll(userId, action, ip, method, rute, details, statusCode);
        } 
    });
    next();
};
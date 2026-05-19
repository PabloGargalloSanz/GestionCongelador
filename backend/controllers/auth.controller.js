import {createUser, authenticateUser} from '../services/auth.service.js';
import {generateToken} from '../utils/token.util.js';

//Validacion contraseña
const validatePassword = (password) => {
    const passwordError = (mensaje) => {
        const error = new Error(mensaje);
        error.status = 400; 
        error.action = 'REGISTER_FAIL_WEAK_PASSWORD';
        return error;
    };

    if (!password || password.length < 8) return passwordError('La contraseña debe tener al menos 8 caracteres.');
    if (!/[A-Z]/.test(password)) return passwordError('La contraseña debe incluir al menos una letra mayúscula.');
    if (!/[a-z]/.test(password)) return passwordError('La contraseña debe incluir al menos una letra minúscula.');
    if (!/\d/.test(password)) return passwordError('La contraseña debe incluir al menos un número.');
    if (!/[\W_]/.test(password)) return passwordError('La contraseña debe incluir al menos un carácter especial (ej: @, #, !, -, _).');

    return null;
};


//nuevo usuario
export const register = async (req, res, next) => {
    const { email, password, role } = req.body;   
    
    const errorValidacion = validatePassword(password);
    if (errorValidacion) {
        return next(errorValidacion); 
    }

    /////////////////////////////////////////////////////
    //Quitar antes de finalizar
    /////////////////////////////////////////////////////
    const rolType = role ? role : 'user';

    try {
        const newUser =  await createUser (email, password, rolType);
        req.action = 'REGISTER_SUCCESS';
        res.status(201).json(newUser);

    } catch (error) {
        console.error('Error registering user:', error);

        if (error.code === '23505') {
            error.status = 409;
            error.message = "El email ya está registrado";
        }
        error.action = 'REGISTER_FAIL';
        next(error);
    }   
};

//autentificar usuario
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            const token = generateToken(user);

            // guardo id en req para uso posterior
            req.userId = user.id;
            req.action = 'LOGIN_SUCCES';

            res.status(200).json({
                message: "Login exitoso",
                token: token,
                user: {
                    id: user.id,
                    email: user.email
                }
            });

        } else {
            const err = new Error('Credenciales erroneas');
            err.details = req.body.email;
            err.action = 'AUTH_LOGIN_FAIL';
            err.status = 401;
            return next(err);
        }
        
    } catch (error) {
        error.status = 500;
        error.action = 'AUTH_LOGIN_BIG_FAIL';
        next(error);
    }

};
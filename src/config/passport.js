/**
 * @file passport.js
 * @description Configuración de las estrategias de autenticación local con Passport.js.
 * Define cómo buscar el usuario, validar su contraseña y manejar la sesión (serialización/deserialización).
 */

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

/**
 * @function
 * @description Configura e inicializa la estrategia local para Passport.
 * @param {object} passport - Instancia del módulo Passport que se inicializó en el servidor principal.
 */
module.exports = function (passport) {
    // Definimos la estrategia local usando el campo 'email' como nombre de usuario principal
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // Buscamos el usuario por su correo electrónico.
            // Usamos `.select('+password')` porque en el esquema de User, la contraseña está marcada
            // como select: false para que no se devuelva por defecto en las consultas comunes.
            const user = await User.findOne({ email }).select('+password');

            // Si no se encuentra el usuario con dicho email
            if (!user) {
                return done(null, false, { message: 'El email no está registrado' });
            }

            // Verificamos si la contraseña coincide llamando al método del modelo de usuario
            const isMatch = await user.matchPassword(password);

            // Si la contraseña no es correcta
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            // Verificamos si la cuenta está activa
            if (user.activo === false) {
                return done(null, false, { message: 'Tu cuenta ha sido desactivada. Comunícate con el administrador.' });
            }

            // Autenticación exitosa, retornamos el objeto del usuario
            return done(null, user);
        } catch (err) {
            console.error('Error en la estrategia de Passport:', err);
            return done(err);
        }
    }));

    /**
     * @description Serializar el usuario para guardar su identificador (ID) dentro de la sesión.
     */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    /**
     * @description Deserializar el usuario a partir del ID de la sesión para reconstruir el objeto `req.user`.
     */
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

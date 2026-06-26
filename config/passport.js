const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // Buscar usuario por email, incluyendo el campo password que está oculto por defecto
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return done(null, false, { message: 'El email no está registrado' });
            }

            // Verificar contraseña
            const isMatch = await user.matchPassword(password);

            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

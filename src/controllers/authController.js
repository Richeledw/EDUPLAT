/**
 * @file authController.js
 * @description Controlador de lógica de negocio para la autenticación de usuarios
 * (registro con selección de rol, ingreso con redirección según rol, y cierre de sesión).
 */

const passport = require('passport');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Claves secretas para registrarse como docente o admin (configurables en .env)
const DOCENTE_SECRET = process.env.DOCENTE_SECRET || 'docente123';
const ADMIN_SECRET   = process.env.ADMIN_SECRET   || 'admin123';

/**
 * @route GET /registro
 * @description Muestra la vista con el formulario de creación de cuenta.
 */
exports.getRegistro = (req, res) => {
    res.render('registro', {
        datosRegistro: {
            titulo: 'Crear Cuenta',
            descripcion: 'Únete a nuestra comunidad de aprendizaje'
        }
    });
};

/**
 * @route POST /registro
 * @description Procesa el registro del usuario.
 * Valida los campos, verifica duplicidad de email, comprueba la clave secreta
 * para roles privilegiados (docente/admin), guarda el usuario en la BD,
 * intenta enviar un correo de bienvenida y luego inicia sesión automáticamente.
 */
exports.postRegistro = async (req, res) => {
    const { nombre, email, password, rol, rolSecret } = req.body;
    let errors = [];

    // ── Validaciones básicas ──────────────────────────────────────────────
    if (!nombre || !email || !password) {
        errors.push({ msg: 'Por favor rellena todos los campos obligatorios' });
    }

    if (password && password.length < 6) {
        errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // ── Validación del rol solicitado ─────────────────────────────────────
    const rolesValidos = ['estudiante', 'docente', 'admin'];
    const rolSolicitado = rolesValidos.includes(rol) ? rol : 'estudiante';

    if (rolSolicitado === 'docente' && rolSecret !== DOCENTE_SECRET) {
        errors.push({ msg: 'Clave de acceso para Docente incorrecta' });
    }

    if (rolSolicitado === 'admin' && rolSecret !== ADMIN_SECRET) {
        errors.push({ msg: 'Clave de acceso para Administrador incorrecta' });
    }

    // Si existen errores de validación, re-renderizar el formulario
    if (errors.length > 0) {
        return res.render('registro', {
            errors,
            nombre,
            email,
            password,
            rolSolicitado,
            datosRegistro: { titulo: 'Crear Cuenta', descripcion: 'Únete a nuestra comunidad' }
        });
    }

    try {
        // Verificar si el correo electrónico ya está registrado
        let user = await User.findOne({ email: email });
        if (user) {
            errors.push({ msg: 'El email ya está registrado' });
            return res.render('registro', {
                errors,
                nombre,
                email,
                password,
                rolSolicitado,
                datosRegistro: { titulo: 'Crear Cuenta', descripcion: 'Únete a nuestra comunidad' }
            });
        }

        // Instanciar el nuevo usuario con el rol validado
        const newUser = new User({
            nombre,
            email,
            password,
            rol: rolSolicitado
        });

        // Guardar en MongoDB (la contraseña se encripta en el hook pre-save de User.js)
        await newUser.save();

        // ── Correo de bienvenida ──────────────────────────────────────────
        const rolesLabel = { estudiante: 'Estudiante', docente: 'Docente', admin: 'Administrador' };
        const message = `Hola ${nombre},\n\nGracias por unirte a Eduplat como ${rolesLabel[rolSolicitado]}. Estamos emocionados de tenerte aquí.`;
        const html    = `<p>Hola <strong>${nombre}</strong>,</p><p>Gracias por unirte a Eduplat como <strong>${rolesLabel[rolSolicitado]}</strong>. Estamos emocionados de tenerte aquí.</p>`;

        try {
            await sendEmail({
                email: newUser.email,
                subject: '¡Bienvenido a Eduplat!',
                message,
                html
            });
        } catch (emailError) {
            console.error('Error enviando email de bienvenida:', emailError);
            // No bloqueamos el flujo si falla el envío de correo.
        }

        // Iniciar sesión automáticamente usando Passport
        req.login(newUser, (err) => {
            if (err) {
                console.error('Error al hacer auto-login después del registro:', err);
                return res.redirect('/login');
            }
            req.flash('success_msg', `¡Bienvenido, ${nombre}! Tu cuenta de ${rolesLabel[rolSolicitado]} ha sido creada.`);
            return res.redirect(_panelByRole(rolSolicitado));
        });

    } catch (err) {
        console.error('Error en el registro del usuario:', err);
        res.status(500).send('Error en el servidor');
    }
};

/**
 * @route GET /login
 * @description Muestra la vista con el formulario de inicio de sesión.
 */
exports.getLogin = (req, res) => {
    res.render('login', {
        datosLogin: {
            titulo: 'Iniciar Sesión',
            descripcion: 'Accede a tus cursos y progreso'
        }
    });
};

/**
 * @route POST /login
 * @description Procesa las credenciales de ingreso mediante la estrategia local de Passport
 * y redirige según el rol del usuario autenticado.
 */
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }

        if (!user) {
            req.flash('error', info ? info.message : 'Credenciales incorrectas');
            return res.redirect('/login');
        }

        req.login(user, (loginErr) => {
            if (loginErr) { return next(loginErr); }
            // Redirigir según el rol del usuario
            return res.redirect(_panelByRole(user.rol));
        });
    })(req, res, next);
};

/**
 * @route GET /logout
 * @description Cierra la sesión activa del usuario, limpia las variables de sesión y redirige al Home.
 */
exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'Has cerrado sesión exitosamente');
        res.redirect('/');
    });
};

/**
 * @helper _panelByRole
 * @description Devuelve la URL de redirección tras el login/registro según el rol.
 * @param {string} rol - El rol del usuario ('admin', 'docente', 'estudiante')
 * @returns {string} La ruta de redirección
 */
function _panelByRole(rol) {
    switch (rol) {
        case 'admin':    return '/admin/dashboard';
        case 'docente':  return '/docente/dashboard';
        default:         return '/panel';   // estudiante
    }
}

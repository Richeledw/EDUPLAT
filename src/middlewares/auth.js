/**
 * @file auth.js
 * @description Middlewares para verificación de autenticación y control de acceso basado en roles (RBAC).
 * Protege rutas para Estudiantes, Docentes y Administradores.
 */

/**
 * @middleware isAuth
 * @description Verifica si la sesión actual está autenticada.
 * Si no está autenticado, redirige al login con mensaje explicativo.
 */
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Verificar que la cuenta no haya sido desactivada
        if (req.user.activo === false) {
            req.logout(() => {
                req.flash('error_msg', 'Tu cuenta ha sido desactivada por el administrador.');
                res.redirect('/login');
            });
            return;
        }
        return next();
    }
    req.flash('error_msg', 'Debes iniciar sesión para acceder a esta sección.');
    res.redirect('/login');
};

/**
 * @middleware isAdmin
 * @description Verifica que el usuario autenticado tenga el rol 'admin'.
 */
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        return next();
    }
    req.flash('error_msg', 'Acceso denegado: Se requiere rol de Administrador.');
    res.redirect('/panel');
};

/**
 * @middleware isDocente
 * @description Verifica que el usuario autenticado tenga el rol 'docente' (o 'admin').
 */
const isDocente = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'docente' || req.user.rol === 'admin')) {
        return next();
    }
    req.flash('error_msg', 'Acceso denegado: Se requiere rol de Docente.');
    res.redirect('/panel');
};

/**
 * @middleware isDocenteOrAdmin
 * @description Alias para permisos compartidos entre docentes y administradores.
 */
const isDocenteOrAdmin = isDocente;

/**
 * @middleware redirectIfAuth
 * @description Si el usuario ya tiene sesión iniciada, lo redirige directamente a su panel correspondiente.
 */
const redirectIfAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        const rol = req.user.rol;
        if (rol === 'admin') return res.redirect('/admin/dashboard');
        if (rol === 'docente') return res.redirect('/docente/dashboard');
        return res.redirect('/panel');
    }
    next();
};

module.exports = {
    isAuth,
    isAdmin,
    isDocente,
    isDocenteOrAdmin,
    redirectIfAuth
};

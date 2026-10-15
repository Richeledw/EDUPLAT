/**
 * @file authRoutes.js
 * @description Define el enrutador para las acciones de autenticación (registro, login, logout, sesión API).
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuth } = require('../middlewares/auth');

// Ruta para mostrar el formulario de registro (redirige si ya está autenticado)
router.get('/registro', redirectIfAuth, authController.getRegistro);

// Ruta para procesar los datos de registro
router.post('/registro', authController.postRegistro);

// Ruta para mostrar el formulario de login (redirige si ya está autenticado)
router.get('/login', redirectIfAuth, authController.getLogin);

// Ruta para procesar el intento de inicio de sesión
router.post('/login', authController.postLogin);

// Ruta para procesar el cierre de sesión de la cuenta
router.get('/logout', authController.getLogout);

// Endpoint API para consultar el estado actual de la sesión
router.get('/api/auth/session', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({
            authenticated: true,
            user: {
                id: req.user._id,
                nombre: req.user.nombre,
                email: req.user.email,
                rol: req.user.rol
            }
        });
    }
    return res.json({ authenticated: false, user: null });
});

module.exports = router;

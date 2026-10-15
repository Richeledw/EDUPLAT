/**
 * @file panelRoutes.js
 * @description Define el enrutador para las vistas del panel de control y de ajustes de configuración.
 * Estas rutas son de acceso restringido y requieren estar autenticado.
 */

const express = require('express');
const router = express.Router();
const panelController = require('../controllers/panelController');

// Importamos el middleware que verifica la autenticación del usuario
const { isAuth } = require('../middlewares/auth');

// Ruta para visualizar el dashboard personal del estudiante (Protegida)
router.get('/panel', isAuth, panelController.getPanel);

// Ruta para visualizar y modificar la configuración del perfil del usuario (Protegida)
router.get('/configuracion', isAuth, panelController.getConfiguracion);

module.exports = router;

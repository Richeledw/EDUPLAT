/**
 * @file indexRoutes.js
 * @description Define el enrutador para las páginas públicas generales (Home y Contacto).
 */

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Ruta para la página de inicio (Landing Page)
router.get('/', indexController.getHome);

// Ruta para ver la página y el formulario de contacto
router.get('/contacto', indexController.getContacto);

// Ruta para procesar el envío del formulario de contacto
router.post('/contacto', indexController.postContacto);

module.exports = router;

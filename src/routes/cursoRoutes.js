/**
 * @file cursoRoutes.js
 * @description Define el enrutador para las rutas relacionadas con los cursos, inscripción,
 * Aula Virtual (Course Player) y espacio de proyectos prácticos.
 */

const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { isAuth } = require('../middlewares/auth');

// Catálogo general de cursos
router.get('/temas', cursoController.getTemas);

// Detalle y temario de un curso
router.get('/curso/:id', cursoController.getCurso);

// Inscripción a un curso
router.post('/curso/:id/inscribir', isAuth, cursoController.postInscribir);

// Aula Virtual (Course Player) - Lección activa por defecto
router.get('/curso/:id/aula', isAuth, cursoController.getAulaVirtual);

// Aula Virtual (Course Player) - Lección específica seleccionada
router.get('/curso/:id/aula/:leccionId', isAuth, cursoController.getAulaVirtual);

// Marcar lección como completada
router.post('/curso/:id/leccion/:leccionId/completar', isAuth, cursoController.postCompletarLeccion);

// Guardar avance del proyecto práctico del estudiante
router.post('/curso/:id/proyecto/guardar', isAuth, cursoController.postGuardarProyecto);

// Compatibilidad con endpoint API previo
router.post('/api/progreso/completar', isAuth, cursoController.postCompletarProgreso);

module.exports = router;

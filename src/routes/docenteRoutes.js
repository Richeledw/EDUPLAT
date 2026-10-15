/**
 * @file docenteRoutes.js
 * @description Rutas exclusivas para el rol de Docente (teacher).
 * Protegidas con los middlewares isAuth e isDocente.
 */

const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');
const { isAuth, isDocente } = require('../middlewares/auth');

// Proteger todas las rutas bajo /docente con isAuth e isDocente
router.use('/docente', isAuth, isDocente);

// Dashboard principal del docente
router.get('/docente/dashboard', docenteController.getDashboard);

// ── Creación y Edición de Cursos Propios ──
router.get('/docente/cursos/nuevo', docenteController.getNuevoCurso);
router.post('/docente/cursos/crear', docenteController.crearCurso);
router.get('/docente/cursos/:id/editar', docenteController.getEditarCurso);
router.post('/docente/cursos/:id/editar', docenteController.editarCurso);

// ── Constructor de Contenido (Módulos, Lecciones y Recursos) ──
router.get('/docente/cursos/:id/contenido', docenteController.getContenidoCurso);
router.post('/docente/cursos/:id/modulo/crear', docenteController.crearModulo);
router.post('/docente/cursos/:id/modulo/:mIndex/leccion/crear', docenteController.crearLeccion);
router.post('/docente/cursos/:id/modulo/:mIndex/leccion/:lIndex/eliminar', docenteController.eliminarLeccion);
router.post('/docente/cursos/:id/recurso/crear', docenteController.crearRecurso);
router.post('/docente/cursos/:id/recurso/:rId/eliminar', docenteController.eliminarRecurso);

// ── Revisión de Proyectos Prácticos ──
router.get('/docente/proyectos', docenteController.getProyectos);
router.post('/docente/proyectos/:id/retroalimentar', docenteController.retroalimentarProyecto);

module.exports = router;

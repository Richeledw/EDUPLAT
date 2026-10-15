/**
 * @file adminRoutes.js
 * @description Rutas exclusivas para el rol de Administrador.
 * Protegidas con los middlewares isAuth e isAdmin.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuth, isAdmin } = require('../middlewares/auth');

// Aplicar middlewares de autenticación y rol de admin a todas las rutas
router.use('/admin', isAuth, isAdmin);

// Dashboard principal del administrador
router.get('/admin/dashboard', adminController.getDashboard);

// ── Gestión de Usuarios ──
router.get('/admin/usuarios', adminController.getUsuarios);
router.post('/admin/usuarios/:id/rol', adminController.cambiarRol);
router.post('/admin/usuarios/:id/editar', adminController.editarUsuario);
router.post('/admin/usuarios/:id/toggle-estado', adminController.toggleEstadoUsuario);
router.post('/admin/usuarios/:id/eliminar', adminController.eliminarUsuario);

// ── Gestión Global de Cursos ──
router.get('/admin/cursos', adminController.getCursos);
router.post('/admin/cursos/crear', adminController.crearCurso);
router.post('/admin/cursos/:id/editar', adminController.editarCurso);
router.post('/admin/cursos/:id/eliminar', adminController.eliminarCurso);

// ── Gestión de Contenido y Recursos ──
router.get('/admin/cursos/:id/contenido', adminController.getContenidoCurso);
router.post('/admin/cursos/:id/modulo/crear', adminController.crearModulo);
router.post('/admin/cursos/:id/modulo/:mIndex/leccion/crear', adminController.crearLeccion);
router.post('/admin/cursos/:id/modulo/:mIndex/leccion/:lIndex/eliminar', adminController.eliminarLeccion);
router.post('/admin/cursos/:id/recurso/crear', adminController.crearRecurso);
router.post('/admin/cursos/:id/recurso/:rId/eliminar', adminController.eliminarRecurso);

// ── Revisión de Proyectos Prácticos ──
router.get('/admin/proyectos', adminController.getProyectos);
router.post('/admin/proyectos/:id/retroalimentar', adminController.retroalimentarProyecto);

module.exports = router;

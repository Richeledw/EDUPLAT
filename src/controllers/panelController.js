/**
 * @file panelController.js
 * @description Controlador para gestionar las vistas del panel de control del estudiante (Dashboard),
 * progreso académico en tiempo real y proyectos prácticos entregados.
 */

const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const StudentProject = require('../models/StudentProject');
const staticCursos = require('../models/cursosData');

/**
 * @route GET /panel
 * @description Renderiza el panel de control del estudiante con sus cursos inscritos,
 * avance porcentual real y estado de sus proyectos prácticos.
 */
exports.getPanel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const allDbCourses = await Course.find();

        // Mapear cursos en un diccionario rápido por ID
        const cursosDict = {};
        allDbCourses.forEach(c => {
            cursosDict[c.id] = c.toObject();
        });

        // Combinar con estáticos si alguno no está en BD
        Object.keys(staticCursos).forEach(id => {
            if (!cursosDict[id]) {
                cursosDict[id] = { id, ...staticCursos[id] };
            }
        });

        // Mapear cursos inscritos del estudiante
        const cursosInscritos = (user.cursosInscritos || []).map(ci => {
            const infoCurso = cursosDict[ci.cursoId] || {
                id: ci.cursoId,
                titulo: ci.cursoId.toUpperCase(),
                descripcion: 'Curso de la plataforma',
                icono: '/img/html5.svg',
                duracion: '10 horas'
            };

            return {
                ...infoCurso,
                progreso: ci.progreso || 0,
                leccionesCompletadasCount: (ci.leccionesCompletadas || []).length,
                fechaInscripcion: ci.fechaInscripcion
            };
        });

        // Obtener proyectos prácticos de este estudiante
        const misProyectos = await StudentProject.find({ estudiante: user._id }).sort({ actualizadoEn: -1 });

        // Progreso promedio
        const progresoPromedio = cursosInscritos.length > 0
            ? Math.round(cursosInscritos.reduce((acc, c) => acc + (c.progreso || 0), 0) / cursosInscritos.length)
            : 0;

        res.render('panel', {
            titlePage: 'Mi Panel de Aprendizaje',
            user,
            cursosInscritos,
            misProyectos,
            totalCursos: cursosInscritos.length,
            progresoPromedio
        });

    } catch (err) {
        console.error('Error al cargar panel de estudiante:', err);
        res.status(500).send('Error interno del servidor al procesar el panel');
    }
};

/**
 * @route GET /configuracion
 * @description Renderiza la vista de configuración del perfil del usuario autenticado.
 */
exports.getConfiguracion = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.render('configuracion', {
            titlePage: 'Configuración',
            user
        });
    } catch (err) {
        console.error('Error al cargar configuración del usuario:', err);
        res.status(500).send('Error interno del servidor al procesar la configuración');
    }
};

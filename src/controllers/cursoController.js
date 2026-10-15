/**
 * @file cursoController.js
 * @description Controlador para gestionar el catálogo de cursos, inscripción de estudiantes,
 * Aula Virtual (Course Player con video, teoría y recursos) y el Espacio de Trabajo de Proyectos Prácticos.
 */

const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const StudentProject = require('../models/StudentProject');
const staticCursos = require('../models/cursosData');

/**
 * @route GET /temas
 * @description Renderiza el catálogo completo de cursos activos en la plataforma.
 */
exports.getTemas = async (req, res) => {
    try {
        let cursos = await Course.find({ publicado: true }).sort({ creadoEn: -1 });

        // Si la base de datos no tiene cursos aún, recurrir a los estáticos
        if (!cursos || cursos.length === 0) {
            cursos = Object.values(staticCursos);
        }

        // Obtener IDs de cursos en los que el usuario ya está inscrito (si está logueado)
        let inscritosIds = [];
        if (req.user) {
            const user = await User.findById(req.user.id).select('cursosInscritos');
            if (user && user.cursosInscritos) {
                inscritosIds = user.cursosInscritos.map(c => c.cursoId);
            }
        }

        res.render('temas', {
            datosTemas: {
                titulo: 'Nuestros Cursos',
                descripcion: 'Explora nuestra amplia variedad de cursos prácticos y certificados',
                cursos: cursos,
                inscritosIds: inscritosIds
            }
        });
    } catch (err) {
        console.error('Error al obtener catálogo de cursos:', err);
        res.status(500).render('error', {
            mensaje: 'Error del servidor',
            descripcion: 'No se pudieron cargar los cursos en este momento.'
        });
    }
};

/**
 * @route GET /curso/:id
 * @description Muestra la página de presentación detallada de un curso (temario, requisitos, botón de inscripción).
 */
exports.getCurso = async (req, res) => {
    const { id } = req.params;

    try {
        let curso = await Course.findOne({ id });

        // Si no está en BD, buscar en estáticos
        if (!curso && staticCursos[id]) {
            curso = { id, ...staticCursos[id], modulos: [], recursosGlobales: [] };
        }

        if (!curso) {
            return res.status(404).render('error', {
                mensaje: 'Curso no encontrado',
                descripcion: 'El curso que buscas no existe o ha sido retirado.'
            });
        }

        // Cursos relacionados de la misma categoría
        const cursosRelacionados = await Course.find({
            categoria: curso.categoria,
            id: { $ne: id }
        }).limit(3);

        // Verificar si el usuario actual está inscrito
        let estaInscrito = false;
        let progresoInscripcion = 0;

        if (req.user) {
            const user = await User.findById(req.user.id);
            if (user && user.cursosInscritos) {
                const ins = user.cursosInscritos.find(c => c.cursoId === id);
                if (ins) {
                    estaInscrito = true;
                    progresoInscripcion = ins.progreso || 0;
                }
            }
        }

        res.render('curso', {
            datosCurso: {
                ...curso.toObject ? curso.toObject() : curso,
                cursos_relacionados: cursosRelacionados,
                estaInscrito,
                progresoInscripcion
            }
        });
    } catch (err) {
        console.error('Error al obtener curso:', err);
        res.status(500).render('error', {
            mensaje: 'Error al cargar el curso',
            descripcion: 'Ocurrió un error inesperado al consultar los datos del curso.'
        });
    }
};

/**
 * @route POST /curso/:id/inscribir
 * @description Inscribe al estudiante autenticado en el curso y desbloquea el Aula Virtual.
 */
exports.postInscribir = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Debes iniciar sesión para inscribirte a un curso.');
        return res.redirect(`/login`);
    }

    const { id } = req.params;

    try {
        const curso = await Course.findOne({ id });
        if (!curso) {
            req.flash('error_msg', 'El curso seleccionado no existe.');
            return res.redirect('/temas');
        }

        const user = await User.findById(req.user.id);
        const yaInscrito = user.cursosInscritos.some(c => c.cursoId === id);

        if (!yaInscrito) {
            // Agregar al perfil del usuario
            user.cursosInscritos.push({
                cursoId: id,
                fechaInscripcion: new Date(),
                leccionesCompletadas: [],
                progreso: 0
            });
            await user.save();

            // Crear o sincronizar en el modelo Enrollment
            await Enrollment.findOneAndUpdate(
                { estudiante: user._id, cursoId: id },
                {
                    estudiante: user._id,
                    curso: curso._id,
                    cursoId: id,
                    fechaInscripcion: new Date(),
                    progreso: 0
                },
                { upsert: true, new: true }
            );

            // Inicializar el espacio del proyecto práctico del estudiante para este curso
            const proyectoExistente = await StudentProject.findOne({ estudiante: user._id, cursoId: id });
            if (!proyectoExistente) {
                await StudentProject.create({
                    estudiante: user._id,
                    estudianteNombre: user.nombre,
                    estudianteEmail: user.email,
                    cursoId: id,
                    cursoTitulo: curso.titulo,
                    titulo: `Proyecto: ${curso.proyectoConsigna?.titulo || curso.titulo}`,
                    descripcion: '',
                    notasAvance: '',
                    estado: 'En Progreso'
                });
            }

            req.flash('success_msg', `¡Felicitaciones! Te has inscrito exitosamente en "${curso.titulo}".`);
        } else {
            req.flash('success_msg', `Ya estás inscrito en "${curso.titulo}". ¡Continuemos aprendiendo!`);
        }

        // Redirigir directamente al Aula Virtual
        return res.redirect(`/curso/${id}/aula`);

    } catch (err) {
        console.error('Error al procesar inscripción:', err);
        req.flash('error_msg', 'Ocurrió un error al procesar tu matrícula.');
        res.redirect(`/curso/${id}`);
    }
};

/**
 * @route GET /curso/:id/aula
 * @route GET /curso/:id/aula/:leccionId
 * @description Vista del Aula Virtual (Course Player): Reproductor de Video, Explicación teórica,
 * recursos descargables, navegación de lecciones y espacio de proyecto práctico.
 */
exports.getAulaVirtual = async (req, res) => {
    const { id, leccionId } = req.params;

    try {
        const curso = await Course.findOne({ id });
        if (!curso) {
            req.flash('error_msg', 'Curso no encontrado.');
            return res.redirect('/temas');
        }

        const user = await User.findById(req.user.id);
        let inscripcion = user.cursosInscritos.find(c => c.cursoId === id);

        // Si por alguna razón no estuviera inscrito, auto-inscribirlo
        if (!inscripcion) {
            user.cursosInscritos.push({
                cursoId: id,
                fechaInscripcion: new Date(),
                leccionesCompletadas: [],
                progreso: 0
            });
            await user.save();
            inscripcion = user.cursosInscritos.find(c => c.cursoId === id);
        }

        // Aplanar todas las lecciones de todos los módulos para navegación secuencial
        const todasLasLecciones = [];
        if (curso.modulos && curso.modulos.length > 0) {
            curso.modulos.forEach(modulo => {
                if (modulo.lecciones && modulo.lecciones.length > 0) {
                    modulo.lecciones.forEach(lec => {
                        todasLasLecciones.push({
                            ...lec.toObject ? lec.toObject() : lec,
                            moduloTitulo: modulo.titulo
                        });
                    });
                }
            });
        }

        // Determinar la lección activa
        let leccionActiva = null;
        if (leccionId) {
            leccionActiva = todasLasLecciones.find(l => l.id === leccionId);
        }
        if (!leccionActiva && todasLasLecciones.length > 0) {
            // Por defecto, la primera lección no completada, o la primera del curso
            const primeraIncompleta = todasLasLecciones.find(l => !inscripcion.leccionesCompletadas.includes(l.id));
            leccionActiva = primeraIncompleta || todasLasLecciones[0];
        }

        // Calcular índices de lección anterior y siguiente
        let leccionAnterior = null;
        let leccionSiguiente = null;
        if (leccionActiva) {
            const index = todasLasLecciones.findIndex(l => l.id === leccionActiva.id);
            if (index > 0) leccionAnterior = todasLasLecciones[index - 1];
            if (index < todasLasLecciones.length - 1) leccionSiguiente = todasLasLecciones[index + 1];
        }

        // Obtener el proyecto práctico del estudiante para este curso
        let proyecto = await StudentProject.findOne({ estudiante: user._id, cursoId: id });
        if (!proyecto) {
            proyecto = await StudentProject.create({
                estudiante: user._id,
                estudianteNombre: user.nombre,
                estudianteEmail: user.email,
                cursoId: id,
                cursoTitulo: curso.titulo,
                titulo: `Proyecto: ${curso.proyectoConsigna?.titulo || curso.titulo}`,
                descripcion: '',
                notasAvance: '',
                estado: 'En Progreso'
            });
        }

        // Calcular porcentaje real de progreso
        const totalLecciones = todasLasLecciones.length;
        const leccionesCompletadasCount = inscripcion.leccionesCompletadas.length;
        const porcentajeProgreso = totalLecciones > 0 
            ? Math.round((leccionesCompletadasCount / totalLecciones) * 100)
            : 0;

        res.render('aula', {
            titlePage: `Aula Virtual - ${curso.titulo}`,
            curso,
            todasLasLecciones,
            leccionActiva,
            leccionAnterior,
            leccionSiguiente,
            leccionesCompletadas: inscripcion.leccionesCompletadas,
            porcentajeProgreso,
            proyecto
        });

    } catch (err) {
        console.error('Error al abrir Aula Virtual:', err);
        req.flash('error_msg', 'No se pudo abrir el aula virtual.');
        res.redirect('/panel');
    }
};

/**
 * @route POST /curso/:id/leccion/:leccionId/completar
 * @description Marca o desmarca una lección como completada y actualiza el progreso en BD.
 */
exports.postCompletarLeccion = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, msg: 'No autorizado' });
    }

    const { id, leccionId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        const curso = await Course.findOne({ id });

        let inscripcion = user.cursosInscritos.find(c => c.cursoId === id);
        if (!inscripcion) {
            user.cursosInscritos.push({
                cursoId: id,
                fechaInscripcion: new Date(),
                leccionesCompletadas: [],
                progreso: 0
            });
            inscripcion = user.cursosInscritos.find(c => c.cursoId === id);
        }

        const yaCompletada = inscripcion.leccionesCompletadas.includes(leccionId);
        if (yaCompletada) {
            // Desmarcar
            inscripcion.leccionesCompletadas = inscripcion.leccionesCompletadas.filter(lid => lid !== leccionId);
        } else {
            // Marcar completada
            inscripcion.leccionesCompletadas.push(leccionId);
        }

        // Calcular total de lecciones del curso
        let totalLecciones = 0;
        if (curso && curso.modulos) {
            curso.modulos.forEach(m => {
                if (m.lecciones) totalLecciones += m.lecciones.length;
            });
        }
        if (totalLecciones === 0) totalLecciones = 1;

        const nuevoProgreso = Math.round((inscripcion.leccionesCompletadas.length / totalLecciones) * 100);
        inscripcion.progreso = Math.min(100, nuevoProgreso);

        await user.save();

        // Sincronizar en Enrollment
        await Enrollment.findOneAndUpdate(
            { estudiante: user._id, cursoId: id },
            {
                leccionesCompletadas: inscripcion.leccionesCompletadas,
                progreso: inscripcion.progreso,
                ultimoAcceso: new Date()
            }
        );

        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.json({
                success: true,
                completada: !yaCompletada,
                progreso: inscripcion.progreso,
                leccionesCompletadasCount: inscripcion.leccionesCompletadas.length
            });
        }

        req.flash('success_msg', yaCompletada ? 'Lección desmarcada.' : '¡Lección completada!');
        res.redirect(`/curso/${id}/aula/${leccionId}`);

    } catch (err) {
        console.error('Error al completar lección:', err);
        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.status(500).json({ success: false, msg: 'Error al actualizar progreso' });
        }
        res.redirect(`/curso/${id}/aula`);
    }
};

/**
 * @route POST /curso/:id/proyecto/guardar
 * @description Guarda el avance, notas y entregables del proyecto del estudiante para el curso.
 */
exports.postGuardarProyecto = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Debes iniciar sesión para guardar tu proyecto.');
        return res.redirect('/login');
    }

    const { id } = req.params;
    const { titulo, descripcion, notasAvance, repositorioUrl, despliegueUrl, estado } = req.body;

    try {
        const user = req.user;
        const curso = await Course.findOne({ id });

        const proyecto = await StudentProject.findOneAndUpdate(
            { estudiante: user._id, cursoId: id },
            {
                estudiante: user._id,
                estudianteNombre: user.nombre,
                estudianteEmail: user.email,
                cursoId: id,
                cursoTitulo: curso ? curso.titulo : id,
                titulo: titulo || 'Mi Proyecto Práctico',
                descripcion: descripcion || '',
                notasAvance: notasAvance || '',
                repositorioUrl: repositorioUrl || '',
                despliegueUrl: despliegueUrl || '',
                estado: estado || 'En Progreso',
                actualizadoEn: new Date()
            },
            { upsert: true, new: true }
        );

        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.json({
                success: true,
                msg: '¡Avance del proyecto guardado exitosamente!',
                proyecto
            });
        }

        req.flash('success_msg', '¡Tu avance y entregables del proyecto se han guardado exitosamente!');
        res.redirect(`/curso/${id}/aula#pills-proyecto`);

    } catch (err) {
        console.error('Error al guardar proyecto práctico:', err);
        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.status(500).json({ success: false, msg: 'Error al guardar avance' });
        }
        req.flash('error_msg', 'Error al guardar el proyecto.');
        res.redirect(`/curso/${id}/aula`);
    }
};

/**
 * @route POST /api/progreso/completar
 * @description Compatibilidad hacia atrás con endpoints anteriores
 */
exports.postCompletarProgreso = exports.postCompletarLeccion;

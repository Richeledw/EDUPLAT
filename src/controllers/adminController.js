/**
 * @file adminController.js
 * @description Controlador integral para el Panel de Administrador (Rol: admin).
 * Incluye gestión de usuarios (CRUD, activación, roles), gestión global de cursos (crear, editar, eliminar),
 * gestión de recursos y contenido (módulos, lecciones, archivos adjuntos) y revisión de proyectos prácticos.
 */

const User = require('../models/User');
const Course = require('../models/Course');
const StudentProject = require('../models/StudentProject');
const Enrollment = require('../models/Enrollment');

/**
 * @route GET /admin/dashboard
 * @description Métricas globales de la plataforma y resumen rápido.
 */
exports.getDashboard = async (req, res) => {
    try {
        const [totalEstudiantes, totalDocentes, totalAdmins, totalCursos, totalProyectos] = await Promise.all([
            User.countDocuments({ rol: 'estudiante' }),
            User.countDocuments({ rol: 'docente' }),
            User.countDocuments({ rol: 'admin' }),
            Course.countDocuments(),
            StudentProject.countDocuments()
        ]);

        const ultimosUsuarios = await User.find()
            .sort({ creadoEn: -1 })
            .limit(8)
            .select('nombre email rol activo creadoEn');

        const ultimosCursos = await Course.find()
            .sort({ creadoEn: -1 })
            .limit(6);

        res.render('admin/dashboard', {
            titlePage: 'Panel de Administrador',
            totalEstudiantes,
            totalDocentes,
            totalAdmins,
            totalCursos,
            totalProyectos,
            ultimosUsuarios,
            ultimosCursos
        });
    } catch (err) {
        console.error('Error en dashboard de admin:', err);
        res.status(500).send('Error interno del servidor');
    }
};

/* ==========================================================================
   1. GESTIÓN DE USUARIOS
   ========================================================================== */

/**
 * @route GET /admin/usuarios
 * @description Listado completo interactivo de todos los usuarios registrados.
 */
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().sort({ creadoEn: -1 }).select('nombre email rol activo creadoEn');
        res.render('admin/usuarios', {
            titlePage: 'Gestión de Usuarios',
            usuarios
        });
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).send('Error interno del servidor');
    }
};

/**
 * @route POST /admin/usuarios/:id/rol
 * @description Cambiar el rol de un usuario (estudiante/docente/admin).
 */
exports.cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;
        const rolesValidos = ['estudiante', 'docente', 'admin'];

        if (!rolesValidos.includes(rol)) {
            req.flash('error_msg', 'Rol especificado no válido');
            return res.redirect('/admin/usuarios');
        }

        await User.findByIdAndUpdate(id, { rol });
        req.flash('success_msg', 'Rol de usuario actualizado correctamente.');
        res.redirect('/admin/usuarios');
    } catch (err) {
        console.error('Error al cambiar rol:', err);
        req.flash('error_msg', 'Error al cambiar el rol.');
        res.redirect('/admin/usuarios');
    }
};

/**
 * @route POST /admin/usuarios/:id/editar
 * @description Editar los datos básicos (nombre, email) de un usuario.
 */
exports.editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        await User.findByIdAndUpdate(id, {
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            rol: rol || 'estudiante'
        });

        req.flash('success_msg', 'Datos del usuario actualizados exitosamente.');
        res.redirect('/admin/usuarios');
    } catch (err) {
        console.error('Error al editar usuario:', err);
        req.flash('error_msg', 'Error al actualizar usuario.');
        res.redirect('/admin/usuarios');
    }
};

/**
 * @route POST /admin/usuarios/:id/toggle-estado
 * @description Activa o desactiva la cuenta de un usuario.
 */
exports.toggleEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await User.findById(id);

        if (!usuario) {
            req.flash('error_msg', 'Usuario no encontrado.');
            return res.redirect('/admin/usuarios');
        }

        // Evitar que el admin se desactive a sí mismo
        if (req.user && req.user._id.toString() === id) {
            req.flash('error_msg', 'No puedes desactivar tu propia cuenta administradora.');
            return res.redirect('/admin/usuarios');
        }

        usuario.activo = !usuario.activo;
        await usuario.save();

        req.flash('success_msg', `Cuenta de ${usuario.nombre} ${usuario.activo ? 'activada' : 'desactivada'} correctamente.`);
        res.redirect('/admin/usuarios');
    } catch (err) {
        console.error('Error al alternar estado de usuario:', err);
        req.flash('error_msg', 'Error al modificar el estado de la cuenta.');
        res.redirect('/admin/usuarios');
    }
};

/**
 * @route POST /admin/usuarios/:id/eliminar
 * @description Elimina permanentemente a un usuario.
 */
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user && req.user._id.toString() === id) {
            req.flash('error_msg', 'No puedes eliminar tu propia cuenta de administrador.');
            return res.redirect('/admin/usuarios');
        }

        await User.findByIdAndDelete(id);
        await Enrollment.deleteMany({ estudiante: id });
        await StudentProject.deleteMany({ estudiante: id });

        req.flash('success_msg', 'Usuario y sus registros asociados eliminados.');
        res.redirect('/admin/usuarios');
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        req.flash('error_msg', 'Error al eliminar usuario.');
        res.redirect('/admin/usuarios');
    }
};

/* ==========================================================================
   2. GESTIÓN GLOBAL DE CURSOS
   ========================================================================== */

/**
 * @route GET /admin/cursos
 * @description Listado global de todos los cursos para administración CRUD.
 */
exports.getCursos = async (req, res) => {
    try {
        const cursos = await Course.find().sort({ creadoEn: -1 });
        const docentes = await User.find({ rol: { $in: ['docente', 'admin'] } }).select('nombre email');

        res.render('admin/cursos', {
            titlePage: 'Gestión Global de Cursos',
            cursos,
            docentes
        });
    } catch (err) {
        console.error('Error al cargar cursos en admin:', err);
        res.status(500).send('Error interno del servidor');
    }
};

/**
 * @route POST /admin/cursos/crear
 * @description Crear un nuevo curso en la plataforma.
 */
exports.crearCurso = async (req, res) => {
    try {
        const { id, titulo, descripcion, descripcionLarga, categoria, nivel, duracion, icono, color, autorNombre, proyectoTitulo, proyectoDescripcion } = req.body;

        const cursoIdSlug = (id || titulo).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        const cursoExistente = await Course.findOne({ id: cursoIdSlug });
        if (cursoExistente) {
            req.flash('error_msg', `Ya existe un curso con el identificador "${cursoIdSlug}".`);
            return res.redirect('/admin/cursos');
        }

        await Course.create({
            id: cursoIdSlug,
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            descripcionLarga: descripcionLarga ? descripcionLarga.trim() : '',
            categoria: categoria || 'web',
            nivel: nivel || 'Beginner',
            duracion: duracion || '10 horas',
            icono: icono || '/img/html5.svg',
            color: color || 'primary',
            autor: req.user._id,
            autorNombre: autorNombre || req.user.nombre,
            publicado: true,
            proyectoConsigna: {
                titulo: proyectoTitulo || 'Proyecto Final Práctico',
                descripcion: proyectoDescripcion || 'Aplica los conocimientos adquiridos en este curso.',
                requisitos: ['Construcción de arquitectura funcional', 'Código limpio y comentado', 'Despliegue o repositorio accesible']
            },
            modulos: [
                {
                    titulo: 'Módulo 1: Introducción y Primeros Pasos',
                    descripcion: 'Fundamentos iniciales del curso.',
                    orden: 1,
                    lecciones: [
                        {
                            id: `${cursoIdSlug}-1`,
                            titulo: 'Bienvenida y Configuración del Entorno',
                            duracion: '15 min',
                            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                            explicacionDetallada: 'Bienvenido al curso. En esta lección configuraremos las herramientas necesarias.',
                            orden: 1
                        }
                    ]
                }
            ]
        });

        req.flash('success_msg', `¡Curso "${titulo}" creado exitosamente!`);
        res.redirect('/admin/cursos');
    } catch (err) {
        console.error('Error al crear curso:', err);
        req.flash('error_msg', 'Error al crear el curso: ' + err.message);
        res.redirect('/admin/cursos');
    }
};

/**
 * @route POST /admin/cursos/:id/editar
 * @description Editar información general de un curso.
 */
exports.editarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, descripcionLarga, categoria, nivel, duracion, icono, color, publicado, proyectoTitulo, proyectoDescripcion } = req.body;

        await Course.findOneAndUpdate(
            { id },
            {
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                descripcionLarga: descripcionLarga ? descripcionLarga.trim() : '',
                categoria: categoria || 'web',
                nivel: nivel || 'Beginner',
                duracion: duracion || '10 horas',
                icono: icono || '/img/html5.svg',
                color: color || 'primary',
                publicado: publicado === 'on' || publicado === true || publicado === 'true',
                'proyectoConsigna.titulo': proyectoTitulo || 'Proyecto Final Práctico',
                'proyectoConsigna.descripcion': proyectoDescripcion || ''
            }
        );

        req.flash('success_msg', 'Curso actualizado exitosamente.');
        res.redirect('/admin/cursos');
    } catch (err) {
        console.error('Error al editar curso:', err);
        req.flash('error_msg', 'Error al editar el curso.');
        res.redirect('/admin/cursos');
    }
};

/**
 * @route POST /admin/cursos/:id/eliminar
 * @description Eliminar o quitar un curso de la plataforma.
 */
exports.eliminarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        await Course.findOneAndDelete({ id });
        await Enrollment.deleteMany({ cursoId: id });

        req.flash('success_msg', `Curso "${id}" eliminado exitosamente de la plataforma.`);
        res.redirect('/admin/cursos');
    } catch (err) {
        console.error('Error al eliminar curso:', err);
        req.flash('error_msg', 'Error al eliminar el curso.');
        res.redirect('/admin/cursos');
    }
};

/* ==========================================================================
   3. GESTIÓN DE CONTENIDO Y RECURSOS DE UN CURSO
   ========================================================================== */

/**
 * @route GET /admin/cursos/:id/contenido
 * @description Constructor de contenido del curso: módulos, lecciones y recursos.
 */
exports.getContenidoCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Course.findOne({ id });

        if (!curso) {
            req.flash('error_msg', 'Curso no encontrado.');
            return res.redirect('/admin/cursos');
        }

        res.render('admin/contenido', {
            titlePage: `Gestionar Contenido: ${curso.titulo}`,
            curso
        });
    } catch (err) {
        console.error('Error al cargar contenido de curso:', err);
        res.status(500).send('Error interno del servidor');
    }
};

/**
 * @route POST /admin/cursos/:id/modulo/crear
 * @description Agregar un nuevo módulo al curso.
 */
exports.crearModulo = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;

        const curso = await Course.findOne({ id });
        if (!curso) {
            req.flash('error_msg', 'Curso no encontrado.');
            return res.redirect('/admin/cursos');
        }

        const orden = (curso.modulos ? curso.modulos.length : 0) + 1;
        curso.modulos.push({
            titulo: titulo.trim(),
            descripcion: descripcion ? descripcion.trim() : '',
            orden,
            lecciones: []
        });

        await curso.save();
        req.flash('success_msg', `Módulo "${titulo}" agregado.`);
        res.redirect(`/admin/cursos/${id}/contenido`);
    } catch (err) {
        console.error('Error al crear módulo:', err);
        req.flash('error_msg', 'Error al crear módulo.');
        res.redirect(`/admin/cursos/${req.params.id}/contenido`);
    }
};

/**
 * @route POST /admin/cursos/:id/modulo/:mIndex/leccion/crear
 * @description Agregar una lección a un módulo con URL de video, explicación y código.
 */
exports.crearLeccion = async (req, res) => {
    try {
        const { id, mIndex } = req.params;
        const { titulo, duracion, videoUrl, explicacionDetallada, codigoEjemplo, lenguajeCodigo } = req.body;

        const curso = await Course.findOne({ id });
        if (!curso || !curso.modulos[mIndex]) {
            req.flash('error_msg', 'Módulo o curso no encontrado.');
            return res.redirect(`/admin/cursos/${id}/contenido`);
        }

        const modulo = curso.modulos[mIndex];
        const leccionId = `${id}-${Date.now().toString().slice(-4)}`;

        modulo.lecciones.push({
            id: leccionId,
            titulo: titulo.trim(),
            duracion: duracion || '15 min',
            videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            explicacionDetallada: explicacionDetallada || '',
            codigoEjemplo: codigoEjemplo || '',
            lenguajeCodigo: lenguajeCodigo || 'javascript',
            recursos: [],
            orden: (modulo.lecciones ? modulo.lecciones.length : 0) + 1
        });

        await curso.save();
        req.flash('success_msg', `Lección "${titulo}" agregada exitosamente.`);
        res.redirect(`/admin/cursos/${id}/contenido`);
    } catch (err) {
        console.error('Error al crear lección:', err);
        req.flash('error_msg', 'Error al crear lección.');
        res.redirect(`/admin/cursos/${req.params.id}/contenido`);
    }
};

/**
 * @route POST /admin/cursos/:id/modulo/:mIndex/leccion/:lIndex/eliminar
 * @description Eliminar una lección de un módulo.
 */
exports.eliminarLeccion = async (req, res) => {
    try {
        const { id, mIndex, lIndex } = req.params;
        const curso = await Course.findOne({ id });

        if (curso && curso.modulos[mIndex] && curso.modulos[mIndex].lecciones[lIndex]) {
            curso.modulos[mIndex].lecciones.splice(lIndex, 1);
            await curso.save();
            req.flash('success_msg', 'Lección eliminada.');
        }

        res.redirect(`/admin/cursos/${id}/contenido`);
    } catch (err) {
        console.error('Error al eliminar lección:', err);
        res.redirect(`/admin/cursos/${req.params.id}/contenido`);
    }
};

/**
 * @route POST /admin/cursos/:id/recurso/crear
 * @description Agregar un recurso descargable o enlace (PDF, GitHub, Guía) al curso.
 */
exports.crearRecurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, tipo, url, descripcion } = req.body;

        const curso = await Course.findOne({ id });
        if (!curso) {
            req.flash('error_msg', 'Curso no encontrado.');
            return res.redirect('/admin/cursos');
        }

        curso.recursosGlobales.push({
            titulo: titulo.trim(),
            tipo: tipo || 'link',
            url: url.trim(),
            descripcion: descripcion ? descripcion.trim() : ''
        });

        await curso.save();
        req.flash('success_msg', 'Recurso adjuntado exitosamente.');
        res.redirect(`/admin/cursos/${id}/contenido`);
    } catch (err) {
        console.error('Error al agregar recurso:', err);
        req.flash('error_msg', 'Error al agregar recurso.');
        res.redirect(`/admin/cursos/${req.params.id}/contenido`);
    }
};

/**
 * @route POST /admin/cursos/:id/recurso/:rId/eliminar
 * @description Eliminar un recurso del curso.
 */
exports.eliminarRecurso = async (req, res) => {
    try {
        const { id, rId } = req.params;
        const curso = await Course.findOne({ id });

        if (curso) {
            curso.recursosGlobales = curso.recursosGlobales.filter(r => r._id.toString() !== rId);
            await curso.save();
            req.flash('success_msg', 'Recurso eliminado.');
        }

        res.redirect(`/admin/cursos/${id}/contenido`);
    } catch (err) {
        console.error('Error al eliminar recurso:', err);
        res.redirect(`/admin/cursos/${req.params.id}/contenido`);
    }
};

/* ==========================================================================
   4. REVISIÓN DE PROYECTOS PRÁCTICOS
   ========================================================================== */

/**
 * @route GET /admin/proyectos
 * @description Listado general de entregas de proyectos prácticos de estudiantes.
 */
exports.getProyectos = async (req, res) => {
    try {
        const proyectos = await StudentProject.find().sort({ actualizadoEn: -1 });
        const cursos = await Course.find().select('id titulo');

        res.render('admin/proyectos', {
            titlePage: 'Revisión de Proyectos Prácticos',
            proyectos,
            cursos
        });
    } catch (err) {
        console.error('Error al cargar proyectos en admin:', err);
        res.status(500).send('Error interno del servidor');
    }
};

/**
 * @route POST /admin/proyectos/:id/retroalimentar
 * @description Dejar retroalimentación, calificación y actualizar estado de un proyecto.
 */
exports.retroalimentarProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario, calificacion, estado } = req.body;

        const proyecto = await StudentProject.findById(id);
        if (!proyecto) {
            req.flash('error_msg', 'Proyecto no encontrado.');
            return res.redirect('/admin/proyectos');
        }

        if (comentario && comentario.trim().length > 0) {
            proyecto.retroalimentacion.push({
                docenteId: req.user._id,
                docenteNombre: req.user.nombre,
                docenteRol: 'admin',
                comentario: comentario.trim(),
                calificacion: calificacion ? Number(calificacion) : null,
                fecha: new Date()
            });
        }

        if (estado) {
            proyecto.estado = estado;
        }

        proyecto.actualizadoEn = new Date();
        await proyecto.save();

        req.flash('success_msg', `Retroalimentación guardada para el proyecto de ${proyecto.estudianteNombre}.`);
        res.redirect('/admin/proyectos');
    } catch (err) {
        console.error('Error al retroalimentar proyecto:', err);
        req.flash('error_msg', 'Error al guardar la retroalimentación.');
        res.redirect('/admin/proyectos');
    }
};

/**
 * @file cursosData.js
 * @description Base de datos simulada (datos estáticos) para los cursos de la plataforma.
 * Contiene información de contenidos, íconos, duraciones y niveles.
 */

const cursos = {
    'html': {
        id: 'html',
        titulo: 'HTML Básico',
        descripcion: 'Aprende los fundamentos de HTML y estructura web desde cero.',
        icono: '/img/html5.svg',
        categoria: 'web',
        nivel: 'Beginner',
        calificacion: 4.8,
        resenas: 245,
        duracion: '8 horas',
        lecciones: 24,
        color: 'danger'
    },
    'css': {
        id: 'css',
        titulo: 'CSS Esencial',
        descripcion: 'Domina el diseño y estilos web con CSS.',
        icono: '/img/css3-alt.svg',
        categoria: 'web',
        nivel: 'Beginner',
        calificacion: 4.9,
        resenas: 312,
        duracion: '10 horas',
        lecciones: 28,
        color: 'info'
    },
    'javascript': {
        id: 'javascript',
        titulo: 'JavaScript Introducción',
        descripcion: 'Introducción a la programación con JavaScript.',
        icono: '/img/js.svg',
        categoria: 'web',
        nivel: 'Beginner',
        calificacion: 4.7,
        resenas: 198,
        duracion: '12 horas',
        lecciones: 32,
        color: 'warning'
    },
    'python': {
        id: 'python',
        titulo: 'Python Fundamental',
        descripcion: 'Aprende Python desde cero.',
        icono: '/img/python.svg',
        categoria: 'backend',
        nivel: 'Beginner',
        calificacion: 4.9,
        resenas: 423,
        duracion: '14 horas',
        lecciones: 36,
        color: 'primary'
    },
    'sql': {
        id: 'sql',
        titulo: 'SQL Databases',
        descripcion: 'Domina las bases de datos SQL.',
        icono: '/img/mysql.svg',
        categoria: 'backend',
        nivel: 'Beginner',
        calificacion: 4.8,
        resenas: 201,
        duracion: '11 horas',
        lecciones: 30,
        color: 'danger'
    },
    'typescript': {
        id: 'typescript',
        titulo: 'TypeScript Mastery',
        descripcion: 'Tipado estricto y patrones avanzados.',
        icono: '/img/typescript.svg',
        categoria: 'web',
        nivel: 'Advanced',
        calificacion: 4.9,
        resenas: 89,
        duracion: '9 horas',
        lecciones: 26,
        color: 'secondary'
    }
};

module.exports = cursos;

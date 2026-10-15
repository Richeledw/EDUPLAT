/**
 * @file seedCourses.js
 * @description Sembrador automático de cursos iniciales con módulos, lecciones,
 * videos embebidos, explicaciones extendidas, recursos y consignas de proyecto.
 */

const Course = require('../models/Course');

const initialCourses = [
    {
        id: 'html',
        titulo: 'HTML5 Básico & Semántico',
        descripcion: 'Aprende los fundamentos de HTML5 y la arquitectura web desde cero.',
        descripcionLarga: 'HTML5 es la columna vertebral de la web moderna. En este curso aprenderás a estructurar contenido web de manera semántica, accesible y optimizada para motores de búsqueda, preparando tus páginas para aplicaciones complejas.',
        icono: '/img/html5.svg',
        categoria: 'web',
        nivel: 'Beginner',
        calificacion: 4.8,
        resenas: 245,
        duracion: '8 horas',
        color: 'danger',
        autorNombre: 'Ing. Carlos Mendoza (EduPlat)',
        proyectoConsigna: {
            titulo: 'Landing Page de Portafolio Profesional Semántico',
            descripcion: 'Diseña y estructura la página web principal de tu portafolio personal o de un producto tecnológico ficticio usando exclusivamente HTML5 semántico, accesibilidad (ARIA) y formularios validados.',
            requisitos: [
                'Uso correcto de etiquetas semánticas: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>',
                'Estructura de metadatos completa en el <head> (Open Graph, favicon, viewport)',
                'Formulario de contacto funcional con validación HTML5 (email, pattern, required)',
                'Tabla de precios o servicios con encabezados y estructura accesible',
                'Buenas prácticas de accesibilidad web (etiquetas alt, aria-label, roles)'
            ],
            recursosApoyo: [
                'Guía de etiquetas semánticas HTML5 (W3C)',
                'Plantilla base con boilerplate y directrices de accesibilidad',
                'Cheatsheet de atributos de formulario'
            ]
        },
        recursosGlobales: [
            { titulo: 'Guía Completa HTML5 en PDF', tipo: 'pdf', url: 'https://developer.mozilla.org/es/docs/Web/HTML', descripcion: 'Manual de referencia de Mozilla Developer Network (MDN)' },
            { titulo: 'Repositorio con Código Base en GitHub', tipo: 'github', url: 'https://github.com/mdn/learning-area', descripcion: 'Ejemplos de código y ejercicios prácticos listos para clonar' }
        ],
        modulos: [
            {
                titulo: 'Módulo 1: Introducción a la Web y Estructura Básica',
                descripcion: 'Comprende el modelo cliente-servidor y el esqueleto fundamental de un documento HTML.',
                orden: 1,
                lecciones: [
                    {
                        id: 'html-1',
                        titulo: '¿Cómo funciona la Web y Qué es HTML5?',
                        duracion: '12 min',
                        videoUrl: 'https://www.youtube.com/embed/kUm245hmJwo',
                        explicacionDetallada: `### Fundamentos de la Arquitectura Web
HTML (HyperText Markup Language) no es un lenguaje de programación, sino un lenguaje de marcado que define la estructura y el significado del contenido en la web.

#### Conceptos Clave:
1. **Etiquetas y Elementos:** Un elemento HTML consta de una etiqueta de apertura (\`<etiqueta>\`), el contenido y una etiqueta de cierre (\`</etiqueta>\`).
2. **Jerarquía del DOM:** El navegador interpreta el marcado como un árbol de objetos (Document Object Model).
3. **Semántica:** Usar la etiqueta adecuada para cada tipo de contenido mejora el SEO y la accesibilidad para lectores de pantalla.`,
                        codigoEjemplo: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Primera Página Web</title>
</head>
<body>
    <h1>¡Hola, Mundo desde EduPlat!</h1>
    <p>Este es el inicio de mi trayectoria como desarrollador web.</p>
</body>
</html>`,
                        lenguajeCodigo: 'html',
                        recursos: [
                            { titulo: 'Resumen de Sintaxis HTML5', tipo: 'pdf', url: 'https://html5doctor.com', descripcion: 'Guía rápida de sintaxis y elementos estructurales' },
                            { titulo: 'Validador Oficial del W3C', tipo: 'link', url: 'https://validator.w3.org/', descripcion: 'Herramienta para comprobar la validez de tu código HTML' }
                        ],
                        orden: 1
                    },
                    {
                        id: 'html-2',
                        titulo: 'Etiquetas Semánticas y Estructura Moderna',
                        duracion: '18 min',
                        videoUrl: 'https://www.youtube.com/embed/BvJYXl2ywuo',
                        explicacionDetallada: `### Por qué la Semántica Importa
Antes de HTML5, los desarrolladores usaban \`<div class="header">\`, \`<div class="menu">\`. Hoy en día, HTML5 introduce etiquetas específicas con significado semántico intrínseco.

#### Elementos Estructurales Principales:
- \`<header>\`: Contenedor para elementos introductorios o enlaces de navegación.
- \`<nav>\`: Bloque destinado a enlaces principales de navegación.
- \`<main>\`: Contenido principal y único del documento.
- \`<article>\`: Contenido independiente que tiene sentido por sí mismo (post, noticia).
- \`<section>\`: Sección temática genérica del documento.
- \`<footer>\`: Pie de página con créditos, copyright y enlaces legales.`,
                        codigoEjemplo: `<header>
    <nav>
        <a href="#inicio">Inicio</a>
        <a href="#proyectos">Proyectos</a>
        <a href="#contacto">Contacto</a>
    </nav>
</header>
<main>
    <section id="sobre-mi">
        <h2>Sobre mí</h2>
        <p>Desarrollador enfocado en frontend accesible.</p>
    </section>
</main>
<footer>
    <p>&copy; 2026 EduPlat. Todos los derechos reservados.</p>
</footer>`,
                        lenguajeCodigo: 'html',
                        recursos: [
                            { titulo: 'Diagrama Semántico HTML5 (CheatSheet)', tipo: 'link', url: 'https://htmlreference.io/', descripcion: 'Guía visual e interactiva de todos los elementos' }
                        ],
                        orden: 2
                    }
                ]
            },
            {
                titulo: 'Módulo 2: Formularios, Multimedia y Accesibilidad',
                descripcion: 'Aprende a capturar datos de usuarios con validaciones nativas y a incrustar contenido multimedia.',
                orden: 2,
                lecciones: [
                    {
                        id: 'html-3',
                        titulo: 'Formularios y Validaciones Nativas',
                        duracion: '22 min',
                        videoUrl: 'https://www.youtube.com/embed/fAwtb0j3n9I',
                        explicacionDetallada: `### Formularios Robustos y Seguros
Los formularios permiten la interacción bidireccional entre usuario y servidor.

#### Tipos de Input Modernos:
- \`type="email"\`: Valida sintaxis de correo electrónico.
- \`type="tel"\`: Optimizado para teclados telefónicos en móviles.
- \`type="number"\`: Permite definir límites \`min\` y \`max\`.
- Atributos clave: \`required\`, \`placeholder\`, \`pattern\` (Regex), \`autocomplete\`.`,
                        codigoEjemplo: `<form action="/contacto" method="POST">
    <div class="form-group">
        <label for="nombre">Nombre Completo:</label>
        <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre">
    </div>
    <div class="form-group">
        <label for="correo">Correo Electrónico:</label>
        <input type="email" id="correo" name="email" required placeholder="tucorreo@ejemplo.com">
    </div>
    <button type="submit">Enviar Mensaje</button>
</form>`,
                        lenguajeCodigo: 'html',
                        recursos: [
                            { titulo: 'Formularios Accesibles MDN', tipo: 'link', url: 'https://developer.mozilla.org/es/docs/Learn/Forms', descripcion: 'Guía paso a paso para formularios profesionales' }
                        ],
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 'css',
        titulo: 'CSS3 Esencial & Flexbox / Grid',
        descripcion: 'Domina el diseño, maquetación moderna y estilos web con CSS3.',
        descripcionLarga: 'Lleva tus páginas web al siguiente nivel visual aprendiendo la cascada, herencia, especificidad, y los dos sistemas de maquetación más potentes: Flexbox unidimensional y CSS Grid bidimensional.',
        icono: '/img/css3-alt.svg',
        categoria: 'web',
        nivel: 'Beginner',
        calificacion: 4.9,
        resenas: 312,
        duracion: '10 horas',
        color: 'info',
        autorNombre: 'Diseñadora Laura Soto (EduPlat)',
        proyectoConsigna: {
            titulo: 'Dashboard UI Responsive con Flexbox y CSS Grid',
            descripcion: 'Maqueta un panel de administración moderno con modo oscuro/claro mediante variables CSS, barra lateral colapsable, tarjetas métricas y grid interactivo.',
            requisitos: [
                'Uso de CSS Custom Properties (--variables)',
                'Maquetación del layout principal con CSS Grid',
                'Tarjetas de métricas y barra de navegación con Flexbox',
                'Efectos visuales modernos (glassmorphism, transiciones suaves, sombras sutiles)',
                '100% responsivo para pantallas móviles, tablets y monitores ultrawide'
            ],
            recursosApoyo: [
                'Paleta de colores HSL para dashboards',
                'Iconografía y assets listos para usar'
            ]
        },
        recursosGlobales: [
            { titulo: 'Guía Visual de Flexbox', tipo: 'pdf', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', descripcion: 'La referencia definitiva de propiedades Flexbox' },
            { titulo: 'Guía Completa de CSS Grid', tipo: 'link', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', descripcion: 'Todo sobre containers, items y áreas en Grid' }
        ],
        modulos: [
            {
                titulo: 'Módulo 1: Modelo de Caja y Selectores Modernos',
                descripcion: 'Comprende margin, padding, border y el cálculo de dimensiones en la web.',
                orden: 1,
                lecciones: [
                    {
                        id: 'css-1',
                        titulo: 'El Modelo de Caja (Box Model) y Box-Sizing',
                        duracion: '15 min',
                        videoUrl: 'https://www.youtube.com/embed/rIO5326FgPE',
                        explicacionDetallada: `### El Modelo de Caja en CSS
Todo elemento en una página web es una caja rectangular compuesta por:
1. **Content:** El texto o imagen interior.
2. **Padding:** Espacio interno entre el contenido y el borde.
3. **Border:** Línea que envuelve el padding y el contenido.
4. **Margin:** Espacio exterior que separa la caja de otros elementos.

#### La Regla de Oro:
Siempre inicia tus hojas de estilo con \`box-sizing: border-box\` para evitar que el padding y border alteren el ancho declarado.`,
                        codigoEjemplo: `* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.tarjeta {
    width: 320px;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}`,
                        lenguajeCodigo: 'css',
                        recursos: [
                            { titulo: 'Cheat Sheet de Modelo de Caja', tipo: 'pdf', url: 'https://developer.mozilla.org', descripcion: 'Resumen visual descargable' }
                        ],
                        orden: 1
                    }
                ]
            },
            {
                titulo: 'Módulo 2: Maquetación Avanzada con Flexbox y Grid',
                descripcion: 'Alinea elementos bidimensionalmente con facilidad sin floats ni posicionamiento hacky.',
                orden: 2,
                lecciones: [
                    {
                        id: 'css-2',
                        titulo: 'Dominando Flexbox: Dirección, Justificación y Alineación',
                        duracion: '20 min',
                        videoUrl: 'https://www.youtube.com/embed/u044iM9xsWU',
                        explicacionDetallada: `### Flexbox Unidimensional
Flexbox permite distribuir el espacio y alinear elementos a lo largo de un eje principal (\`main-axis\`) y un eje transversal (\`cross-axis\`).

#### Propiedades Clave:
- \`display: flex\`: Convierte al contenedor en flexible.
- \`justify-content\`: Alinea a lo largo del eje principal (\`center\`, \`space-between\`, \`flex-start\`).
- \`align-items\`: Alinea a lo largo del eje secundario.
- \`flex-wrap\`: Permite que los hijos pasen a la siguiente línea si no caben.`,
                        codigoEjemplo: `.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
}`,
                        lenguajeCodigo: 'css',
                        recursos: [
                            { titulo: 'Flexbox Froggy Juego Interactivo', tipo: 'link', url: 'https://flexboxfroggy.com/#es', descripcion: 'Práctica interactiva para afianzar Flexbox jugando' }
                        ],
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 'javascript',
        titulo: 'JavaScript Moderno (ES6+)',
        descripcion: 'Aprende desde los fundamentos hasta manipulación del DOM, APIs y lógica avanzada.',
        descripcionLarga: 'JavaScript es el motor de interactividad de la web. Domina variables modernas, desestructuración, async/await, promesas y consumo de APIs REST para construir aplicaciones vivas y dinámicas.',
        icono: '/img/js.svg',
        categoria: 'web',
        nivel: 'Beginner',
        calificacion: 4.7,
        resenas: 198,
        duracion: '12 horas',
        color: 'warning',
        autorNombre: 'Prof. Marcos Valenzuela (EduPlat)',
        proyectoConsigna: {
            titulo: 'Aplicación Web Interactiva de Gestión de Tareas con API y Persistencia',
            descripcion: 'Crea una aplicación SPA de Productividad que consuma una API externa, gestione estado local mediante localStorage y permita crear, filtrar, editar y eliminar tareas con animaciones.',
            requisitos: [
                'Uso de módulos ES6 y funciones flecha',
                'Persistencia en localStorage para que no se pierdan datos al recargar',
                'Consumo de datos con Fetch API y async/await',
                'Manipulación dinámica del DOM con event delegation',
                'Manejo de errores con bloques try/catch y alertas visuales'
            ],
            recursosApoyo: [
                'API pública de prueba (JSONPlaceholder)',
                'Guía de buenas prácticas y clean code en JavaScript'
            ]
        },
        recursosGlobales: [
            { titulo: 'JavaScript Info - El Tutorial Moderno', tipo: 'link', url: 'https://es.javascript.info/', descripcion: 'La documentación más completa y didáctica de JS en español' }
        ],
        modulos: [
            {
                titulo: 'Módulo 1: Fundamentos de ES6+ y Flujo de Control',
                descripcion: 'Variables, constantes, tipos de datos primitivos y estructuras de datos.',
                orden: 1,
                lecciones: [
                    {
                        id: 'js-1',
                        titulo: 'Variables (let, const), Arrow Functions y Destructuring',
                        duracion: '25 min',
                        videoUrl: 'https://www.youtube.com/embed/Q9fwkuyAKnY',
                        explicacionDetallada: `### JavaScript Moderno ES6+
Atrás quedaron los días de \`var\` y el scope de función confuso. Con ES6+ contamos con herramientas seguras, legibles y concisas.

#### Novedades Esenciales:
1. **let y const:** Tienen ámbito de bloque (\`{ ... }\`). \`const\` previene la reasignación de identificadores.
2. **Template Literals:** Interpolación elegante con comillas invertidas (\`\` \${variable} \`\`).
3. **Desestructuración:** Extraer propiedades de objetos o elementos de arreglos directamente.`,
                        codigoEjemplo: `const usuario = {
    nombre: 'Ana García',
    rol: 'estudiante',
    cursos: ['HTML5', 'CSS3', 'JavaScript']
};

// Desestructuración
const { nombre, rol, cursos } = usuario;
console.log(\`Bienvenida \${nombre}, tu rol activo es \${rol}.\`);

// Arrow function con métodos de arreglo
const cursosEnMayuscula = cursos.map(curso => curso.toUpperCase());
console.log(cursosEnMayuscula);`,
                        lenguajeCodigo: 'javascript',
                        recursos: [
                            { titulo: 'Cheat Sheet ES6+ en PDF', tipo: 'pdf', url: 'https://es6cheatsheet.com/', descripcion: 'Resumen descargable de sintaxis moderna' }
                        ],
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 'python',
        titulo: 'Python Fundamental & Backend',
        descripcion: 'Aprende programación estructurada, POO y lógica con el lenguaje más popular.',
        descripcionLarga: 'Python destaca por su sintaxis clara y su inmenso ecosistema: desde desarrollo web backend hasta ciencia de datos e inteligencia artificial.',
        icono: '/img/python.svg',
        categoria: 'backend',
        nivel: 'Beginner',
        calificacion: 4.9,
        resenas: 423,
        duracion: '14 horas',
        color: 'primary',
        autorNombre: 'Dr. Roberto Guzmán (EduPlat)',
        proyectoConsigna: {
            titulo: 'Sistema Backend de Gestión y Procesamiento de Datos',
            descripcion: 'Construye un sistema modular en Python que procese registros, aplique Programación Orientada a Objetos y gestione archivos estructurados (JSON/CSV).',
            requisitos: [
                'Modelado de clases y herencia en POO',
                'Manejo de excepciones robusto',
                'Lectura y escritura de archivos JSON persistentes'
            ],
            recursosApoyo: [
                'Guía de estilo PEP 8',
                'Set de datos de prueba'
            ]
        },
        recursosGlobales: [
            { titulo: 'Documentación Oficial de Python 3', tipo: 'link', url: 'https://docs.python.org/es/3/', descripcion: 'Manual oficial en español' }
        ],
        modulos: [
            {
                titulo: 'Módulo 1: Fundamentos y Estructuras de Datos',
                descripcion: 'Listas, tuplas, diccionarios y funciones puras.',
                orden: 1,
                lecciones: [
                    {
                        id: 'py-1',
                        titulo: 'Introducción a Python y Estructuras Nativas',
                        duracion: '20 min',
                        videoUrl: 'https://www.youtube.com/embed/chPhlsHoEPo',
                        explicacionDetallada: `### Filosofía de Python
"Bello es mejor que feo. Explícito es mejor que implícito. Simple es mejor que complejo." - El Zen de Python.

#### Estructuras de Datos Nativas:
- **Listas (\`[]\`):** Mutables, ordenadas.
- **Diccionarios (\`{}\`):** Pares clave-valor ultrarrápidos para búsquedas.
- **Sets (\`set()\`)**: Colecciones de valores únicos.`,
                        codigoEjemplo: `def calcular_promedio(calificaciones):
    if not calificaciones:
        return 0
    return sum(calificaciones) / len(calificaciones)

estudiante = {
    "nombre": "Sofia",
    "calificaciones": [95, 88, 92, 100]
}

promedio = calcular_promedio(estudiante["calificaciones"])
print(f"El promedio de {estudiante['nombre']} es {promedio:.2f}")`,
                        lenguajeCodigo: 'python',
                        recursos: [
                            { titulo: 'Guía de Estilo PEP 8', tipo: 'link', url: 'https://pep8.org/', descripcion: 'Estándar oficial de formato de código Python' }
                        ],
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 'sql',
        titulo: 'SQL & Bases de Datos Relacionales',
        descripcion: 'Domina el diseño relacional, modelado y consultas complejas con SQL.',
        descripcionLarga: 'Los datos son el corazón de toda aplicación. Aprende diseño relacional, normalización, joins, agrupamientos y optimización de índices.',
        icono: '/img/mysql.svg',
        categoria: 'backend',
        nivel: 'Beginner',
        calificacion: 4.8,
        resenas: 201,
        duracion: '11 horas',
        color: 'danger',
        autorNombre: 'Ing. Elena Rivas (EduPlat)',
        proyectoConsigna: {
            titulo: 'Esquema y Consultas de una Plataforma de E-Learning',
            descripcion: 'Diseña el diagrama entidad-relación (ER) y redacta los scripts DDL/DML para una plataforma académica con usuarios, cursos, pagos y certificados.',
            requisitos: [
                'Diseño de esquema en 3FN (Tercera Forma Normal)',
                'Uso de Claves Foráneas con integridad referencial (CASCADE / SET NULL)',
                'Consultas complejas con INNER JOIN, LEFT JOIN y GROUP BY'
            ],
            recursosApoyo: [
                'Diagrama de ejemplo en formato SQL'
            ]
        },
        recursosGlobales: [
            { titulo: 'SQL Tutorial Interactivo', tipo: 'link', url: 'https://www.sqltutorial.org/', descripcion: 'Ejercicios interactivos paso a paso' }
        ],
        modulos: [
            {
                titulo: 'Módulo 1: Consultas Básicas y Relaciones',
                descripcion: 'SELECT, WHERE, JOINs y agrupaciones.',
                orden: 1,
                lecciones: [
                    {
                        id: 'sql-1',
                        titulo: 'Fundamentos de Consultas SQL y JOINs',
                        duracion: '18 min',
                        videoUrl: 'https://www.youtube.com/embed/DFg1V-rO6Pg',
                        explicacionDetallada: `### ¿Qué es una Base de Datos Relacional?
Las bases de datos relacionales organizan los datos en tablas compuestas por filas y columnas, vinculadas mediante claves primarias (\`PRIMARY KEY\`) y foráneas (\`FOREIGN KEY\`).

#### Tipos de JOIN:
- **INNER JOIN:** Devuelve únicamente las filas con coincidencia en ambas tablas.
- **LEFT JOIN:** Devuelve todas las filas de la tabla izquierda y las coincidencias de la derecha.`,
                        codigoEjemplo: `SELECT 
    u.nombre AS estudiante,
    c.titulo AS curso,
    i.progreso
FROM inscripciones i
INNER JOIN usuarios u ON i.usuario_id = u.id
INNER JOIN cursos c ON i.curso_id = c.id
WHERE i.progreso > 50
ORDER BY i.progreso DESC;`,
                        lenguajeCodigo: 'sql',
                        recursos: [
                            { titulo: 'Hoja de Referencia SQL', tipo: 'pdf', url: 'https://learnsql.com/blog/sql-basics-cheat-sheet/', descripcion: 'Cheat sheet de comandos más usados' }
                        ],
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 'typescript',
        titulo: 'TypeScript Mastery & Arquitectura',
        descripcion: 'Tipado estricto, interfaces, genéricos y patrones de diseño modernos.',
        descripcionLarga: 'Construye software a escala empresarial previniendo bugs en tiempo de desarrollo gracias al sistema de tipos estático más potente del ecosistema JavaScript.',
        icono: '/img/typescript.svg',
        categoria: 'web',
        nivel: 'Advanced',
        calificacion: 4.9,
        resenas: 89,
        duracion: '9 horas',
        color: 'secondary',
        autorNombre: 'Arq. David Torres (EduPlat)',
        proyectoConsigna: {
            titulo: 'Biblioteca de Tipos y SDK Tipado para una API REST',
            descripcion: 'Desarrolla un cliente HTTP tipado con TypeScript que implemente Generics, Utility Types y validación en tiempo de compilación.',
            requisitos: [
                'Uso de interfaces, types y genéricos (<T>)',
                'Uso de Utility Types: Partial, Pick, Omit, Readonly',
                'Configuración estricta en tsconfig.json'
            ],
            recursosApoyo: [
                'Handbook oficial de TypeScript'
            ]
        },
        recursosGlobales: [
            { titulo: 'TypeScript Handbook Oficial', tipo: 'link', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', descripcion: 'Guía oficial de TypeScript' }
        ],
        modulos: [
            {
                titulo: 'Módulo 1: Tipado Estricto y Genéricos',
                descripcion: 'Interfaces avanzadas, tipos condicionales y genéricos.',
                orden: 1,
                lecciones: [
                    {
                        id: 'ts-1',
                        titulo: 'Generics e Interfaces en TypeScript',
                        duracion: '24 min',
                        videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs',
                        explicacionDetallada: `### La Potencia de los Genéricos (<T>)
Los genéricos permiten escribir componentes y funciones reutilizables que funcionan sobre una variedad de tipos en lugar de uno solo, manteniendo la seguridad de tipos total.`,
                        codigoEjemplo: `interface ApiResponse<T> {
    data: T;
    status: number;
    mensaje: string;
}

interface Usuario {
    id: string;
    nombre: string;
    rol: 'estudiante' | 'docente' | 'admin';
}

function procesarRespuesta<T>(respuesta: ApiResponse<T>): T {
    if (respuesta.status >= 200 && respuesta.status < 300) {
        return respuesta.data;
    }
    throw new Error(respuesta.mensaje);
}`,
                        lenguajeCodigo: 'typescript',
                        recursos: [
                            { titulo: 'TypeScript Cheat Sheet', tipo: 'pdf', url: 'https://www.typescriptlang.org/cheatsheets', descripcion: 'Resumen gráfico oficial' }
                        ],
                        orden: 1
                    }
                ]
            }
        ]
    }
];

/**
 * @function seedCoursesIfNeeded
 * @description Inserta los cursos iniciales en MongoDB si la colección Course está vacía.
 */
async function seedCoursesIfNeeded() {
    try {
        const count = await Course.countDocuments();
        if (count === 0) {
            console.log('Sembrando cursos iniciales en MongoDB...');
            await Course.insertMany(initialCourses);
            console.log(`✓ Se sembraron ${initialCourses.length} cursos exitosamente en MongoDB.`);
        }
    } catch (error) {
        console.error('Error al sembrar cursos iniciales:', error.message);
    }
}

module.exports = { seedCoursesIfNeeded, initialCourses };

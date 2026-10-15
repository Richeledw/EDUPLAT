/**
 * @file indexController.js
 * @description Controlador para manejar las páginas estáticas y generales del sitio web (página de inicio y contacto).
 */

/**
 * @route GET /
 * @description Renderiza la página de inicio (home) con datos dinámicos descriptivos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getHome = (req, res) => {
    res.render('home', {
        datosHome: {
            titulo: 'Eduplat - Tu Plataforma de Aprendizaje',
            subtitulo: 'Aprende nuevas habilidades con cursos de calidad'
        }
    });
};

/**
 * @route GET /contacto
 * @description Renderiza el formulario de contacto con la información institucional de soporte.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getContacto = (req, res) => {
    res.render('contacto', {
        datosContacto: {
            titulo: 'Contáctanos',
            descripcion: 'Nos gustaría saber de ti',
            email: 'info@eduplat.com',
            telefono: '+54 9 1234567890',
            ubicacion: 'Buenos Aires, Argentina'
        }
    });
};

/**
 * @route POST /contacto
 * @description Procesa el envío del formulario de contacto y muestra un mensaje de éxito.
 * @param {object} req - Objeto de solicitud de Express conteniendo el cuerpo del mensaje.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.postContacto = (req, res) => {
    // Aquí iría la lógica de negocio para almacenar el mensaje o enviar un email de soporte.
    // De momento, renderiza de nuevo la página confirmando al usuario la recepción de su mensaje.
    res.render('contacto', {
        datosContacto: {
            titulo: 'Contáctanos',
            descripcion: 'Nos gustaría saber de ti',
            email: 'info@eduplat.com',
            telefono: '+54 9 1234567890',
            ubicacion: 'Buenos Aires, Argentina'
        },
        mensaje_exito: '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.'
    });
};

/**
 * @file email.js
 * @description Utilidad de envío de correos electrónicos utilizando Nodemailer.
 * Se encarga de enviar correos informativos como el de bienvenida al registrarse.
 */

const nodemailer = require('nodemailer');

/**
 * @function sendEmail
 * @async
 * @description Crea una conexión con el servidor SMTP y envía un correo electrónico.
 * @param {object} options - Opciones de envío.
 * @param {string} options.email - Destinatario del correo.
 * @param {string} options.subject - Asunto del correo.
 * @param {string} options.message - Mensaje en formato texto plano.
 * @param {string} options.html - Mensaje en formato HTML para mejor diseño visual.
 */
const sendEmail = async (options) => {
    try {
        // Configuramos el transporte SMTP para enviar los correos electrónicos.
        // Utiliza variables de entorno o cae de vuelta a la configuración de Ethereal SMTP.
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true para puerto 465, false para otros como 587 o 25
            auth: {
                user: process.env.SMTP_EMAIL || 'user',
                pass: process.env.SMTP_PASSWORD || 'pass'
            }
        });

        // Especificamos el contenido y los metadatos del correo electrónico
        const info = await transporter.sendMail({
            from: `"Eduplat Team" <${process.env.SMTP_FROM_EMAIL || 'noreply@eduplat.com'}>`, // Remitente
            to: options.email,                                                               // Destinatario
            subject: options.subject,                                                         // Asunto
            text: options.message,                                                            // Cuerpo de texto plano
            html: options.html                                                                // Cuerpo en formato HTML
        });

        console.log("Mensaje enviado exitosamente. ID del mensaje: %s", info.messageId);
    } catch (error) {
        console.error("Error al intentar enviar el email: ", error);
    }
};

// Exportamos la función de envío de correos
module.exports = sendEmail;

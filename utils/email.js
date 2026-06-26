const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Crear objeto transporter reutilizable usando SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true para 465, false para otros puertos
            auth: {
                user: process.env.SMTP_EMAIL || 'user',
                pass: process.env.SMTP_PASSWORD || 'pass'
            }
        });

        // Definir el email
        const info = await transporter.sendMail({
            from: `"Eduplat Team" <${process.env.SMTP_FROM_EMAIL || 'noreply@eduplat.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message, // cuerpo en texto plano
            html: options.html // cuerpo en html
        });

        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error enviando email: ", error);
    }
};

module.exports = sendEmail;

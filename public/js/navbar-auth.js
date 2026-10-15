/**
 * @file navbar-auth.js
 * @description Gestión de persistencia de sesión en localStorage y actualización dinámica del Navbar.
 * Si el usuario tiene sesión activa, oculta por completo 'Iniciar Sesión' y 'Registrarse',
 * muestra su avatar y nombre, enlace directo a su panel según rol, y botón de cerrar sesión.
 */

(function () {
    // 1. Obtener usuario inyectado desde el servidor si existe en window.EDUPLAT_USER
    if (window.EDUPLAT_USER && window.EDUPLAT_USER.id) {
        localStorage.setItem('eduplat_user', JSON.stringify({
            id: window.EDUPLAT_USER.id,
            nombre: window.EDUPLAT_USER.nombre,
            email: window.EDUPLAT_USER.email,
            rol: window.EDUPLAT_USER.rol
        }));
    } else if (window.EDUPLAT_USER === null) {
        // El servidor explícitamente indica que no hay sesión activa (ej. tras logout)
        localStorage.removeItem('eduplat_user');
    }

    // 2. Leer estado guardado en localStorage
    let storedUser = null;
    try {
        const raw = localStorage.getItem('eduplat_user');
        if (raw) storedUser = JSON.parse(raw);
    } catch (e) {
        console.error('Error leyendo sesión de localStorage:', e);
    }

    // 3. Manejador de evento al cargar el DOM para ajustar la UI
    document.addEventListener('DOMContentLoaded', () => {
        const user = window.EDUPLAT_USER || storedUser;

        // Si hay usuario autenticado
        if (user && user.nombre) {
            // Ocultar botones de autenticación (login, registro)
            const authGuestElements = document.querySelectorAll('.nav-auth-guest, .btn-auth-guest, [data-auth="guest"]');
            authGuestElements.forEach(el => {
                el.style.display = 'none';
                el.classList.add('d-none');
            });

            // Mostrar elementos de usuario logueado
            const authUserElements = document.querySelectorAll('.nav-auth-user, [data-auth="user"]');
            authUserElements.forEach(el => {
                el.style.display = '';
                el.classList.remove('d-none');
            });

            // Determinar ruta del panel según rol
            let panelUrl = '/panel';
            let panelLabel = 'Mi Panel (Estudiante)';
            let rolBadgeClass = 'badge-primary';

            if (user.rol === 'admin') {
                panelUrl = '/admin/dashboard';
                panelLabel = 'Panel Admin';
                rolBadgeClass = 'badge-purple';
            } else if (user.rol === 'docente' || user.rol === 'teacher') {
                panelUrl = '/docente/dashboard';
                panelLabel = 'Panel Docente';
                rolBadgeClass = 'badge-success';
            }

            // Actualizar enlaces directos al panel
            document.querySelectorAll('.link-mi-panel').forEach(link => {
                link.setAttribute('href', panelUrl);
            });

            // Actualizar nombre de usuario si existe placeholder
            document.querySelectorAll('.user-display-name').forEach(nameSpan => {
                nameSpan.textContent = user.nombre;
            });
        }

        // Listener para botones de cerrar sesión
        document.querySelectorAll('a[href="/logout"], .btn-logout').forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.removeItem('eduplat_user');
                sessionStorage.clear();
            });
        });
    });
})();

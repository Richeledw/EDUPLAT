// script.js

// ===== MENÚ HAMBURGUESA RESPONSIVE =====
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        // Toggle del menú al hacer clic en el botón hamburguesa
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });
        
        // Cerrar el menú cuando se hace clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.add('hidden');
            });
        });
        
        // Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', (event) => {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.add('hidden');
            }
        });
    }
});

// ===== FILTRADO Y BÚSQUEDA DE CURSOS =====
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const levelFilter = document.getElementById('level-filter');
    const clearButton = document.getElementById('clear-filters');
    const topicsGrid = document.getElementById('topics-grid');
    const resultsCount = document.getElementById('results-count');

    if (searchInput && categoryFilter && levelFilter && topicsGrid) {
        // Función para filtrar cursos
        function filterCourses() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;
            const selectedLevel = levelFilter.value;

            const courses = topicsGrid.querySelectorAll('.topic-card');
            let visibleCount = 0;

            courses.forEach(course => {
                const title = course.querySelector('h3').textContent.toLowerCase();
                const description = course.querySelector('p').textContent.toLowerCase();
                const courseCategory = course.getAttribute('data-category');
                const courseLevel = course.getAttribute('data-level');

                // Lógica de búsqueda
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = !selectedCategory || courseCategory === selectedCategory;
                const matchesLevel = !selectedLevel || courseLevel === selectedLevel;

                if (matchesSearch && matchesCategory && matchesLevel) {
                    course.style.display = '';
                    visibleCount++;
                } else {
                    course.style.display = 'none';
                }
            });

            // Actualizar contador
            if (visibleCount === 0) {
                resultsCount.textContent = 'No se encontraron cursos';
            } else if (visibleCount === 1) {
                resultsCount.textContent = `Mostrando 1 curso`;
            } else {
                resultsCount.textContent = `Mostrando ${visibleCount} cursos`;
            }

            // Mostrar mensaje si no hay resultados
            if (visibleCount === 0) {
                if (!document.getElementById('no-results')) {
                    const noResults = document.createElement('div');
                    noResults.id = 'no-results';
                    noResults.className = 'col-span-full text-center py-12';
                    noResults.innerHTML = `
                        <p class="text-gray-600 text-lg mb-4">No se encontraron cursos con esos criterios.</p>
                        <button id="reset-search" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Limpiar búsqueda
                        </button>
                    `;
                    topicsGrid.appendChild(noResults);
                    document.getElementById('reset-search').addEventListener('click', () => {
                        searchInput.value = '';
                        categoryFilter.value = '';
                        levelFilter.value = '';
                        filterCourses();
                    });
                }
            } else {
                const noResults = document.getElementById('no-results');
                if (noResults) noResults.remove();
            }
        }

        // Event listeners
        searchInput.addEventListener('input', filterCourses);
        categoryFilter.addEventListener('change', filterCourses);
        levelFilter.addEventListener('change', filterCourses);

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            categoryFilter.value = '';
            levelFilter.value = '';
            filterCourses();
        });
    }
});

// -----

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the necessary DOM elements
    const topicsGrid = document.getElementById('topics-grid');
    const topicContentArea = document.getElementById('topic-content-area');
    const topicTitle = document.getElementById('topic-title');
    const topicDetails = document.getElementById('topic-details');
    const backButton = document.getElementById('back-to-topics');
    // Select main sections to hide/show them later
    const welcomeSection = document.querySelector('.welcome-section');
    const topicsSection = document.querySelector('.topics-section');
    // Reference to the container holding the content templates
    const contentTemplates = document.getElementById('content-templates');

    // Check if all essential elements were found (only relevant for temas.html)
    if (topicsGrid && topicContentArea && topicTitle && topicDetails && backButton && welcomeSection && topicsSection && contentTemplates) {

        // Event listener for clicks within the topics grid
        topicsGrid.addEventListener('click', (event) => {
            // Find the closest ancestor element that is a topic card
            const card = event.target.closest('.topic-card');

            if (card) {
                const topicId = card.getAttribute('data-topic');
                const cardTitle = card.querySelector('h3').textContent;
                const contentTemplate = document.getElementById(`${topicId}-content`);
                
                if (contentTemplate) {
                    // Update content area
                    topicTitle.textContent = cardTitle;
                    // Copy the inner HTML from the template to the display area
                    topicDetails.innerHTML = contentTemplate.innerHTML;

                    // Toggle visibility of sections
                    welcomeSection.style.display = 'none';
                    topicsSection.style.display = 'none';
                    topicContentArea.style.display = 'block';

                    // Scroll to the content area
                    topicContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

                } else {
                    // Handle cases where content for a topic is not found
                    console.warn(`Contenido no encontrado para el tema: ${topicId}`);
                    // Optionally display a message to the user
                    topicTitle.textContent = cardTitle;
                    topicDetails.innerHTML = '<p class="text-red-500">El contenido para este tema aún no está disponible.</p>';
                    welcomeSection.style.display = 'none';
                    topicsSection.style.display = 'none';
                    topicContentArea.style.display = 'block';
                    topicContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        // Event listener for the "Back to Topics" button
        backButton.addEventListener('click', () => {
            topicContentArea.style.display = 'none'; // Hide the content area
            topicDetails.innerHTML = ''; // Clear the specific topic content

            // Show the main sections again
            welcomeSection.style.display = 'block'; // Or 'flex'/'grid' if they used that
            topicsSection.style.display = 'block'; // Or 'flex'/'grid'

            // Optional: Scroll smoothly back to the topics section
            if (topicsSection) {
                topicsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    } 

    // ----------------------------------------------------------------------
    // NUEVA LÓGICA AÑADIDA PARA registro.html (VALIDACIÓN DE FORMULARIO)
    // ----------------------------------------------------------------------
    
    // Asignar el listener de envío al botón si estamos en registro.html
    const authButton = document.getElementById('auth-submit-button');
    if (authButton) {
        authButton.addEventListener('click', handleAuthSubmit);
    }
}); // End of DOMContentLoaded listener


/**
 * Muestra un mensaje de alerta (error o éxito) en el formulario de registro.
 * Se espera que el DOM contenga <div id="alert-message"> y <p id="alert-text">
 * @param {string} message El texto del mensaje.
 * @param {string} type El tipo de mensaje ('error' para rojo, 'success' para verde).
 */
function showAlert(message, type = 'error') {
    const alertMessage = document.getElementById('alert-message');
    const alertText = document.getElementById('alert-text');
    
    // Verificar que los elementos existen antes de manipularlos (solo si estamos en registro.html)
    if (!alertMessage || !alertText) {
        // En este punto, solo queremos evitar errores si la página no es registro.html
        return;
    }
    
    // Limpiar clases anteriores y dejar las clases base de transición
    alertMessage.className = 'mb-4 p-3 rounded-md transition duration-300';
    
    let classes = '';
    
    if (type === 'error') {
        // Estilos de alerta de error (rojo con Tailwind)
        classes = 'bg-red-100 border border-red-400 text-red-700';
    } else if (type === 'success') {
        // Estilos de alerta de éxito (verde con Tailwind)
        classes = 'bg-green-100 border border-green-400 text-green-700';
    }
    
    // Aplicar clases de estilo y mostrar el mensaje
    alertMessage.classList.add(...classes.split(' '));
    alertText.textContent = message;
    alertMessage.classList.remove('hidden');
}

/**
 * Maneja el envío del formulario de autenticación (registro/login), 
 * realiza validaciones y muestra alertas.
 */
function handleAuthSubmit() {
    // 1. Obtener valores
    const emailInput = document.getElementById('email-register');
    const passwordInput = document.getElementById('password-register');
    
    // Si los inputs no existen, salimos (no estamos en registro.html)
    if (!emailInput || !passwordInput) {
        return; 
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Ocultar mensaje anterior antes de la nueva validación
    const alertMessage = document.getElementById('alert-message');
    if (alertMessage) {
        alertMessage.classList.add('hidden');
    }

    // 2. Simulación de Validación Front-end
    
    // Validar formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showAlert('Por favor, introduce un correo electrónico válido.', 'error');
        emailInput.focus();
        return;
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres.', 'error');
        passwordInput.focus();
        return;
    }

    // 3. Simulación de Autenticación (simulación de Back-end)
    
    // Caso de error simulado: Credenciales no válidas
    if (email.toLowerCase() === 'error@test.com') {
        showAlert('Error de credenciales. El correo o la contraseña son incorrectos.', 'error');
        return;
    }
    
    // Caso de éxito simulado
    showAlert('¡Acceso Exitoso! Bienvenido a la plataforma.', 'success');
    
    // En una app real: Redirección
    // window.location.href = 'index.html'; 
}
// Sistema de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.loginForm');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('.btn-login');

    // Crear modal de notificación
    function crearModalNotificacion() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div id="modal-notificacion" style="
                display: none;
                position: fixed;
                z-index: 9999;
                left: 0; top: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.3);
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: #fff6f6;
                    border-radius: 16px;
                    box-shadow: 0 4px 16px #e2cfcf;
                    padding: 32px 24px;
                    max-width: 340px;
                    min-width: 260px;
                    text-align: center;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: #f8d7da;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px auto;
                        box-shadow: 2px 4px 8px #e2cfcf;
                    ">
                        <i class="fas fa-exclamation-triangle fa-2x" style="color: #dc3545;"></i>
                    </div>
                    <h4 id="modal-titulo" style="color: #dc3545; font-weight: bold; font-size: 1.3rem; margin-bottom: 10px;">Error de Acceso</h4>
                    <p id="modal-mensaje" style="color: #6d4c4c; font-size: 1rem; margin-bottom: 0;"></p>
                    <button id="btn-cerrar-notificacion" style="
                        background: #8d5c5c;
                        color: white;
                        padding: 8px 28px;
                        border-radius: 8px;
                        font-weight: bold;
                        border: none;
                        margin-top: 20px;
                        cursor: pointer;
                    ">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listener para cerrar modal
        document.getElementById('btn-cerrar-notificacion').addEventListener('click', () => {
            document.getElementById('modal-notificacion').style.display = 'none';
        });
    }

    function mostrarNotificacion(mensaje, tipo = 'error') {
        const modal = document.getElementById('modal-notificacion');
        const titulo = document.getElementById('modal-titulo');
        const mensajeEl = document.getElementById('modal-mensaje');
        
        if (tipo === 'error') {
            titulo.textContent = 'Error de Acceso';
            titulo.style.color = '#dc3545';
        } else if (tipo === 'exito') {
            titulo.textContent = '¡Acceso Exitoso!';
            titulo.style.color = '#28a745';
        }
        
        mensajeEl.textContent = mensaje;
        modal.style.display = 'flex';
    }

    // Crear el modal al cargar la página
    crearModalNotificacion();

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username || !password) {
                mostrarNotificacion('Por favor, complete todos los campos');
                return;
            }

            // Deshabilitar botón durante la petición
            loginButton.disabled = true;
            loginButton.textContent = 'Verificando...';
            
            try {
                const response = await apiRequest('/admin/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Guardar token en localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', username);
                    
                    // Mostrar mensaje de éxito
                    mostrarNotificacion('Credenciales válidas. Redirigiendo...', 'exito');
                    
                    // Redirigir al menú después de un breve delay
                    setTimeout(() => {
                        window.location.href = 'menu.html';
                    }, 1500);
                } else {
                    const error = await response.json();
                    mostrarNotificacion(error.error || 'Error en el login');
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                mostrarNotificacion('Error de conexión con el servidor');
            }
            
            // Rehabilitar botón
            loginButton.disabled = false;
            loginButton.textContent = 'INGRESAR';
        });
    }
});
// Utilidades adicionales para OAuth
class OAuthUtils {
    static initializeOAuthProtection() {
        // Verificar si estamos en una página que requiere autenticación
        const protectedPages = ['menu.html', 'inventario.html', 'vender.html', 'facturacion.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            console.log(`🔐 Página protegida detectada: ${currentPage}`);
            
            // Verificar autenticación cada 30 segundos
            setInterval(() => {
                if (window.authManager && window.authManager.isAuthenticated === false) {
                    console.log('⚠️ Sesión expirada o inválida, redirigiendo...');
                    window.location.href = '/login.html';
                }
            }, 30000);
        }
    }
    
    static addLogoutModalToPage() {
        // Función para crear modal de logout bonito
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div id="modal-confirmacion-logout" style="
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
                    max-width: 380px;
                    min-width: 300px;
                    text-align: center;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: #fff3cd;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px auto;
                        box-shadow: 2px 4px 8px #e2cfcf;
                    ">
                        <i class="fas fa-question-circle fa-2x" style="color: #856404;"></i>
                    </div>
                    <h4 style="color: #8d5c5c; font-weight: bold; font-size: 1.3rem; margin-bottom: 10px;">Cerrar Sesión</h4>
                    <p style="color: #6d4c4c; font-size: 1rem; margin-bottom: 25px;">¿Está seguro de que desea cerrar sesión?</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="btn-cancelar-logout" style="
                            background: #6c757d;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 8px;
                            font-weight: bold;
                            border: none;
                            cursor: pointer;
                            min-width: 80px;
                        ">Cancelar</button>
                        <button id="btn-confirmar-logout" style="
                            background: #dc3545;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 8px;
                            font-weight: bold;
                            border: none;
                            cursor: pointer;
                            min-width: 80px;
                        ">Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('btn-cancelar-logout').addEventListener('click', () => {
            document.getElementById('modal-confirmacion-logout').style.display = 'none';
        });
        
        document.getElementById('btn-confirmar-logout').addEventListener('click', () => {
            if (window.authManager) {
                window.authManager.logout();
            } else {
                window.location.href = 'login.html';
            }
        });
        
        // Cerrar al hacer click fuera del modal
        document.getElementById('modal-confirmacion-logout').addEventListener('click', (e) => {
            if (e.target.id === 'modal-confirmacion-logout') {
                document.getElementById('modal-confirmacion-logout').style.display = 'none';
            }
        });
        
        // Configurar el botón de logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('modal-confirmacion-logout').style.display = 'flex';
            });
        }
    }
    
    static setupGlobalErrorHandling() {
        // Manejar errores globales de autenticación
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.status === 401) {
                console.log('🚨 Error 401 detectado, redirigiendo al login');
                window.location.href = '/login.html';
            }
        });
    }
}

// Auto-inicializar cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
    OAuthUtils.initializeOAuthProtection();
    OAuthUtils.addLogoutModalToPage();
    OAuthUtils.setupGlobalErrorHandling();
});

// Exportar para uso global
window.OAuthUtils = OAuthUtils;

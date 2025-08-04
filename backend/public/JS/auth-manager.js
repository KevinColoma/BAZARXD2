// Middleware de autenticación para el frontend
class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }
    
    async init() {
        await this.checkAuthStatus();
        this.setupAuthUI();
    }
    
    async checkAuthStatus() {
        try {
            const response = await fetch('/auth/user');
            const data = await response.json();
            
            if (data.success && data.user) {
                this.user = data.user;
                this.isAuthenticated = true;
                this.updateUserInfo();
                return true;
            } else {
                this.redirectToLogin();
                return false;
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            this.redirectToLogin();
            return false;
        }
    }
    
    redirectToLogin() {
        // Solo redirigir si no estamos ya en la página de login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = '/login.html';
        }
    }
    
    updateUserInfo() {
        // Actualizar información del usuario en la UI
        const userNameElements = document.querySelectorAll('.user-name');
        const userEmailElements = document.querySelectorAll('.user-email');
        const userPhotoElements = document.querySelectorAll('.user-photo');
        
        userNameElements.forEach(el => {
            if (this.user && this.user.name) {
                el.textContent = this.user.name;
            }
        });
        
        userEmailElements.forEach(el => {
            if (this.user && this.user.email) {
                el.textContent = this.user.email;
            }
        });
        
        userPhotoElements.forEach(el => {
            if (this.user && this.user.photo) {
                el.src = this.user.photo;
                el.style.display = 'block';
            }
        });
    }
    
    setupAuthUI() {
        // Configurar botones de logout
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    }
    
    async logout() {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (data.success) {
                this.user = null;
                this.isAuthenticated = false;
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Forzar logout local
            this.user = null;
            this.isAuthenticated = false;
            window.location.href = '/login.html';
        }
    }
    
    // Método para verificar permisos (si los necesitas)
    hasPermission(permission) {
        // Aquí puedes implementar lógica de roles/permisos
        return this.isAuthenticated;
    }
    
    // Obtener información del usuario
    getUser() {
        return this.user;
    }
}

// Crear instancia global del manager de autenticación
window.authManager = new AuthManager();

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

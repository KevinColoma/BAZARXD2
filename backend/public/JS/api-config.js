// Configuración de la API
const API_CONFIG = {
  // Detecta si estamos en localhost o en producción
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:4000/api' 
    : '/api'
};

// Función helper para hacer peticiones
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  return fetch(url, { ...defaultOptions, ...options });
}

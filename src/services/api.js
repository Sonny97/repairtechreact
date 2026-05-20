import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// =============================================
// MANEJO GENÉRICO DE ERRORES - FÁCIL DE ELIMINAR
// =============================================

// Mensaje genérico para errores de servidor (500+)
const ERROR_CONSUMO = 'Error de conexión con el servidor. Por favor, intente más tarde.';

/**
 * Procesa el error y devuelve un mensaje apropiado
 * - Errores 500+: Mensaje genérico de consumo
 * - Otros errores: Mensaje específico del backend o fallback
 */
export const handleApiError = (error, fallbackMessage = 'Ha ocurrido un error') => {
  // Sin respuesta del servidor (timeout, red caída, etc.)
  if (!error.response) {
    return {
      success: false,
      isServerError: true,
      status: null,
      message: ERROR_CONSUMO
    };
  }

  const status = error.response.status;

  // Errores de servidor (500, 502, 503, etc.)
  if (status >= 500) {
    return {
      success: false,
      isServerError: true,
      status,
      message: ERROR_CONSUMO
    };
  }

  // Otros errores (400, 401, 403, 404, 422, etc.) - mostrar mensaje específico
  return {
    success: false,
    isServerError: false,
    status,
    message: error.response?.data?.message || fallbackMessage
  };
};

// =============================================
// FIN MANEJO DE ERRORES
// =============================================

export default api;    
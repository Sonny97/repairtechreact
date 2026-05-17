import api from './api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/usuarios/registro', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar usuario'
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/usuarios/login', credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar sesión'
    };
  }
};

export const getUsuarios = async () => {
  try {
    const response = await api.get('/api/usuarios');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener usuarios' 
    };
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/api/usuarios/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener el usuario' 
    };
  }
};

export const updateUsuario = async (id, userData) => {
  try {
    const response = await api.put(`/api/usuarios/${id}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al actualizar el usuario' 
    };
  }
};

export const deleteUsuario = async (id) => {
  try {
    await api.delete(`/api/usuarios/${id}`);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al eliminar usuario' 
    };
  }
};

// =============================================
// NUEVAS FUNCIONES PARA TÉCNICO
// =============================================

// Obtener citas de un técnico
export const getCitasByTecnico = async (tecnicoId) => {
  try {
    const response = await api.get(`/api/usuarios/citas/tecnico/${tecnicoId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener citas del técnico:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener citas' 
    };
  }
};

// Obtener estadísticas del técnico
export const getEstadisticasTecnico = async (tecnicoId) => {
  try {
    const response = await api.get(`/api/usuarios/citas/tecnico/${tecnicoId}/estadisticas`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener estadísticas' 
    };
  }
};

// Actualizar estado de una cita
export const updateCitaEstado = async (citaId, estado) => {
  try {
    const response = await api.put(`/api/usuarios/citas/${citaId}/estado`, { estado });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al actualizar el estado' 
    };
  }
};

// Obtener citas de un cliente
export const getCitasByCliente = async (clienteId) => {
  try {
    const response = await api.get(`/api/usuarios/citas/cliente/${clienteId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener citas del cliente:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener citas' 
    };
  }
};
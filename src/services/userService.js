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

export const updateUsuario = async (id, userData) => {
  try {
    const response = await api.put(`/api/usuarios/${id}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al actualizar usuario' 
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
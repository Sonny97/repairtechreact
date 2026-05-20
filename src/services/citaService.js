import api, { handleApiError } from './api';

// Obtener técnicos disponibles para una fecha específica
export const getTecnicosDisponibles = async (fecha, tipoServicio) => {
  try {
    const params = new URLSearchParams();
    if (fecha) params.append('fecha', fecha);
    if (tipoServicio) params.append('tipo', tipoServicio);
    
    const url = `/api/tecnicos/disponibles${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return { success: true, data: response.data.data };
  } catch (error) {
    const errorResult = handleApiError(error, 'Error al obtener técnicos');
    return { ...errorResult, data: [] };
  }
};

// Obtener horarios disponibles (opcional - para verificación)
export const getHorariosDisponibles = async (fecha, tipoServicio) => {
  try {
    const response = await api.get(`/api/horarios?fecha=${fecha}&tipo=${tipoServicio}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return handleApiError(error, 'Error al obtener horarios');
  }
};

// Crear una cita (asignación automática de técnico en el backend)
export const crearCita = async (citaData) => {
  try {
    const response = await api.post('/api/citas', citaData);
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error) {
    return handleApiError(error, 'Error al crear la cita');
  }
};

// Obtener citas del cliente
export const getMisCitas = async (clienteId) => {
  try {
    const response = await api.get(`/api/citas/cliente/${clienteId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return handleApiError(error, 'Error al obtener citas');
  }
};

// Cancelar una cita
export const cancelarCita = async (citaId) => {
  try {
    const response = await api.put(`/api/citas/${citaId}/cancelar`);
    return { success: true, message: response.data.message };
  } catch (error) {
    return handleApiError(error, 'Error al cancelar la cita');
  }
};

// Verificar disponibilidad de técnicos para una fecha
export const verificarDisponibilidad = async (fecha, tipoServicio) => {
  try {
    const response = await api.get(`/api/tecnicos/disponibles?fecha=${fecha}&tipo=${tipoServicio}`);
    const tecnicos = response.data.data || [];
    return { 
      success: true, 
      disponible: tecnicos.length > 0,
      tecnicos: tecnicos 
    };
  } catch (error) {
    const errorResult = handleApiError(error, 'Error al verificar disponibilidad');
    return { 
      ...errorResult,
      disponible: false
    };
  }
};
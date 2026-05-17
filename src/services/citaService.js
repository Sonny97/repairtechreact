import api from './api';

// Obtener técnicos disponibles para una fecha específica
export const getTecnicosDisponibles = async (fecha, tipoServicio) => {
  try {
    console.log(`🔄 Solicitando técnicos disponibles para fecha: ${fecha}`);
    const params = new URLSearchParams();
    if (fecha) params.append('fecha', fecha);
    if (tipoServicio) params.append('tipo', tipoServicio);
    
    const url = `/api/tecnicos/disponibles${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    console.log('✅ Técnicos disponibles:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error al obtener técnicos:', error);
    return { 
      success: false, 
      data: [],
      message: error.response?.data?.message || 'Error al obtener técnicos' 
    };
  }
};

// Obtener horarios disponibles (opcional - para verificación)
export const getHorariosDisponibles = async (fecha, tipoServicio) => {
  try {
    const response = await api.get(`/api/horarios?fecha=${fecha}&tipo=${tipoServicio}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener horarios' 
    };
  }
};

// Crear una cita (asignación automática de técnico en el backend)
export const crearCita = async (citaData) => {
  try {
    console.log('📤 Enviando a /api/citas:', citaData);
    const response = await api.post('/api/citas', citaData);
    console.log('📥 Respuesta exitosa:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error detallado:', error.response?.data);
    console.error('❌ Status:', error.response?.status);
    return { 
      success: false, 
      message: error.response?.data?.error || error.response?.data?.message || 'Error al crear la cita' 
    };
  }
};

// Obtener citas del cliente
export const getMisCitas = async (clienteId) => {
  try {
    const response = await api.get(`/api/citas/cliente/${clienteId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al obtener citas' 
    };
  }
};

// Cancelar una cita
export const cancelarCita = async (citaId) => {
  try {
    const response = await api.put(`/api/citas/${citaId}/cancelar`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Error al cancelar la cita' 
    };
  }
};

// Verificar disponibilidad de técnicos para una fecha
export const verificarDisponibilidad = async (fecha, tipoServicio) => {
  try {
    const response = await api.get(`/api/tecnicos/disponibles?fecha=${fecha}&tipo=${tipoServicio}`);
    return { 
      success: true, 
      disponible: response.data.length > 0,
      tecnicos: response.data 
    };
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    return { 
      success: false, 
      disponible: false,
      message: error.response?.data?.message || 'Error al verificar disponibilidad' 
    };
  }
};
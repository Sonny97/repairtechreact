import React, { useState, useEffect } from 'react';
import { getMisCitas, cancelarCita } from '../services/citaService';
import '../styles/MisCitas.css';

const MisCitas = ({ currentUser }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    const result = await getMisCitas(currentUser.id);
    if (result.success) {
      setCitas(result.data);
    }
    setLoading(false);
  };

  const handleCancelar = async (citaId) => {
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      const result = await cancelarCita(citaId);
      if (result.success) {
        cargarCitas();
      } else {
        alert(result.message);
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      pendiente: { class: 'status-pendiente', text: 'Pendiente' },
      confirmada: { class: 'status-confirmada', text: 'Confirmada' },
      en_proceso: { class: 'status-proceso', text: 'En Proceso' },
      completada: { class: 'status-completada', text: 'Completada' },
      cancelada: { class: 'status-cancelada', text: 'Cancelada' }
    };
    return estados[estado] || { class: 'status-pendiente', text: estado };
  };

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Fecha no disponible';
    
    const fecha = new Date(fechaISO);
    
    // Formato: 15 de mayo de 2026
    const opciones = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Bogota'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  // Función para formatear hora
  const formatearHora = (hora) => {
    if (!hora) return 'Horario no disponible';
    
    // Si la hora viene en formato HH:MM:SS o HH:MM
    let horaStr = hora;
    
    // Si viene como objeto Date o string ISO, extraer la hora
    if (hora.includes('T')) {
      horaStr = hora.split('T')[1].split('.')[0];
    }
    
    // Convertir a formato 12 horas
    const [hours, minutes] = horaStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h === 0 ? 12 : h;
    
    return `${h}:${minutes} ${ampm}`;
  };

  // Función para obtener el nombre del servicio en español
  const getNombreServicio = (tipo) => {
    const servicios = {
      mantenimiento: 'Mantenimiento Preventivo',
      reparacion: 'Reparación',
      diagnostico: 'Diagnóstico'
    };
    return servicios[tipo] || tipo;
  };

  if (loading) {
    return <div className="loading-citas">Cargando tus citas...</div>;
  }

  if (citas.length === 0) {
    return (
      <div className="no-citas">
        <div className="no-citas-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#ccc"/>
          </svg>
        </div>
        <h3>No tienes citas agendadas</h3>
        <p>Agenda tu primera cita de mantenimiento o reparación</p>
      </div>
    );
  }

  return (
    <div className="mis-citas-container">
      <h2>Mis Citas</h2>
      <div className="citas-list">
        {citas.map(cita => {
          const estado = getEstadoBadge(cita.estado);
          const fechaFormateada = formatearFecha(cita.fecha);
          const horaFormateada = formatearHora(cita.hora);
          
          return (
            <div key={cita.id} className="cita-card">
              <div className="cita-header">
                <div className="cita-servicio">
                  <span className="servicio-nombre">{getNombreServicio(cita.tipo_servicio)}</span>
                  <span className={`status-badge ${estado.class}`}>{estado.text}</span>
                </div>
                <div className="cita-fecha">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#05C7F2"/>
                  </svg>
                  {fechaFormateada} - {horaFormateada}
                </div>
              </div>
              <div className="cita-body">
                <div className="cita-info">
                  <div className="info-item">
                    <span className="info-label">Electrodoméstico:</span>
                    <span>{cita.electrodomestico}</span>
                  </div>
                  {cita.marca && (
                    <div className="info-item">
                      <span className="info-label">Marca:</span>
                      <span>{cita.marca}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Técnico asignado:</span>
                    <span>{cita.tecnico_nombre || 'Por asignar'}</span>
                  </div>
                  {cita.descripcion && (
                    <div className="info-item full-width">
                      <span className="info-label">Descripción:</span>
                      <p>{cita.descripcion}</p>
                    </div>
                  )}
                </div>
              </div>
              {cita.estado === 'pendiente' && (
                <div className="cita-footer">
                  <button className="btn-cancelar" onClick={() => handleCancelar(cita.id)}>
                    Cancelar cita
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisCitas;
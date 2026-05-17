import React, { useState, useEffect } from 'react';
import { getCitasByTecnico, updateCitaEstado} from '../services/userService';
import '../styles/MisCitasTecnico.css';

const MisCitasTecnico = ({ currentUser }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    setLoading(true);
    const result = await getCitasByTecnico(currentUser.id);
    if (result.success) {
      setCitas(result.data);
    }
    setLoading(false);
  };

  const handleCambiarEstado = async (citaId, nuevoEstado) => {
    setUpdatingId(citaId);
    const result = await updateCitaEstado(citaId, nuevoEstado);
    if (result.success) {
      await cargarCitas();
    } else {
      alert(result.message);
    }
    setUpdatingId(null);
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      pendiente: { class: 'status-pendiente', text: 'Pendiente', icon: '⏳' },
      confirmada: { class: 'status-confirmada', text: 'Confirmada', icon: '✓' },
      en_proceso: { class: 'status-proceso', text: 'En Proceso', icon: '🔧' },
      completada: { class: 'status-completada', text: 'Completada', icon: '✅' },
      cancelada: { class: 'status-cancelada', text: 'Cancelada', icon: '✗' }
    };
    return estados[estado] || { class: 'status-pendiente', text: estado, icon: '?' };
  };

  const getProximoEstado = (estadoActual) => {
    const estados = {
      pendiente: 'confirmada',
      confirmada: 'en_proceso',
      en_proceso: 'completada'
    };
    return estados[estadoActual] || null;
  };

  const getBotonEstado = (estadoActual) => {
    const opciones = {
      pendiente: { label: 'Confirmar', nuevoEstado: 'confirmada', color: 'btn-confirmar' },
      confirmada: { label: 'Iniciar Servicio', nuevoEstado: 'en_proceso', color: 'btn-iniciar' },
      en_proceso: { label: 'Completar', nuevoEstado: 'completada', color: 'btn-completar' }
    };
    return opciones[estadoActual] || null;
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Fecha no disponible';
    const fecha = new Date(fechaISO);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const citasFiltradas = citas.filter(cita => {
    if (filtro === 'todas') return true;
    return cita.estado === filtro;
  });

  const estadisticas = {
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    confirmadas: citas.filter(c => c.estado === 'confirmada').length,
    en_proceso: citas.filter(c => c.estado === 'en_proceso').length,
    completadas: citas.filter(c => c.estado === 'completada').length,
    total: citas.length
  };

  if (loading) {
    return <div className="loading-citas">Cargando tus citas...</div>;
  }

  return (
    <div className="tecnico-citas-container">
      <div className="estadisticas-grid">
        <div className="estadistica-card pendiente">
          <span className="estadistica-valor">{estadisticas.pendientes}</span>
          <span className="estadistica-label">Pendientes</span>
        </div>
        <div className="estadistica-card confirmada">
          <span className="estadistica-valor">{estadisticas.confirmadas}</span>
          <span className="estadistica-label">Confirmadas</span>
        </div>
        <div className="estadistica-card proceso">
          <span className="estadistica-valor">{estadisticas.en_proceso}</span>
          <span className="estadistica-label">En Proceso</span>
        </div>
        <div className="estadistica-card completada">
          <span className="estadistica-valor">{estadisticas.completadas}</span>
          <span className="estadistica-label">Completadas</span>
        </div>
      </div>

      <div className="filtros-container">
        <button 
          className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          Todas ({estadisticas.total})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'pendiente' ? 'active' : ''}`}
          onClick={() => setFiltro('pendiente')}
        >
          Pendientes ({estadisticas.pendientes})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'confirmada' ? 'active' : ''}`}
          onClick={() => setFiltro('confirmada')}
        >
          Confirmadas ({estadisticas.confirmadas})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'en_proceso' ? 'active' : ''}`}
          onClick={() => setFiltro('en_proceso')}
        >
          En Proceso ({estadisticas.en_proceso})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'completada' ? 'active' : ''}`}
          onClick={() => setFiltro('completada')}
        >
          Completadas ({estadisticas.completadas})
        </button>
      </div>

      {citasFiltradas.length === 0 ? (
        <div className="no-citas">
          <div className="no-citas-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#ccc"/>
            </svg>
          </div>
          <h3>No hay citas {filtro !== 'todas' ? `con estado "${filtro}"` : ''}</h3>
          <p>Las citas asignadas aparecerán aquí</p>
        </div>
      ) : (
        <div className="citas-list">
          {citasFiltradas.map(cita => {
            const estado = getEstadoBadge(cita.estado);
            const botonAccion = getBotonEstado(cita.estado);
            const puedeCambiar = botonAccion !== null;
            
            return (
              <div key={cita.id} className="cita-card-tecnico">
                <div className="cita-header">
                  <div className="cliente-info">
                    <h3>{cita.cliente_nombre}</h3>
                    <p>{cita.cliente_direccion}</p>
                  </div>
                  <span className={`status-badge-tecnico ${estado.class}`}>
                    {estado.text}
                  </span>
                </div>

                <div className="cita-body">
                  <div className="cita-detalles">
                    <div className="detalle-item">
                      <label>Teléfono:</label>
                      <span>{cita.cliente_telefono || 'No registrado'}</span>
                    </div>
                    <div className="detalle-item">
                      <label>Electrodoméstico:</label>
                      <span>{cita.electrodomestico}</span>
                    </div>
                    {cita.marca && (
                      <div className="detalle-item">
                        <label>Marca:</label>
                        <span>{cita.marca}</span>
                      </div>
                    )}
                    <div className="detalle-item">
                      <label>Fecha:</label>
                      <span>{formatearFecha(cita.fecha)} - {cita.hora}</span>
                    </div>
                    <div className="detalle-item">
                      <label>Servicio:</label>
                      <span>{cita.tipo_servicio === 'mantenimiento' ? 'Mantenimiento Preventivo' : 
                               cita.tipo_servicio === 'reparacion' ? 'Reparación' : 'Diagnóstico'}</span>
                    </div>
                    {cita.descripcion && (
                      <div className="detalle-item full-width">
                        <label>Descripción:</label>
                        <p>{cita.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {puedeCambiar && cita.estado !== 'cancelada' && (
                  <div className="cita-footer">
                    <button 
                      className={`btn-estado ${botonAccion.color}`}
                      onClick={() => handleCambiarEstado(cita.id, botonAccion.nuevoEstado)}
                      disabled={updatingId === cita.id}
                    >
                      {updatingId === cita.id ? 'Procesando...' : botonAccion.label}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisCitasTecnico;
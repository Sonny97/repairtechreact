import React, { useState } from 'react';
import '../styles/AdminCitas.css';

const AdminCitas = () => {
  const [citas] = useState([]);

  return (
    <div className="citas-container">
      <div className="citas-header">
        <h2>Gestión de Citas</h2>
        <p className="citas-subtitle">Programación y seguimiento de servicios técnicos</p>
      </div>
      
      {citas.length === 0 ? (
        <div className="placeholder-message">
          <div className="placeholder-icon">📅</div>
          <h3>Módulo en Desarrollo</h3>
          <p>Próximamente podrás gestionar todas las citas de servicios técnicos</p>
          <div className="placeholder-features">
            <span>✓ Programación de citas</span>
            <span>✓ Asignación de técnicos</span>
            <span>✓ Historial de servicios</span>
            <span>✓ Notificaciones automáticas</span>
          </div>
        </div>
      ) : (
        <div className="citas-table-container">
          {/* Tabla de citas cuando existan datos */}
          <table className="citas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="empty-message">
                  No hay citas programadas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCitas;
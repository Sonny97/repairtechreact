import React from 'react';
import AdminLayout from './AdminLayout';

const AdminPanel = ({ isOpen, onClose, currentUser, onLogout }) => {
  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="admin-panel-overlay">
        <div className="admin-panel">
          <h2>Acceso Denegado</h2>
          <p>Debes iniciar sesión para acceder al panel de administración.</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }

  if (currentUser.rol !== 'admin') {
    return (
      <div className="admin-panel-overlay">
        <div className="admin-panel">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos de administrador.</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      currentUser={currentUser} 
      onLogout={() => {
        onLogout();
        onClose();
      }} 
    />
  );
};

export default AdminPanel;
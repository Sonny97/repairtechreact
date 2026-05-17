import React, { useState } from 'react';
import AgendarCita from './AgendarCita';
import MisCitas from './MisCitas';
import EditarPerfil from './EditarPerfil';
import '../styles/ClienteDashboard.css';

const ClienteDashboard = ({ currentUser, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('agendar');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getInitial = () => {
    if (currentUser?.nombre_completo) {
      return currentUser.nombre_completo.charAt(0).toUpperCase();
    }
    return currentUser?.email?.charAt(0).toUpperCase() || 'C';
  };

  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
  };

  return (
    <div className="cliente-dashboard">
      {/* Botón toggle para móvil */}
      <button 
        className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`cliente-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-text">Repair<span>Teach</span></span>
        </div>

        <div className="cliente-perfil">
          <div className="cliente-avatar">
            {getInitial()}
          </div>
          <h3>{currentUser?.nombre_completo}</h3>
          <p>{currentUser?.email}</p>
        </div>

        <nav className="cliente-nav">
          <button 
            className={`nav-item ${activeTab === 'agendar' ? 'active' : ''}`}
            onClick={() => handleMenuClick('agendar')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Agendar Cita</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'mis-citas' ? 'active' : ''}`}
            onClick={() => handleMenuClick('mis-citas')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
            </span>
            <span>Mis Citas</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => handleMenuClick('perfil')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Mi Perfil</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={onLogout}>
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="cliente-main">
        <header className="cliente-header">
          <div className="header-title">
            <h1>Mi Panel</h1>
            <p>
              {activeTab === 'agendar' && 'Agenda tu servicio técnico'}
              {activeTab === 'mis-citas' && 'Historial de tus citas'}
              {activeTab === 'perfil' && 'Gestiona tu información personal'}
            </p>
          </div>
          <div className="header-user">
            <span className="user-name">{currentUser?.nombre_completo}</span>
            <div className="user-avatar">
              {getInitial()}
            </div>
          </div>
        </header>

        <div className="cliente-content">
          {activeTab === 'agendar' && (
            <AgendarCita currentUser={currentUser} />
          )}
          {activeTab === 'mis-citas' && (
            <MisCitas currentUser={currentUser} />
          )}
          {activeTab === 'perfil' && (
            <EditarPerfil 
              currentUser={currentUser} 
              onUserUpdate={handleUserUpdate}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ClienteDashboard;
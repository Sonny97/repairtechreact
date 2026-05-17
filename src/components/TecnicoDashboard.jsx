import React, { useState } from 'react';
import MisCitasTecnico from './MisCitasTecnico';
import '../styles/TecnicoDashboard.css';

const TecnicoDashboard = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('citas');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getInitial = () => {
    if (currentUser?.nombre_completo) {
      return currentUser.nombre_completo.charAt(0).toUpperCase();
    }
    return currentUser?.email?.charAt(0).toUpperCase() || 'T';
  };

  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="tecnico-dashboard">
      {/* Botón toggle para móvil */}
      <button 
        className={`sidebar-toggle-tecnico ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`tecnico-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-text">Repair<span>Teach</span></span>
        </div>

        <div className="tecnico-perfil">
          <div className="tecnico-avatar">
            {getInitial()}
          </div>
          <h3>{currentUser?.nombre_completo}</h3>
          <p>{currentUser?.email}</p>
          <span className="rol-badge-tecnico">Técnico</span>
        </div>

        <nav className="tecnico-nav">
          <button 
            className={`nav-item ${activeTab === 'citas' ? 'active' : ''}`}
            onClick={() => handleMenuClick('citas')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Mis Citas</span>
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
      <main className="tecnico-main">
        <header className="tecnico-header">
          <div className="header-title">
            <h1>Panel de Técnico</h1>
            <p>Gestiona tus citas asignadas</p>
          </div>
          <div className="header-user">
            <span className="user-name">{currentUser?.nombre_completo}</span>
            <div className="user-avatar">
              {getInitial()}
            </div>
          </div>
        </header>

        <div className="tecnico-content">
          {activeTab === 'citas' && <MisCitasTecnico currentUser={currentUser} />}
        </div>
      </main>
    </div>
  );
};

export default TecnicoDashboard;
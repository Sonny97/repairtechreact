import React, { useState } from 'react';
import '../styles/AdminLayout.css';
import AdminDashboard from './AdminDashboard';
import AdminUsuarios from './AdminUsuarios';
import AdminCitas from './AdminCitas';

const AdminLayout = ({ currentUser, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <AdminDashboard currentUser={currentUser} />;
      case 'usuarios':
        return <AdminUsuarios />;
      case 'citas':
        return <AdminCitas />;
      default:
        return <AdminDashboard currentUser={currentUser} />;
    }
  };

  const getInitial = () => {
    if (currentUser?.nombre_completo) {
      return currentUser.nombre_completo.charAt(0).toUpperCase();
    }
    return currentUser?.email?.charAt(0).toUpperCase() || 'A';
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <button 
        className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-text">Repair<span>Teach</span></span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleMenuClick('dashboard')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activeMenu === 'usuarios' ? 'active' : ''}`}
            onClick={() => handleMenuClick('usuarios')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Gestionar Usuarios</span>
          </button>

          <button 
            className={`nav-item ${activeMenu === 'citas' ? 'active' : ''}`}
            onClick={() => handleMenuClick('citas')}
          >
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Gestionar Citas</span>
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

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>Panel de Administración</h1>
          </div>
          <div className="header-user">
            <span className="user-name">{currentUser?.nombre_completo || currentUser?.email}</span>
            <div className="user-avatar">
              {getInitial()}
            </div>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
import React, { useState, useEffect } from 'react';
import { getUsuarios } from '../services/userService';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    nuevosHoy: 0,
    tecnicos: 0,
    admins: 0,
    clientes: 0,
    crecimientoMensual: []
  });
  const [loading, setLoading] = useState(true);
  const [fechaActual, setFechaActual] = useState(new Date());

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    const result = await getUsuarios();
    if (result.success) {
      const usuarios = result.data;
      const hoy = new Date().toISOString().split('T')[0];
      
      const tecnicos = usuarios.filter(u => u.rol === 'tecnico').length;
      const admins = usuarios.filter(u => u.rol === 'admin').length;
      const clientes = usuarios.filter(u => u.rol === 'cliente').length;
      
      const rolesData = [
        { name: 'Clientes', value: clientes, color: '#05C7F2' },
        { name: 'Técnicos', value: tecnicos, color: '#FF9800' },
        { name: 'Administradores', value: admins, color: '#4CAF50' }
      ];
      
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const mesActual = new Date().getMonth();
      const crecimientoMensual = [];
      
      for (let i = 5; i >= 0; i--) {
        const mesIndex = (mesActual - i + 12) % 12;
        const registros = usuarios.filter(u => {
          if (!u.fecha_registro) return false;
          const fechaReg = new Date(u.fecha_registro);
          return fechaReg.getMonth() === mesIndex;
        }).length;
        
        crecimientoMensual.push({
          mes: meses[mesIndex],
          usuarios: registros
        });
      }
      
      setStats({
        totalUsuarios: usuarios.length,
        nuevosHoy: usuarios.filter(u => u.fecha_registro?.split('T')[0] === hoy).length,
        tecnicos,
        admins,
        clientes,
        rolesData,
        crecimientoMensual
      });
    }
    setLoading(false);
  };

  const COLORS = ['#05C7F2', '#FF9800', '#4CAF50'];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h2>Bienvenido, {currentUser?.nombre_completo?.split(' ')[0] || 'Administrador'}</h2>
          <p>Panel de control y análisis de RepairTech</p>
        </div>
        <div className="date-section">
          <div className="date-card">
            <span className="date-day">{fechaActual.getDate()}</span>
            <div className="date-info">
              <span className="date-month">{fechaActual.toLocaleString('es', { month: 'long' })}</span>
              <span className="date-year">{fechaActual.getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#05C7F2"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsuarios}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 7H12V12H7V7Z" fill="#05C7F2"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.nuevosHoy}</h3>
            <p>Nuevos Hoy</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8H17V4H7V8H4V10H7V15H17V10H20V8ZM12 13H10V9H12V13ZM15 13H13V9H15V13Z" fill="#05C7F2"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.tecnicos}</h3>
            <p>Técnicos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 8.5L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8.5L12 2Z" fill="#05C7F2"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.admins}</h3>
            <p>Administradores</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Crecimiento de Usuarios</h3>
            <p>Últimos 6 meses</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.crecimientoMensual}>
              <defs>
                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#05C7F2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#05C7F2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
              <Legend />
              <Area type="monotone" dataKey="usuarios" stroke="#05C7F2" fillOpacity={1} fill="url(#colorUsuarios)" name="Nuevos Usuarios" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribución por Roles</h3>
            <p>Porcentaje de usuarios</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.rolesData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {stats.rolesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-header">
          <h3>Actividad Reciente</h3>
          <button className="refresh-btn" onClick={cargarEstadisticas}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="#05C7F2"/>
            </svg>
            Actualizar
          </button>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="#05C7F2"/>
              </svg>
            </div>
            <div className="activity-details">
              <p>Total de usuarios registrados</p>
              <span>{stats.totalUsuarios} usuarios en total</span>
            </div>
            <div className="activity-time">Sistema</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#05C7F2"/>
              </svg>
            </div>
            <div className="activity-details">
              <p>Clientes activos</p>
              <span>{stats.clientes} clientes en la plataforma</span>
            </div>
            <div className="activity-time">{stats.clientes} totales</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8H17V4H7V8H4V10H7V15H17V10H20V8ZM12 13H10V9H12V13ZM15 13H13V9H15V13Z" fill="#05C7F2"/>
              </svg>
            </div>
            <div className="activity-details">
              <p>Técnicos disponibles</p>
              <span>{stats.tecnicos} técnicos para servicios</span>
            </div>
            <div className="activity-time">{stats.tecnicos} activos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
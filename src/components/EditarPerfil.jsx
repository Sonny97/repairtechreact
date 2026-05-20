import React, { useState } from 'react';
import { updateUsuario } from '../services/userService';
import '../styles/EditarPerfil.css';

const EditarPerfil = ({ currentUser, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    nombre_completo: currentUser?.nombre_completo || '',
    email: currentUser?.email || '',
    telefono: currentUser?.telefono || '',
    direccion: currentUser?.direccion || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    
    const userData = {
      nombre_completo: formData.nombre_completo,
      email: formData.email,
      telefono: formData.telefono || '',
      direccion: formData.direccion || ''
    };

    try {
      const result = await updateUsuario(currentUser.id, userData);
      if (result.success) {
        setSuccess('Perfil actualizado correctamente');
        setEditMode(false);
        
        
        const updatedUser = { 
          ...currentUser, 
          nombre_completo: formData.nombre_completo,
          email: formData.email,
          telefono: formData.telefono || '',
          direccion: formData.direccion || ''
        };
        
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setError(result.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-perfil-container">
      <div className="perfil-header">
        <h2>Mi Perfil</h2>
        {!editMode && (
          <button className="btn-editar" onClick={() => setEditMode(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
            </svg>
            Editar Perfil
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {editMode ? (
        <form onSubmit={handleSubmit} className="perfil-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData({...formData, telefono: value});
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="10"
              placeholder="Opcional"
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Opcional"
            />
          </div>

          <div className="form-group">
            <label>Número de documento</label>
            <input
              type="text"
              value={currentUser?.documento || '-'}
              disabled
              className="disabled-input"
            />
            <small>El número de documento no puede ser modificado</small>
          </div>

          

          <div className="form-buttons">
            <button type="submit" className="btn-guardar" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button type="button" className="btn-cancelar" onClick={() => setEditMode(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="perfil-info">
          <div className="info-row">
            <span className="info-label">Nombre completo:</span>
            <span className="info-value">{currentUser?.nombre_completo || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Correo electrónico:</span>
            <span className="info-value">{currentUser?.email || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Teléfono:</span>
            <span className="info-value">{currentUser?.telefono || 'No registrado'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Dirección:</span>
            <span className="info-value">{currentUser?.direccion || 'No registrada'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Documento:</span>
            <span className="info-value">{currentUser?.documento || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Rol:</span>
            <span className="info-value role-badge">{currentUser?.rol === 'cliente' ? 'Cliente' : currentUser?.rol || 'Cliente'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarPerfil;
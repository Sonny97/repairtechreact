import React, { useState } from 'react';
import { registerUser } from '../services/userService';
import SuccessToast from './SuccessToast'; // ← Importa el SuccessToast
import '../styles/Modal.css';

const RegistroModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    docType: 'CC',
    docNumber: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false); // ← Estado para mostrar el toast
  const [toastMessage, setToastMessage] = useState(''); // ← Mensaje del toast

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newAccount = {
      ...formData,
      email: formData.email.trim().toLowerCase()
    };

    const result = await registerUser(newAccount);

    if (result.success) {
      // Mostrar el toast con el nombre del usuario
      setToastMessage(`Bienvenido ${formData.fullName}`);
      setShowToast(true);
      
      // Limpiar formulario
      setFormData({
        docType: 'CC',
        docNumber: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        password: ''
      });
      
      // Cerrar el modal después de un pequeño delay
      setTimeout(() => {
        onClose();
      }, 500);
      
      if (onRegisterSuccess) {
        onRegisterSuccess(result.data);
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleToastClose = () => {
    setShowToast(false);
    setToastMessage('');
  };

  return (
    <>
      <div className="modal" style={{ display: 'flex' }}>
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h2>Registro de Usuario</h2>
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <select name="docType" value={formData.docType} onChange={handleChange} required>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
            <input 
              type="text" 
              name="docNumber"
              placeholder="Número de documento" 
              value={formData.docNumber}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="fullName"
              placeholder="Nombre completo" 
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="Teléfono" 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="address"
              placeholder="Dirección" 
              value={formData.address}
              onChange={handleChange}
              required 
            />
            <input 
              type="password" 
              name="password"
              placeholder="Contraseña" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>

      {/* Toast de éxito */}
      {showToast && (
        <SuccessToast 
          message={toastMessage} 
          onClose={handleToastClose} 
        />
      )}
    </>
  );
};

export default RegistroModal;
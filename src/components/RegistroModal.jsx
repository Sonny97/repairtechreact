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
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores.length > 0) setErrores([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nuevosErrores = [];

    if (!formData.docNumber.trim()) {
      nuevosErrores.push("El número de documento es requerido");
    } else if (formData.docNumber.length < 6) {
      nuevosErrores.push("El documento debe tener al menos 6 caracteres");
    }

    if (!formData.fullName.trim()) {
      nuevosErrores.push("El nombre completo es requerido");
    } else if (formData.fullName.length < 3) {
      nuevosErrores.push("El nombre debe tener al menos 3 caracteres");
    }

    if (!formData.phone) {
      nuevosErrores.push("El teléfono es requerido");
    } else if (formData.phone.length < 10) {
      nuevosErrores.push("El teléfono debe tener 10 dígitos");
    }

    if (!formData.email.trim()) {
      nuevosErrores.push("El correo electrónico es requerido");
    } else if (!validarEmail(formData.email)) {
      nuevosErrores.push("Ingresa un correo electrónico válido");
    }

    if (!formData.address.trim()) {
      nuevosErrores.push("La dirección es requerida");
    }

    if (!formData.password) {
      nuevosErrores.push("La contraseña es requerida");
    } else if (formData.password.length < 6) {
      nuevosErrores.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setLoading(true);
    setErrores([]);

    const newAccount = {
      ...formData,
      email: formData.email.trim().toLowerCase()
    };

    const result = await registerUser(newAccount);

    if (result.success) {
      setToastMessage(`Bienvenido ${formData.fullName}`);
      setShowToast(true);
      
      setFormData({
        docType: 'CC',
        docNumber: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        password: ''
      });
      
      setTimeout(() => {
        onClose();
      }, 500);
      
      if (onRegisterSuccess) {
        onRegisterSuccess(result.data);
      }
    } else {
      setErrores([result.message]);
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
          <button type="button" className="close" onClick={onClose}>&times;</button>
          <h2>Registro de Usuario</h2>
          
          {errores.length > 0 && (
            <div className="errores-container">
              <div className="errores-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                </svg>
                <span>Por favor corrige los siguientes errores:</span>
              </div>
              <ul className="errores-lista">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <select name="docType" value={formData.docType} onChange={handleChange}>
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
            />
            <input 
              type="text" 
              name="fullName"
              placeholder="Nombre completo" 
              value={formData.fullName}
              onChange={handleChange}
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="Teléfono" 
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({...prev, phone: value}));
                if (errores.length > 0) setErrores([]);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="10"
            />
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              value={formData.email}
              onChange={handleChange}
            />
            <input 
              type="text" 
              name="address"
              placeholder="Dirección" 
              value={formData.address}
              onChange={handleChange}
            />
            <input 
              type="password" 
              name="password"
              placeholder="Contraseña" 
              value={formData.password}
              onChange={handleChange}
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
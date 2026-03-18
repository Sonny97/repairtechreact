import React, { useState } from 'react';
import '../styles/Modal.css';

const RegistroModal = ({ isOpen, onClose, onRegister }) => {
    const [formData, setFormData] = useState({
        docType: 'CC',
        docNumber: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        password: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAccount = {
            ...formData,
            email: formData.email.trim().toLowerCase()
        };
        const success = onRegister(newAccount);
        if (success) {
            setFormData({
                docType: 'CC',
                docNumber: '',
                fullName: '',
                phone: '',
                email: '',
                address: '',
                password: ''
            });
        }
    };

    return (
        <div id="registroModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Registro de Usuario</h2>
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
                    <button type="submit" className="btn-primary">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default RegistroModal;

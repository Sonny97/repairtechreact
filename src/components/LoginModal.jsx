import React, { useState } from 'react';
import '../styles/Modal.css';
import { login } from '../services/userService';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email: email, password });
            if (response.status === 200) {
                setEmail('');
                setPassword('');
                onClose();
            }
        } catch (error) {
            console.error('Error en login:', error);
        }
    };

    return (
        <div id="loginModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" className="btn-primary">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;

import React, { useState } from 'react';
import '../styles/Modal.css';
import { loginUser } from '../services/userService';

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await loginUser({ email, password });
            
            if (result.success) {
                // Guardar usuario en localStorage (result.data contiene directamente el usuario)
                localStorage.setItem('user', JSON.stringify(result.data));
                localStorage.setItem('token', 'temp-token');
                
                // Llamar al callback del padre
                if (onLogin) {
                    onLogin(result.data);
                }
                
                setEmail('');
                setPassword('');
                onClose();
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchToRegister = (e) => {
        e.preventDefault();
        onClose();
        if (onSwitchToRegister) {
            onSwitchToRegister();
        }
    };

    return (
        <div id="loginModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <button type="button" className="close" onClick={onClose}>&times;</button>
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
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
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
                <div className="modal-footer-link">
                    <p>¿No tienes cuenta? <a href="#" onClick={handleSwitchToRegister}>Regístrate aquí</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
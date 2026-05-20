import React, { useState } from 'react';
import AlertModal from '../components/AlertModal';
import '../styles/Contacto.css';

const Contacto = ({ onSubmitUsuario }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    const [errores, setErrores] = useState([]);
    const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Limpiar errores al escribir
        if (errores.length > 0) {
            setErrores([]);
        }
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const nuevosErrores = [];

        if (!formData.nombre.trim()) {
            nuevosErrores.push("El nombre es requerido");
        } else if (formData.nombre.length < 3) {
            nuevosErrores.push("El nombre debe tener al menos 3 caracteres");
        }

        if (!formData.email.trim()) {
            nuevosErrores.push("El correo electrónico es requerido");
        } else if (!validarEmail(formData.email)) {
            nuevosErrores.push("Ingresa un correo electrónico válido");
        }

        if (!formData.telefono) {
            nuevosErrores.push("El teléfono es requerido");
        } else if (formData.telefono.length < 10) {
            nuevosErrores.push("El teléfono debe tener 10 dígitos");
        }

        if (!formData.mensaje.trim()) {
            nuevosErrores.push("El mensaje es requerido");
        } else if (formData.mensaje.length < 10) {
            nuevosErrores.push("El mensaje debe tener al menos 10 caracteres");
        }

        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        // Si no hay errores, enviar el formulario
        if (onSubmitUsuario) {
            onSubmitUsuario({
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono,
                mensaje: formData.mensaje
            });
        }
        
        setAlertModal({ isOpen: true, type: 'success', title: '¡Enviado!', message: 'Solicitud enviada correctamente' });
        setErrores([]);
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            mensaje: ''
        });
    };

    return (
        <section id="contacto" className="contacto">
            <h2 data-aos="fade-down">Contáctanos</h2>

            <form id="formularioContacto" data-aos="fade-up" onSubmit={handleSubmit} noValidate>
                <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    id="nombre" 
                    value={formData.nombre}
                    onChange={handleChange}
                />
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                />
                <input 
                    type="tel" 
                    placeholder="Teléfono" 
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({...formData, telefono: value});
                        if (errores.length > 0) setErrores([]);
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="10"
                />
                <textarea 
                    placeholder="Describe tu problema" 
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                ></textarea>

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

                <button type="submit" className="btn-primary">Enviar Solicitud</button>
            </form>

            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
                type={alertModal.type}
                title={alertModal.title}
                message={alertModal.message}
            />
        </section>
    );
};

export default Contacto;

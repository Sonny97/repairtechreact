import React, { useState } from 'react';
import '../styles/Contacto.css';

const Contacto = ({ onSubmitUsuario }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let esValido = true;

        if (formData.nombre.length < 3) {
            console.log("Error: El nombre debe tener al menos 3 caracteres");
            esValido = false;
        }

        if (formData.telefono.length < 10) {
            console.log("Error: El teléfono debe tener al menos 10 caracteres");
            esValido = false;
        }

        if (formData.mensaje.length < 10) {
            console.log("Error: El mensaje debe tener al menos 10 caracteres");
            esValido = false;
        }

        if (esValido) {
            console.log('Formulario enviado:', formData);
            
            if (onSubmitUsuario) {
                onSubmitUsuario({
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    mensaje: formData.mensaje
                });
            }
            
            alert('Solicitud enviada correctamente');
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                mensaje: ''
            });
        }
    };

    return (
        <section id="contacto" className="contacto">
            <h2 data-aos="fade-down">Contáctanos</h2>

            <form id="formularioContacto" data-aos="fade-up" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    id="nombre" 
                    value={formData.nombre}
                    onChange={handleChange}
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                />
                <input 
                    type="tel" 
                    placeholder="Teléfono" 
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                />
                <textarea 
                    placeholder="Describe tu problema" 
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                ></textarea>
                <button type="submit" className="btn-primary">Enviar Solicitud</button>
            </form>
        </section>
    );
};

export default Contacto;

import React from 'react';
import '../styles/Inicio.css';

const Inicio = ({ onSolicitarServicio }) => {
    const handleClick = (e) => {
        e.preventDefault();
        if (onSolicitarServicio) {
            onSolicitarServicio();
        }
    };

    return (
        <section id="inicio" className="hero">
            <div className="hero-content" data-aos="fade-up">
                <h1>Expertos en Reparación y Mantenimiento</h1>
                <p>Lavadoras y neveras con servicio técnico profesional</p>
                <button className="btn-primary" onClick={handleClick}>Solicitar Servicio</button>
            </div>
        </section>
    );
};

export default Inicio;

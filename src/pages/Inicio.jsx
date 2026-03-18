import React from 'react';
import '../styles/Inicio.css';

const Inicio = () => {
    return (
        <section id="inicio" className="hero">
            <div className="hero-content" data-aos="fade-up">
                <h1>Expertos en Reparación y Mantenimiento</h1>
                <p>Lavadoras y neveras con servicio técnico profesional</p>
                <a href="#contacto" className="btn-primary">Solicitar Servicio</a>
            </div>
        </section>
    );
};

export default Inicio;

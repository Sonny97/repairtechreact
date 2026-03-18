import React from 'react';
import '../styles/Servicios.css';

const Servicios = ({ onMantenimientoClick }) => {
    return (
        <section id="servicios" className="servicios">
            <h2 data-aos="fade-right">Nuestros Servicios</h2>

            <div className="cards">
                <div className="card" data-aos="zoom-in">
                    <div className="icon">🧺</div>
                    <h3>Reparación de Lavadoras</h3>
                    <p>Diagnóstico y reparación profesional.</p>
                </div>

                <div className="card" data-aos="zoom-in" data-aos-delay="200">
                    <div className="icon">❄️</div>
                    <h3>Reparación de Neveras</h3>
                    <p>Mantenimiento y cambio de repuestos.</p>
                </div>

                <div 
                    className="card" 
                    data-aos="zoom-in" 
                    data-aos-delay="400" 
                    id="cardMantenimiento" 
                    style={{ cursor: 'pointer' }}
                    onClick={onMantenimientoClick}
                >
                    <div className="icon">🔧</div>
                    <h3>Mantenimiento Preventivo</h3>
                    <p>Alarga la vida útil de tus electrodomésticos.</p>
                </div>
            </div>
        </section>
    );
};

export default Servicios;

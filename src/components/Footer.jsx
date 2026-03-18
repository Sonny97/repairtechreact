import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h4>RepairTech</h4>
                    <p>Sistema de Gestión de reparaciones y mantenimientos.</p>
                    <p className="footer-year">&copy; 2026 - Todos los derechos reservados</p>
                </div>

                <div className="footer-section">
                    <h4>Universidad</h4>
                    <p>Tecnológico de Antioquia (TdeA)</p>
                    <p>Medellín, Colombia</p>
                </div>

                <div className="footer-section">
                    <h4>Integrantes</h4>
                    <ul className="team-list">
                        <li>Carlo</li>
                        <li>Magno</li>
                        <li>Cassidy</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Enlaces Rápidos</h4>
                    <ul className="footer-links">
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#servicios">Servicios</a></li>
                        <li><a href="#productos">Insumos</a></li>
                        <li><a href="#nosotros">Nosotros</a></li>
                        <li><a href="#contacto">Contacto</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>Desarrollado por el equipo de RepairTech</p>
            </div>
        </footer>
    );
};

export default Footer;

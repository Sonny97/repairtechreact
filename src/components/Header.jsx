import React, { useState } from 'react';
import '../styles/Header.css';

const Header = ({ abrirModal, currentUser, onLogout, cartCount }) => {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <header className="header">
            <div className="logo">Repair<span>Tech</span></div>
            <nav className="nav">
                <ul className={menuActive ? 'active' : ''}>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#productos">Insumos</a></li>
                    <li><a href="#nosotros">Nosotros</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
            </nav>
            <div className="auth-buttons">
                {currentUser ? (
                    <>
                        <span className="welcome-msg">Hola, {currentUser.fullName}</span>
                        <button className="btn-secondary" onClick={onLogout}>Cerrar sesión</button>
                    </>
                ) : (
                    <>
                        <button className="btn-secondary" onClick={() => abrirModal('registroModal')}>Registrarse</button>
                        <button className="btn-primary" onClick={() => abrirModal('loginModal')}>Iniciar Sesión</button>
                    </>
                )}
                <button className="btn-secondary" onClick={() => abrirModal('cartModal')}>
                    🛒 <span className="cart-count">{cartCount}</span>
                </button>
            </div>
            <div className="menu-toggle" onClick={toggleMenu}>&#9776;</div>
        </header>
    );
};

export default Header;

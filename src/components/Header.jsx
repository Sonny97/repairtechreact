import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ abrirModal, currentUser, onLogout, cartCount }) => {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <header className="header">
            <div className="logo">Repair<span>Teach</span></div>

            <nav className="nav">
                <ul className={menuActive ? 'active' : ''}>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/servicios">Servicios</Link></li>
                    <li><Link to="/productos">Insumos</Link></li>
                    <li><Link to="/nosotros">Nosotros</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                </ul>
            </nav>

            <div className="auth-buttons">
                {currentUser ? (
                    <>
                        <span className="welcome-msg">
                            Hola, {currentUser.fullName}
                        </span>
                        <button 
                            className="btn-secondary" 
                            onClick={onLogout}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className="btn-secondary" 
                            onClick={() => abrirModal('registroModal')}
                        >
                            Registrarse
                        </button>
                        <button 
                            className="btn-primary" 
                            onClick={() => abrirModal('loginModal')}
                        >
                            Iniciar Sesión
                        </button>
                    </>
                )}

                <button 
                    className="btn-secondary" 
                    onClick={() => abrirModal('cartModal')}
                >
                    🛒 <span className="cart-count">{cartCount}</span>
                </button>
            </div>

            <div className="menu-toggle" onClick={toggleMenu}>
                &#9776;
            </div>
        </header>
    );
};

export default Header;
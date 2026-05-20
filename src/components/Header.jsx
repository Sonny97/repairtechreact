import React, { useState } from 'react';
import '../styles/Header.css';

const Header = ({ abrirModal, currentUser, onLogout, cartCount, isAdminView }) => {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    
    if (isAdminView) {
        return (
            <header className="header admin-header">
                <div className="logo">Repair<span>Teach</span></div>
                <div className="auth-buttons">
                    <span className="welcome-msg">
                        Hola, {currentUser?.nombre_completo || currentUser?.fullName || currentUser?.email}
                    </span>
                    <button 
                        className="btn-secondary" 
                        onClick={onLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>
        );
    }

    return (
        <header className="header">
            <div className="logo">Repair<span>Teach</span></div>

            <div className="menu-toggle" onClick={toggleMenu}>
                {menuActive ? '✕' : '☰'}
            </div>

            <nav className={`nav ${menuActive ? 'active' : ''}`}>
                <ul className={menuActive ? 'active' : ''}>
                    <li><a href="#inicio" onClick={() => setMenuActive(false)}>Inicio</a></li>
                    <li><a href="#servicios" onClick={() => setMenuActive(false)}>Servicios</a></li>
                    <li><a href="#productos" onClick={() => setMenuActive(false)}>Insumos</a></li>
                    <li><a href="#nosotros" onClick={() => setMenuActive(false)}>Nosotros</a></li>
                    <li><a href="#contacto" onClick={() => setMenuActive(false)}>Contacto</a></li>
                    
                    {/* Botones de auth en el menú móvil */}
                    <li className="mobile-auth-section">
                        <div className="auth-buttons mobile-visible">
                            {currentUser ? (
                                <>
                                    <span className="welcome-msg">
                                        Hola, {currentUser.nombre_completo || currentUser.fullName || currentUser.email}
                                    </span>
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => {
                                            onLogout();
                                            setMenuActive(false);
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        className="btn-secondary" 
                                        onClick={() => {
                                            abrirModal('registroModal');
                                            setMenuActive(false);
                                        }}
                                    >
                                        Registrarse
                                    </button>
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => {
                                            abrirModal('loginModal');
                                            setMenuActive(false);
                                        }}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </>
                            )}
                            <button 
                                className="btn-secondary" 
                                onClick={() => {
                                    abrirModal('cartModal');
                                    setMenuActive(false);
                                }}
                            >
                                🛒 Carrito <span className="cart-count">{cartCount}</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>

            {/* Botones de auth en desktop */}
            <div className="auth-buttons desktop-only">
                {currentUser ? (
                    <>
                        <span className="welcome-msg">
                            Hola, {currentUser.nombre_completo || currentUser.fullName || currentUser.email}
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
        </header>
    );
};

export default Header;
import React from 'react';
import '../styles/Modal.css';

const UsuariosModal = ({ isOpen, onClose, usuarios = [] }) => {
    if (!isOpen) return null;

    return (
        <div id="usuariosModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Mantenimiento Preventivo</h2>
                <p className="modal-description">Se realizará mantenimiento a los siguientes usuarios:</p>
                <ul id="listaUsuarios" className="usuarios-list">
                    {usuarios.length === 0 ? (
                        <li>No hay usuarios registrados.</li>
                    ) : (
                        usuarios.map((usuario, index) => (
                            <li key={index}>
                                <strong>{index + 1}. {usuario.nombre}</strong><br />
                                <small>Email: {usuario.email}</small><br />
                                <small>Teléfono: {usuario.telefono}</small><br />
                                <small>Mensaje: {usuario.mensaje}</small>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default UsuariosModal;

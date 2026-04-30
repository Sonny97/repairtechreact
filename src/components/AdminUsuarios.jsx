import React, { useState, useEffect } from 'react';
import { getUsuarios, deleteUsuario, updateUsuario, registerUser } from '../services/userService';
import '../styles/AdminUsuarios.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    docType: 'CC',
    docNumber: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    rol: 'tecnico'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const result = await getUsuarios();
    if (result.success) {
      setUsuarios(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario permanentemente?')) {
      const result = await deleteUsuario(id);
      if (result.success) {
        cargarUsuarios();
      } else {
        alert(result.message);
      }
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
  };

  const handleSaveEdit = async () => {
    const result = await updateUsuario(editingUser.id, editingUser);
    if (result.success) {
      setEditingUser(null);
      cargarUsuarios();
    } else {
      alert(result.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const result = await registerUser(formData);
    if (result.success) {
      setShowModal(false);
      setFormData({
        docType: 'CC',
        docNumber: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        password: '',
        rol: 'tecnico'
      });
      cargarUsuarios();
    } else {
      alert(result.message);
    }
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.documento?.includes(searchTerm)
  );

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : (
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map(usuario => (
                <tr key={usuario.id}>
                  {editingUser?.id === usuario.id ? (
                    <>
                      <td>{usuario.id}</td>
                      <td><input value={editingUser.documento} onChange={(e) => setEditingUser({...editingUser, documento: e.target.value})} /></td>
                      <td><input value={editingUser.nombre_completo} onChange={(e) => setEditingUser({...editingUser, nombre_completo: e.target.value})} /></td>
                      <td><input value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} /></td>
                      <td><input value={editingUser.telefono || ''} onChange={(e) => setEditingUser({...editingUser, telefono: e.target.value})} /></td>
                      <td>
                        <select value={editingUser.rol} onChange={(e) => setEditingUser({...editingUser, rol: e.target.value})}>
                          <option value="cliente">Cliente</option>
                          <option value="tecnico">Técnico</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-save" onClick={handleSaveEdit}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                          </svg>
                          Guardar
                        </button>
                        <button className="btn-cancel" onClick={() => setEditingUser(null)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                          </svg>
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{usuario.id}</td>
                      <td>{usuario.documento}</td>
                      <td>{usuario.nombre_completo}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono || '-'}</td>
                      <td><span className={`rol-badge ${usuario.rol}`}>{usuario.rol}</span></td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(usuario)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                          </svg>
                          Editar
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(usuario.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                          </svg>
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Usuario</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <select value={formData.docType} onChange={(e) => setFormData({...formData, docType: e.target.value})} required>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
              <input type="text" placeholder="Número de documento" value={formData.docNumber} onChange={(e) => setFormData({...formData, docNumber: e.target.value})} required />
              <input type="text" placeholder="Nombre completo" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
              <input type="tel" placeholder="Teléfono" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              <input type="email" placeholder="Correo electrónico" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input type="text" placeholder="Dirección" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <input type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <select value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}>
                <option value="tecnico">Técnico</option>
                <option value="admin">Administrador</option>
              </select>
              <button type="submit" className="btn-submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
                Crear Usuario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
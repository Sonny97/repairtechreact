import React, { useState, useEffect } from 'react';
import { getTecnicosDisponibles, crearCita } from '../services/citaService';
import '../styles/AgendarCita.css';

const AgendarCita = ({ currentUser, onCitaAgendada }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tecnicosDisponibles, setTecnicosDisponibles] = useState([]);
  const [tecnicosCargando, setTecnicosCargando] = useState(false);
  const [formData, setFormData] = useState({
    tipoServicio: '',
    electrodomestico: '',
    marca: '',
    descripcion: '',
    fecha: ''
  });
  const [error, setError] = useState('');

  const tiposServicio = [
    { id: 'mantenimiento', nombre: 'Mantenimiento Preventivo' },
    { id: 'reparacion', nombre: 'Reparación' },
    { id: 'diagnostico', nombre: 'Diagnóstico' }
  ];

  const electrodomesticos = ['Lavadora', 'Nevera', 'Lavadora y Nevera'];

  useEffect(() => {
    if (step === 3 && formData.fecha && formData.tipoServicio) {
      verificarDisponibilidadTecnicos();
    }
  }, [step, formData.fecha, formData.tipoServicio]);

  const verificarDisponibilidadTecnicos = async () => {
    setTecnicosCargando(true);
    const result = await getTecnicosDisponibles(formData.fecha, formData.tipoServicio);
    if (result.success) {
      setTecnicosDisponibles(result.data);
    }
    setTecnicosCargando(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const isStep1Valid = () => formData.tipoServicio !== '';
  const isStep2Valid = () => formData.electrodomestico !== '' && formData.descripcion.trim().length >= 10;
  const isStep3Valid = () => formData.fecha !== '' && tecnicosDisponibles.length > 0;

  const nextStep = () => {
    if (step === 1 && !formData.tipoServicio) {
      setError('Selecciona un tipo de servicio');
      return;
    }
    if (step === 2) {
      if (!formData.electrodomestico) {
        setError('Selecciona el electrodoméstico');
        return;
      }
      if (!formData.descripcion.trim()) {
        setError('Describe el problema del electrodoméstico');
        return;
      }
      if (formData.descripcion.trim().length < 10) {
        setError('La descripción debe tener al menos 10 caracteres');
        return;
      }
    }
    if (step === 3 && !formData.fecha) {
      setError('Selecciona una fecha');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (tecnicosDisponibles.length === 0) {
      setError('No hay técnicos disponibles para la fecha seleccionada. Por favor, elige otra fecha.');
      setLoading(false);
      return;
    }

    const citaData = {
      tipoServicio: formData.tipoServicio,
      electrodomestico: formData.electrodomestico,
      marca: formData.marca || null,
      descripcion: formData.descripcion || null,
      fecha: formData.fecha,
      clienteId: currentUser.id,
      clienteNombre: currentUser.nombre_completo,
      clienteEmail: currentUser.email,
      clienteTelefono: currentUser.telefono || '',
      clienteDireccion: currentUser.direccion || ''
    };

    const result = await crearCita(citaData);
    
    if (result.success) {
      if (onCitaAgendada) onCitaAgendada(result.data);
      setStep(4);
    } else {
      setError(result.message || 'Error al crear la cita');
    }
    setLoading(false);
  };

  const getStepClass = (stepNumber) => {
    if (step > stepNumber) return 'completed';
    if (step === stepNumber) return 'active';
    return '';
  };

  return (
    <div className="agendar-cita-container">
      <div className="steps-indicator">
        <div className={`step ${getStepClass(1)}`}>
          <div className="step-number">{step > 1 ? '✓' : '1'}</div>
          <span>Servicio</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${getStepClass(2)}`}>
          <div className="step-number">{step > 2 ? '✓' : '2'}</div>
          <span>Equipo</span>
        </div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${getStepClass(3)}`}>
          <div className="step-number">{step > 3 ? '✓' : '3'}</div>
          <span>Fecha</span>
        </div>
        <div className={`step-line ${step >= 4 ? 'active' : ''}`}></div>
        <div className={`step ${getStepClass(4)}`}>
          <div className="step-number">4</div>
          <span>Confirmar</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {step === 4 ? (
        <div className="success-container">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#05C7F2"/>
            </svg>
          </div>
          <h2>Cita Agendada Exitosamente</h2>
          <p>Tu solicitud ha sido registrada. Un técnico será asignado automáticamente y se pondrá en contacto contigo.</p>
          <div className="resumen-cita">
            <h3>Resumen de la cita</h3>
            <div className="resumen-item">
              <span className="resumen-label">Servicio:</span>
              <span>{tiposServicio.find(s => s.id === formData.tipoServicio)?.nombre}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Electrodoméstico:</span>
              <span>{formData.electrodomestico}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Fecha:</span>
              <span>{formData.fecha}</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-label">Horario:</span>
              <span>Asignación automática (9:00 AM - 5:00 PM)</span>
            </div>
          </div>
          <button className="btn-nueva-cita" onClick={() => window.location.reload()}>
            Agendar otra cita
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <h2>Selecciona el tipo de servicio</h2>
              <div className="servicios-grid">
                {tiposServicio.map(servicio => (
                  <div
                    key={servicio.id}
                    className={`servicio-card ${formData.tipoServicio === servicio.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, tipoServicio: servicio.id })}
                  >
                    <div className="servicio-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 8H17V4H7V8H4V10H7V15H17V10H20V8ZM12 13H10V9H12V13ZM15 13H13V9H15V13Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3>{servicio.nombre}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>Información del equipo</h2>
              <div className={`form-group ${!formData.electrodomestico && error ? 'has-error' : ''}`}>
                <label>Electrodoméstico <span className="required">*</span></label>
                <div className="electro-grid">
                  {electrodomesticos.map(elec => (
                    <div
                      key={elec}
                      className={`electro-card ${formData.electrodomestico === elec ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData({ ...formData, electrodomestico: elec });
                        setError('');
                      }}
                    >
                      <span>{elec}</span>
                    </div>
                  ))}
                </div>
                {!formData.electrodomestico && <p className="field-hint">Selecciona un electrodoméstico</p>}
              </div>
              <div className="form-group">
                <label>Marca (opcional)</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Ej: LG, Samsung, Whirlpool..."
                />
              </div>
              <div className={`form-group ${formData.descripcion.trim().length > 0 && formData.descripcion.trim().length < 10 ? 'has-warning' : ''}`}>
                <label>Descripción del problema <span className="required">*</span></label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el problema que presenta el electrodoméstico..."
                  rows="4"
                  className={formData.descripcion.trim().length >= 10 ? 'valid' : ''}
                />
                <div className="field-footer">
                  <p className="field-hint">
                    {!formData.descripcion.trim() 
                      ? 'Describe el problema para continuar'
                      : formData.descripcion.trim().length < 10 
                        ? `Mínimo 10 caracteres (${formData.descripcion.trim().length}/10)`
                        : '✓ Descripción válida'}
                  </p>
                  <span className={`char-count ${formData.descripcion.trim().length >= 10 ? 'valid' : ''}`}>
                    {formData.descripcion.trim().length} caracteres
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>Selecciona la fecha</h2>
              <div className="form-group">
                <label>Fecha de la cita</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {formData.fecha && (
                <div className="form-group info-message">
                  <div className="info-message-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#05C7F2"/>
                    </svg>
                    <div>
                      <p>El horario será asignado automáticamente entre 9:00 AM y 5:00 PM.</p>
                      {tecnicosCargando && (
                        <p className="tecnicos-loading">Verificando disponibilidad de técnicos...</p>
                      )}
                      {!tecnicosCargando && tecnicosDisponibles.length === 0 && formData.fecha && (
                        <p className="tecnicos-error">No hay técnicos disponibles para esta fecha. Por favor, elige otra fecha.</p>
                      )}
                      {!tecnicosCargando && tecnicosDisponibles.length > 0 && (
                        <p className="tecnicos-success">Hay {tecnicosDisponibles.length} técnico(s) disponible(s) para esta fecha.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="step-buttons">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep}>
                Atrás
              </button>
            )}
            {step < 3 ? (
              <button 
                type="button" 
                className="btn-primary" 
                onClick={nextStep}
                disabled={
                  (step === 1 && !isStep1Valid()) ||
                  (step === 2 && !isStep2Valid())
                }
              >
                Continuar
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading || tecnicosCargando || tecnicosDisponibles.length === 0}
              >
                {loading ? 'Agendando...' : 'Confirmar Cita'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default AgendarCita;
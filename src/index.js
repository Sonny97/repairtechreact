import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// StrictMode removido temporalmente para evitar doble llamada a APIs en desarrollo
// En producción esto no afecta. Puedes restaurarlo después.
root.render(
  <App />
);

reportWebVitals();
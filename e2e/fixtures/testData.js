/**
 * Datos de prueba para los casos E2E de RepairTech
 * Estos datos se usan en los archivos .spec.js
 */

module.exports = {
  // Datos para el formulario de contacto (CP-02)
  contacto: {
    datosValidos: {
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      telefono: '3001234567',
      mensaje: 'Necesito servicio de reparación para mi lavadora Samsung.'
    },
    datosInvalidos: {
      emailSinArroba: 'pedrogmail.com',
      telefonoCorto: '12345',
      mensajeCorto: 'Corto'
    }
  },

  // Datos para autenticación (CP-03)
  login: {
    credencialesInvalidas: {
      email: 'usuario_invalido@test.com',
      password: 'contraseña_mala'
    }
  },

  registro: {
    datosValidos: {
      docType: 'CE',
      docNumber: '1023456789',
      fullName: 'Laura Martínez',
      phone: '3007654321',
      email: 'laura.martinez@test.com',
      address: 'Calle 123 #45-67, Bogotá',
      password: 'ClaveSegura123'
    },
    datosInvalidos: {
      emailSinArroba: 'correoinvalido'
    },
    otroUsuario: {
      docType: 'CC',
      docNumber: '9876543210',
      fullName: 'Andrés Felipe',
      phone: '3101234567',
      email: 'andres.felipe@test.com',
      address: 'Carrera 7 #65-21',
      password: 'Password123'
    }
  },

  // URL base de la aplicación
  app: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3002',
    timeout: 60000
  }
};

// CP-03 — Formulario de contacto y menú de navegación móvil
// URL bajo prueba: http://localhost:3002/#contacto

describe('CP-03 | Contacto: validación del formulario y menú desplegable', () => {
  const URL_ESPERADA = `${Cypress.config('baseUrl')}/#contacto`;
  const TITULO_ESPERADO = 'RepairTeach | Reparación y Mantenimiento';

  it('rechaza datos inválidos, envía una solicitud válida y navega con el menú móvil', () => {
    // Paso 1 — Abrir la URL de contacto
    cy.abrirSeccion('/#contacto');

    // Paso 2 — Aserción de título y URL
    cy.title().should('eq', TITULO_ESPERADO);
    cy.url().should('eq', URL_ESPERADA);

    // Paso 3 — Aserción de texto y estilos del encabezado
    cy.get('#contacto h2')
      .scrollIntoView()
      .should('have.text', 'Contáctanos')
      .validarEstilo('color', 'rgb(15, 32, 39)');
    cy.get('#contacto').validarEstilo('background-color', 'rgb(245, 247, 250)');

    // Paso 4 — Elementos presentes del formulario
    cy.get('#formularioContacto').should('be.visible').within(() => {
      cy.get('input#nombre').should('have.attr', 'placeholder', 'Nombre completo');
      cy.get('input#email').should('have.attr', 'type', 'email');
      cy.get('input#telefono').should('have.attr', 'maxlength', '10');
      cy.get('textarea#mensaje').should('have.attr', 'placeholder', 'Describe tu problema');
      cy.get('button[type="submit"]').should('have.text', 'Enviar Solicitud');
    });

    // Paso 5 — Estilos CSS de los campos
    cy.get('#formularioContacto input#nombre')
      .validarEstilo('font-family', 'Poppins, sans-serif')
      .validarEstilo('background-color', 'rgb(255, 255, 255)');

    // Paso 6 — Envío vacío: mensajes no exitosos
    cy.get('#formularioContacto button[type="submit"]').click();
    cy.get('.errores-container').should('be.visible');
    cy.get('.errores-header span').should('have.text', 'Por favor corrige los siguientes errores:');
    cy.get('.errores-lista li').should('have.length', 4);
    cy.get('.errores-lista').should('contain.text', 'El nombre es requerido')
      .and('contain.text', 'El correo electrónico es requerido')
      .and('contain.text', 'El teléfono es requerido')
      .and('contain.text', 'El mensaje es requerido');
    cy.get('.errores-header').validarEstilo('color', 'rgb(220, 38, 38)');
    cy.get('.errores-container').validarEstilo('border-left-color', 'rgb(239, 68, 68)');

    // Paso 7 — Datos con formato inválido: mensajes de validación específicos
    cy.get('#nombre').type('Jo');
    cy.get('#email').type('correo-invalido');
    cy.get('#telefono').type('300abc12');
    cy.get('#telefono').should('have.value', '30012'); // solo acepta dígitos
    cy.get('#mensaje').type('Corto');
    cy.get('#formularioContacto button[type="submit"]').click();
    cy.get('.errores-lista li').should('have.length', 4);
    cy.get('.errores-lista').should('contain.text', 'El nombre debe tener al menos 3 caracteres')
      .and('contain.text', 'Ingresa un correo electrónico válido')
      .and('contain.text', 'El teléfono debe tener 10 dígitos')
      .and('contain.text', 'El mensaje debe tener al menos 10 caracteres');

    // Paso 8 — Al escribir se limpian los errores
    cy.get('#nombre').clear().type('Laura Gómez');
    cy.get('.errores-container').should('not.exist');

    // Paso 9 — Completar el formulario con datos válidos
    cy.get('#email').clear().type('laura.gomez@correo.com');
    cy.get('#telefono').clear().type('3001234567');
    cy.get('#mensaje').clear().type('Mi nevera no enfría desde hace dos días.');

    // Paso 10 — Enviar y validar mensaje exitoso
    cy.get('#formularioContacto button[type="submit"]').click();
    cy.get('.alert-modal-content.alert-success').should('be.visible').within(() => {
      cy.get('.alert-title').should('have.text', '¡Enviado!');
      cy.get('.alert-message').should('have.text', 'Solicitud enviada correctamente');
      cy.contains('button', 'Aceptar').click();
    });

    // Paso 11 — El formulario queda limpio
    cy.get('.alert-modal-content').should('not.exist');
    cy.get('#nombre').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#telefono').should('have.value', '');
    cy.get('#mensaje').should('have.value', '');

    // Paso 12 — Menú desplegable de navegación (vista móvil)
    cy.viewport('iphone-x');
    cy.get('nav.nav').should('not.be.visible');
    cy.get('.menu-toggle').should('be.visible').and('have.text', '☰').click();
    cy.get('nav.nav.active').should('be.visible').validarEstilo('background-color', 'rgb(13, 27, 42)');
    cy.get('.menu-toggle').should('have.text', '✕');

    // Paso 13 — Opciones presentes en el menú desplegable
    const opciones = ['Inicio', 'Servicios', 'Insumos', 'Nosotros', 'Contacto'];
    cy.get('nav.nav.active > ul > li > a').should('have.length', opciones.length).each(($a, i) => {
      cy.wrap($a).should('be.visible').and('have.text', opciones[i]);
    });
    cy.get('nav.nav.active .mobile-visible').within(() => {
      cy.contains('button', 'Registrarse').should('be.visible');
      cy.contains('button', 'Iniciar Sesión').should('be.visible');
      cy.contains('button', 'Carrito').should('be.visible');
    });

    // Paso 14 — Navegar desde el menú y validar que se cierra y cambia la URL
    cy.get('nav.nav.active').contains('a', 'Servicios').click();
    cy.get('nav.nav').should('not.have.class', 'active');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/#servicios`);
    cy.get('#servicios h2').should('have.text', 'Nuestros Servicios');
  });
});

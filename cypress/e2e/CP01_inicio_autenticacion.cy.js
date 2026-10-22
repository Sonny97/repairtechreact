// CP-01 — Página de inicio e inicio de sesión
// URL bajo prueba: http://localhost:3002/#inicio

describe('CP-01 | Inicio: encabezado, hero y autenticación', () => {
  const URL_ESPERADA = `${Cypress.config('baseUrl')}/#inicio`;
  const TITULO_ESPERADO = 'RepairTeach | Reparación y Mantenimiento';

  beforeEach(() => {
    cy.fixture('usuarios').as('usuarios');
  });

  it('valida el inicio y autentica a un cliente (credenciales inválidas y válidas)', function () {
    // Paso 1 — Abrir la URL de inicio
    cy.abrirSeccion('/#inicio');

    // Paso 2 — Aserción de título de la página
    cy.title().should('eq', TITULO_ESPERADO);

    // Paso 3 — Aserción de URL
    cy.url().should('eq', URL_ESPERADA);

    // Paso 4 — Aserción de texto del logo
    cy.get('header.header .logo').should('be.visible').and('have.text', 'RepairTeach');
    cy.get('header.header .logo span').should('have.text', 'Teach');

    // Paso 5 — Aserciones de estilos CSS del encabezado
    cy.get('body').validarEstilo('font-family', 'Poppins, sans-serif');
    cy.get('header.header').validarEstilo('background-color', 'rgba(15, 32, 39, 0.9)');
    cy.get('header.header').validarEstilo('position', 'fixed');
    cy.get('header.header .logo').validarEstilo('font-weight', '700');
    cy.get('header.header .logo span').validarEstilo('color', 'rgb(0, 198, 255)');

    // Paso 6 — Elementos presentes en el menú de navegación
    const menu = ['Inicio', 'Servicios', 'Insumos', 'Nosotros', 'Contacto'];
    cy.get('nav.nav > ul > li > a').should('have.length', menu.length).each(($a, i) => {
      cy.wrap($a).should('have.text', menu[i]).and('have.attr', 'href');
    });

    // Paso 7 — Botones de autenticación y carrito presentes
    cy.get('.auth-buttons.desktop-only').within(() => {
      cy.contains('button', 'Registrarse').should('be.visible');
      cy.contains('button', 'Iniciar Sesión').should('be.visible');
      cy.get('.cart-count').should('have.text', '0');
    });

    // Paso 8 — Aserción de texto del hero
    cy.get('#inicio h1').should('have.text', 'Expertos en Reparación y Mantenimiento');
    cy.get('#inicio p').should('contain.text', 'Lavadoras y neveras');

    // Paso 9 — Estilo del botón principal y acción click para abrir el login
    cy.contains('#inicio button', 'Solicitar Servicio')
      .validarEstilo('color', 'rgb(255, 255, 255)')
      .validarEstilo('font-weight', '600')
      .validarEstilo('cursor', 'pointer')
      .click();

    // Paso 10 — El modal de login muestra sus inputs y botón
    cy.get('#loginModal').should('be.visible').within(() => {
      cy.get('h2').should('have.text', 'Iniciar Sesión');
      cy.get('input[type="email"]').should('be.visible').and('have.attr', 'placeholder', 'Correo electrónico');
      cy.get('input[type="password"]').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
      cy.get('button[type="submit"]').should('have.text', 'Ingresar');
      cy.contains('a', 'Regístrate aquí').should('be.visible');
    });

    // Paso 11 — Autenticación NO válida: el backend responde 401
    cy.intercept('POST', '**/api/usuarios/login', {
      statusCode: 401,
      body: { success: false, message: 'Credenciales inválidas' },
    }).as('loginFallido');
    cy.get('#loginModal input[type="email"]').type(this.usuarios.invalido.email);
    cy.get('#loginModal input[type="password"]').type(this.usuarios.invalido.password);
    cy.get('#loginModal button[type="submit"]').click();
    cy.wait('@loginFallido').its('request.body').should('deep.equal', this.usuarios.invalido);
    cy.get('#loginModal .error-message')
      .should('have.text', 'Credenciales inválidas')
      .validarEstilo('color', 'rgb(255, 0, 0)');

    // Paso 12 — Autenticación válida: el backend responde 200 con un cliente
    cy.intercept('GET', '**/api/**', { statusCode: 200, body: { success: true, data: [] } });
    cy.intercept('POST', '**/api/usuarios/login', {
      statusCode: 200,
      body: { success: true, message: 'Login exitoso', data: this.usuarios.cliente.respuesta },
    }).as('loginExitoso');
    cy.get('#loginModal input[type="email"]').clear().type(this.usuarios.cliente.email);
    cy.get('#loginModal input[type="password"]').clear().type(this.usuarios.cliente.password);
    cy.get('#loginModal button[type="submit"]').click();
    cy.wait('@loginExitoso');

    // Paso 13 — Autenticación válida: redirección al panel del cliente con su sesión
    cy.get('#loginModal').should('not.exist');
    cy.get('header.header').should('not.exist');
    cy.get('.cliente-header h1').should('have.text', 'Mi Panel');
    cy.get('.cliente-header .user-name').should('have.text', 'Cliente Prueba');
    cy.window().its('localStorage.user').should('contain', '"rol":"cliente"');
  });
});

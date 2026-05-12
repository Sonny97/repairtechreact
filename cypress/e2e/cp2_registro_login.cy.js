describe('CP2 - Registro e Inicio de Sesión de Usuario', function () {

 

  it('CP2-A - Llenar formulario de registro y validar mensaje de éxito', function () {

    // ── PASO 1: Visitar el sitio web 
    cy.visit('http://localhost:3002')

    // ── PASO 2: Validar título y URL ─────────────────────────────────────
    cy.title().should('eq', 'RepairTeach | Reparación y Mantenimiento')
    cy.url().should('eq', 'http://localhost:3002/')

    // ── PASO 3: Verificar que el botón "Registrarse" está visible ───────
    cy.get('.auth-buttons .btn-secondary').first()
      .should('be.visible')
      .should('contain.text', 'Registrarse')

    // ── PASO 4: Acción — Hacer clic en "Registrarse" para abrir modal ───
    cy.get('.auth-buttons .btn-secondary').first().click()

    // ── PASO 5: Validar que el modal de registro está visible ────────────
    cy.get('.modal').should('be.visible')
    cy.get('.modal-content h2').should('contain.text', 'Registro de Usuario')

    // ── PASO 6: Validar estilo CSS del modal (background blanco) ────────
    cy.get('.modal-content')
      .should('have.css', 'background-color', 'rgb(255, 255, 255)')
      .should('have.css', 'border-radius', '12px')

    // ── PASO 7: Aserción de elementos presentes — inputs del formulario ─
    cy.get('.modal-content select[name="docType"]').should('be.visible')
    cy.get('.modal-content input[name="docNumber"]').should('be.visible')
    cy.get('.modal-content input[name="fullName"]').should('be.visible')
    cy.get('.modal-content input[name="phone"]').should('be.visible')
    cy.get('.modal-content input[name="email"]').should('be.visible')
    cy.get('.modal-content input[name="address"]').should('be.visible')
    cy.get('.modal-content input[name="password"]').should('be.visible')

    // ── PASO 8: Aserción — verificar opciones del select tipo documento ─
    cy.get('select[name="docType"]').should('contain', 'Cédula de Ciudadanía')
    cy.get('select[name="docType"]').should('contain', 'Cédula de Extranjería')
    cy.get('select[name="docType"]').should('contain', 'Tarjeta de Identidad')

    // ── PASO 9: Acción — Seleccionar tipo de documento ──────────────────
    cy.get('select[name="docType"]').select('CC')

    // ── PASO 10: Acción — Llenar número de documento ─────────────────────
    const timestamp = Date.now()
    cy.get('input[name="docNumber"]').type(`1001${timestamp.toString().slice(-6)}`)

    // ── PASO 11: Acción — Llenar nombre completo ─────────────────────────
    cy.get('input[name="fullName"]').type('Carlos Prueba Cypress')

    // ── PASO 12: Acción — Llenar teléfono ────────────────────────────────
    cy.get('input[name="phone"]').type('3001234567')

    // ── PASO 13: Acción — Llenar correo electrónico único ────────────────
    cy.get('input[name="email"]').type(`cypress.test.${timestamp}@repairtech.com`)

    // ── PASO 14: Acción — Llenar dirección ───────────────────────────────
    cy.get('input[name="address"]').type('Calle 50 # 40-20, Medellín')

    // ── PASO 15: Acción — Llenar contraseña (mínimo 6 caracteres) ────────
    cy.get('input[name="password"]').type('repair123')

    // ── PASO 16: Validar que el botón submit está habilitado ─────────────
    cy.get('.modal-content .btn-primary[type="submit"]')
      .should('be.visible')
      .should('not.be.disabled')
      .should('contain.text', 'Registrarse')

    // ── PASO 18: Acción — Enviar formulario ──────────────────────────────────
    cy.get('.modal-content .btn-primary[type="submit"]').click()

    // Esperar respuesta del backend
    cy.wait(3000)

    // ── PASO 19: Verificar si hay error visible primero ───────────────────────
    cy.get('body').then(($body) => {
    if ($body.find('.error-message').length > 0) {
    cy.get('.error-message').then(($err) => {
      throw new Error(`El registro falló con error: ${$err.text()}`)
    })
  }
})

    // Verificar que el modal se cerró (señal de registro exitoso)
    cy.get('.modal', { timeout: 8000 }).should('not.exist')
  })

  // ── ESCENARIO B: Validación de credenciales incorrectas en Login ─────

  it('CP2-B - Validar mensaje de error con credenciales incorrectas', function () {

    // ── PASO 1: Visitar el sitio web ─────────────────────────────────────
    cy.visit('http://localhost:3002')

    // ── PASO 2: Validar título ───────────────────────────────────────────
    cy.title().should('eq', 'RepairTeach | Reparación y Mantenimiento')

    // ── PASO 3: Validar URL ──────────────────────────────────────────────
    cy.url().should('eq', 'http://localhost:3002/')

    // ── PASO 4: Aserción — botón Iniciar Sesión visible ──────────────────
    cy.get('.auth-buttons .btn-primary')
      .should('be.visible')
      .should('contain.text', 'Iniciar Sesión')

    // ── PASO 5: Acción — Abrir modal de login ────────────────────────────
    cy.get('.auth-buttons .btn-primary').click()

    // ── PASO 6: Validar que el modal de login está visible ───────────────
    cy.get('#loginModal').should('be.visible')
    cy.get('#loginModal .modal-content h2').should('contain.text', 'Iniciar Sesión')

    // ── PASO 7: Aserción de elementos presentes en el modal login ────────
    cy.get('#loginModal input[type="email"]').should('be.visible')
    cy.get('#loginModal input[type="password"]').should('be.visible')
    cy.get('#loginModal .btn-primary').should('be.visible')

    // ── PASO 8: Validar estilo del input (padding y border-radius) ───────
    cy.get('#loginModal input[type="email"]')
      .should('have.css', 'border-radius', '8px')
      .should('have.css', 'padding', '10px 12px')

    // ── PASO 9: Acción — Ingresar email inválido ──────────────────────────
    cy.get('#loginModal input[type="email"]').type('usuario.invalido@noexiste.com')

    // ── PASO 10: Acción — Ingresar contraseña incorrecta ─────────────────
    cy.get('#loginModal input[type="password"]').type('wrongpassword')

    // ── PASO 11: Acción — Hacer clic en el botón Ingresar ────────────────
    cy.get('#loginModal .btn-primary').click()

    // ── PASO 12: Validar mensaje de error en pantalla ─────────────────────
    cy.get('.error-message', { timeout: 5000 })
      .should('be.visible')
      .should('contain.text', 'Credenciales inválidas')

    // ── PASO 13: Validar estilo CSS del mensaje de error (color rojo) ────
    cy.get('.error-message')
      .should('have.css', 'color', 'rgb(255, 0, 0)')

    // ── PASO 14: Verificar que el modal NO se cerró (login fallido) ───────
    cy.get('#loginModal').should('be.visible')

    // ── PASO 15: Acción — Cerrar el modal con el botón X ─────────────────
    cy.get('#loginModal .close').click({ force: true })
    cy.wait(500)
    cy.get('#loginModal').should('not.exist')

  })

  // ── ESCENARIO C: Login exitoso con usuario válido ────────────────────

  it('CP2-C - Login exitoso y redirección a vista de cliente', function () {

    // ── PASO 1: Visitar el sitio ──────────────────────────────────────────
    cy.visit('http://localhost:3002')

    // ── PASO 2: Validar título ───────────────────────────────────────────
    cy.title().should('eq', 'RepairTeach | Reparación y Mantenimiento')

    // ── PASO 3: Validar URL ──────────────────────────────────────────────
    cy.url().should('eq', 'http://localhost:3002/')

    // ── PASO 4: Abrir modal de login ─────────────────────────────────────
    cy.get('.auth-buttons .btn-primary').click()

    // ── PASO 5: Verificar modal visible ──────────────────────────────────
    cy.get('#loginModal').should('be.visible')
    cy.get('#loginModal h2').should('contain.text', 'Iniciar Sesión')

    // ── PASO 6: Ingresar credenciales de cliente válido ───────────────────
    // Nota: asume que existe este usuario en la BD de prueba
    cy.get('#loginModal input[type="email"]').type('admin@repairtech.com')
    cy.get('#loginModal input[type="password"]').type('admin123')

    // ── PASO 7: Acción — Hacer clic en Ingresar ───────────────────────────
    cy.get('#loginModal .btn-primary').click()

    // ── PASO 8: Validar que el modal se cierra tras login exitoso ─────────
    cy.get('#loginModal').should('not.exist')

    // ── PASO 9: Validar que el panel admin cargó correctamente ───────────
    cy.get('.admin-layout', { timeout: 5000 }).should('exist')

    // ── PASO 10: Validar sidebar visible con texto Dashboard ─────────────
    cy.get('.admin-sidebar').should('be.visible')
    cy.get('.admin-sidebar').should('contain.text', 'Dashboard')

    // ── PASO 11: Validar que el header del admin contiene el nombre ───────
    cy.get('.admin-header').should('be.visible')
    cy.get('.admin-header').should('contain.text', 'Admin')

    // ── PASO 12: Validar que NO existe el header público ─────────────────
    cy.get('.auth-buttons').should('not.exist')

    // ── PASO 13: Buscar botón cerrar sesión y hacer clic ─────────────────
    // Intenta encontrar el botón de logout con cualquier texto posible
cy.get('.admin-layout').then(($layout) => {
  if ($layout.find('button:contains("Cerrar sesión")').length) {
    cy.contains('button', 'Cerrar sesión').click()
  } else if ($layout.find('button:contains("Cerrar Sesión")').length) {
    cy.contains('button', 'Cerrar Sesión').click()
  } else if ($layout.find('button:contains("Logout")').length) {
    cy.contains('button', 'Logout').click()
  } else if ($layout.find('button:contains("Salir")').length) {
    cy.contains('button', 'Salir').click()
  } else {
    // Buscar cualquier botón en el sidebar
    cy.get('.admin-sidebar button').last().click()
  }
})

    // ── PASO 14: Validar que vuelve a la vista principal ─────────────────
    cy.get('.header', { timeout: 5000 }).should('be.visible')
    cy.get('.auth-buttons').should('contain.text', 'Iniciar Sesión')
  })

})

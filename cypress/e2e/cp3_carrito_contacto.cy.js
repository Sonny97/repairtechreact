describe('CP3 - Carrito de Compras y Formulario de Contacto', function () {

  // ── ESCENARIO A: Agregar productos al carrito ────────────────────────

  it('CP3-A - Agregar insumos al carrito y verificar totales', function () {

    // ── PASO 1: Visitar el sitio ──────────────────────────────────────────
    cy.visit('http://localhost:3002')

    // ── PASO 2: Validar título de la página ──────────────────────────────
    cy.title().should('eq', 'RepairTech')

    // ── PASO 3: Validar URL ───────────────────────────────────────────────
    cy.url().should('eq', 'http://localhost:3002/')

    // ── PASO 4: Verificar sección de productos visible ────────────────────
    cy.get('#productos').should('exist')
    cy.get('#productos h2').should('contain.text', 'Venta de Insumos')

    // ── PASO 5: Validar que existen 4 productos con nombre y precio ───────
    cy.get('.product-card').should('have.length', 4)
    cy.get('.product-card').first().find('h3').should('contain.text', 'Motor para Lavadora')
    cy.get('.product-card').first().find('.price').should('contain.text', '$120.000')

    // ── PASO 6: Validar estilo CSS de los precios (color cyan) ───────────
    cy.get('.product-card .price')
      .first()
      .should('have.css', 'color', 'rgb(0, 198, 255)')
      .should('have.css', 'font-weight', '700')

    // ── PASO 7: Aserción — botones "Agregar al carrito" están presentes ──
    cy.get('.agregar-btn').each(($btn) => {
      cy.wrap($btn).should('be.visible').should('contain.text', 'Agregar al carrito')
    })

    // ── PASO 8: Validar que el contador del carrito inicia en 0 ──────────
    cy.get('.cart-count').should('contain.text', '0')

    // ── PASO 9: Acción — Agregar primer producto (Motor para Lavadora) ───
    cy.get('.agregar-btn').eq(0).click()
    cy.get('.cart-count').should('contain.text', '1')

    // ── PASO 10: Acción — Agregar segundo producto (Termostato Nevera) ───
    cy.get('.agregar-btn').eq(1).click()
    cy.get('.cart-count').should('contain.text', '2')

    // ── PASO 11: Acción — Agregar el primer producto una vez más ─────────
    cy.get('.agregar-btn').eq(0).click()
    cy.get('.cart-count').should('contain.text', '3')

    // ── PASO 12: Acción — Abrir el modal del carrito ──────────────────────
    cy.get('.auth-buttons button').contains('🛒').click()

    // ── PASO 13: Validar que el modal del carrito está visible ────────────
    cy.get('#cartModal').should('be.visible')
    cy.get('#cartModal h2').should('contain.text', 'Carrito de Compras')

    // ── PASO 14: Validar que los productos están listados en el carrito ───
    cy.get('.cart-items li').should('have.length', 2)
    cy.get('.cart-items').should('contain.text', 'Motor para Lavadora')
    cy.get('.cart-items').should('contain.text', 'Termostato Nevera')

    // ── PASO 15: Validar que la cantidad del Motor es 2 ──────────────────
    cy.get('.cart-items li').eq(0).find('.cart-item-qty').should('contain.text', '2')

    // ── PASO 16: Aserción de elementos presentes — dropdown de envío ─────
    cy.get('.cart-shipping select').should('be.visible')
    cy.get('.cart-shipping select').should('contain', 'Recoger en tienda - Gratis')
    cy.get('.cart-shipping select').should('contain', 'Envío estándar - $5.000')
    cy.get('.cart-shipping select').should('contain', 'Envío express - $10.000')

    // ── PASO 17: Acción — Seleccionar envío estándar ─────────────────────
    cy.get('.cart-shipping select').select('5000')

    // ── PASO 18: Aserción — métodos de pago presentes ────────────────────
    cy.get('input[name="cartPayment"][value="card"]').should('be.visible')
    cy.get('input[name="cartPayment"][value="cash"]').should('be.visible')
    cy.get('input[name="cartPayment"][value="transfer"]').should('be.visible')

    // ── PASO 19: Acción — Cambiar método de pago a transferencia ─────────
    cy.get('input[name="cartPayment"][value="transfer"]').click()
    cy.get('input[name="cartPayment"][value="transfer"]').should('be.checked')

    // ── PASO 20: Acción — Aplicar cupón de descuento válido ──────────────
    cy.get('.cart-coupon input[type="text"]').type('REPAIR10')
    cy.get('.cart-coupon .btn-secondary').click()

    // ── PASO 21: Validar mensaje del cupón aplicado ───────────────────────
    cy.get('.coupon-msg')
      .should('be.visible')
      .should('contain.text', 'Cupón aplicado: 10%')

    // ── PASO 22: Validar estilo CSS del mensaje del cupón (color cyan) ────
    cy.get('.coupon-msg')
      .should('have.css', 'color', 'rgb(0, 198, 255)')

    // ── PASO 23: Validar que el total aparece en pantalla ─────────────────
    cy.get('.cart-total').should('be.visible').should('contain.text', 'Total:')

    // ── PASO 24: Validar que el resumen de costos es visible ─────────────
    cy.get('.cart-summary').should('contain.text', 'Subtotal:')
    cy.get('.cart-summary').should('contain.text', 'Descuento:')
    cy.get('.cart-summary').should('contain.text', 'Envío:')

    // ── PASO 25: Aserción — botones de checkout presentes ────────────────
    cy.get('.checkout-buttons .btn-primary').should('contain.text', 'Finalizar Compra')
    cy.get('.checkout-buttons .btn-secondary').should('contain.text', 'Pagar Ahora')

    // ── PASO 26: Acción — Finalizar la compra ────────────────────────────
    cy.get('.checkout-buttons .btn-primary').click()

    // ── PASO 27: Aceptar la alerta de confirmación de compra ─────────────
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.include('Compra realizada')
    })

    // ── PASO 28: Validar que el carrito quedó vacío ────────────────────────
    cy.get('.cart-count').should('contain.text', '0')

  })

  // ── ESCENARIO B: Formulario de contacto ─────────────────────────────

  it('CP3-B - Llenar formulario de contacto y validar envío exitoso', function () {

    // ── PASO 1: Visitar el sitio ──────────────────────────────────────────
    cy.visit('http://localhost:3002')

    // ── PASO 2: Validar título ───────────────────────────────────────────
    cy.title().should('eq', 'RepairTech')

    // ── PASO 3: Validar URL ───────────────────────────────────────────────
    cy.url().should('eq', 'http://localhost:3002/')

    // ── PASO 4: Navegar a la sección de contacto mediante scroll ──────────
    cy.get('#contacto').scrollIntoView()
    cy.get('#contacto').should('be.visible')

    // ── PASO 5: Aserción de texto — Título de la sección ─────────────────
    cy.get('#contacto h2').should('contain.text', 'Contáctanos')

    // ── PASO 6: Validar estilo CSS de la sección contacto ────────────────
    cy.get('.contacto h2')
      .should('have.css', 'color', 'rgb(15, 32, 39)')

    // ── PASO 7: Aserción de elementos presentes — campos del formulario ──
    cy.get('#formularioContacto input[id="nombre"]').should('be.visible')
    cy.get('#formularioContacto input[id="email"]').should('be.visible')
    cy.get('#formularioContacto input[id="telefono"]').should('be.visible')
    cy.get('#formularioContacto textarea[id="mensaje"]').should('be.visible')

    // ── PASO 8: Validar estilo CSS de los inputs (border-radius) ─────────
    cy.get('#formularioContacto input[id="nombre"]')
      .should('have.css', 'border-radius', '10px')
      .should('have.css', 'padding', '12px')

    // ── PASO 9: Validar que el botón de envío es visible y tiene estilo ──
    cy.get('#formularioContacto .btn-primary')
      .should('be.visible')
      .should('contain.text', 'Enviar Solicitud')
      .should('have.css', 'background-color', 'rgb(0, 198, 255)')

    // ── PASO 10: Acción — Llenar el campo nombre ──────────────────────────
    cy.get('#nombre').type('Ana María García')

    // ── PASO 11: Acción — Llenar el correo electrónico ────────────────────
    cy.get('#email').type('ana.garcia@correo.com')

    // ── PASO 12: Acción — Llenar el teléfono (mínimo 10 dígitos) ─────────
    cy.get('#telefono').type('3157894561')

    // ── PASO 13: Acción — Llenar el mensaje (mínimo 10 caracteres) ────────
    cy.get('#mensaje').type('Necesito mantenimiento preventivo para mi nevera Samsung de dos puertas')

    // ── PASO 14: Validar que todos los campos tienen valor antes de enviar
    cy.get('#nombre').should('have.value', 'Ana María García')
    cy.get('#email').should('have.value', 'ana.garcia@correo.com')
    cy.get('#telefono').should('have.value', '3157894561')
    cy.get('#mensaje').invoke('val').should('include', 'mantenimiento preventivo')

    // ── PASO 15: Acción — Enviar el formulario ────────────────────────────
    cy.get('#formularioContacto .btn-primary').click()

    // ── PASO 16: Aceptar la alerta de confirmación ────────────────────────
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.eq('Solicitud enviada correctamente')
    })

    // ── PASO 17: Validar que el formulario fue limpiado tras el envío ─────
    cy.get('#nombre').should('have.value', '')
    cy.get('#email').should('have.value', '')
    cy.get('#telefono').should('have.value', '')
    cy.get('#mensaje').should('have.value', '')

    // ── PASO 18: Validar navegación a sección servicios ──────────────────
    cy.get('#servicios').scrollIntoView()
    cy.get('#cardMantenimiento').should('be.visible')
    cy.get('#cardMantenimiento').should('contain.text', 'Mantenimiento Preventivo')

    // ── PASO 19: Acción — Clic en card de Mantenimiento Preventivo ───────
    cy.get('#cardMantenimiento').click()

    // ── PASO 20: Validar que el modal de usuarios/mantenimiento se abre ───
    cy.get('#usuariosModal').should('be.visible')
    cy.get('#usuariosModal h2').should('contain.text', 'Mantenimiento Preventivo')

    // ── PASO 21: Validar el texto descriptivo del modal ───────────────────
    cy.get('#usuariosModal .modal-description')
      .should('contain.text', 'Se realizará mantenimiento')

    // ── PASO 22: Validar que los usuarios de contacto están listados ──────
    cy.get('#listaUsuarios li').should('have.length.at.least', 1)
    cy.get('#listaUsuarios').should('contain.text', 'Juan Pérez')

    // ── PASO 23: Validar estilo CSS del modal de usuarios ─────────────────
    cy.get('#usuariosModal .modal-content')
      .should('have.css', 'background-color', 'rgb(255, 255, 255)')

    // ── PASO 24: Aserción de elementos presentes en lista de usuarios ─────
    cy.get('#listaUsuarios li').each(($li) => {
      cy.wrap($li).find('strong').should('exist')
      cy.wrap($li).find('small').should('exist')
    })

    // ── PASO 25: Acción — Cerrar el modal ─────────────────────────────────
    cy.get('#usuariosModal .close').click({force: true})
    cy.get('#usuariosModal').should('not.exist')

  })

})

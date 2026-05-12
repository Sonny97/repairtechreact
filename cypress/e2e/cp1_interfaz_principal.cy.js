describe('CP1 - Validación de Interfaz Principal y Navegación', function () {

  it('CP1 - Verificar que la página principal carga correctamente con todos sus elementos', function () {

    // ── PASO 1: Visitar el sitio web de RepairTech ──────────────────────
    cy.visit('http://localhost:3002')

    // ── PASO 2: Validar el TÍTULO de la página (aserción de título) ─────
    cy.title().should('eq', 'RepairTeach | Reparación y Mantenimiento')

    // ── PASO 3: Validar la URL de la página ─────────────────────────────
    cy.url().should('eq', 'http://localhost:3002/')

    // ── PASO 4: Aserción de elemento presente — el HEADER debe ser visible
    cy.get('.header').should('be.visible')

    // ── PASO 5: Aserción de texto — Logo "RepairTech" en el header ──────
    cy.get('.logo').should('be.visible')
    cy.get('.logo').should('contain.text', 'Repair')

    // ── PASO 6: Validar estilo CSS del header (background con rgba oscuro)
    cy.get('.header').should('have.css', 'position', 'fixed')
    cy.get('.header').should('have.css', 'z-index', '1000')

    // ── PASO 7: Validar que la sección HERO (inicio) es visible ─────────
    cy.get('#inicio').should('be.visible')

    // ── PASO 8: Aserción de texto — Título principal del hero ───────────
    cy.get('.hero h1')
      .should('be.visible')
      .should('contain.text', 'Expertos en Reparación y Mantenimiento')

    // ── PASO 9: Aserción de texto — Subtítulo del hero ──────────────────
    cy.get('.hero p')
      .should('contain.text', 'Lavadoras y neveras con servicio técnico profesional')

    // ── PASO 10: Aserción de elemento presente — Botón CTA en el Hero ──
    cy.get('.hero .btn-primary')
      .should('be.visible')
      .should('contain.text', 'Solicitar Servicio')

    // ── PASO 11: Validar estilo CSS del botón primary (border-radius) ───
    cy.get('.hero .btn-primary').should('have.css', 'border-radius', '30px')

    // ── PASO 12: Validar que la sección SERVICIOS existe y tiene título ─
    cy.get('#servicios').should('exist')
    cy.get('#servicios h2').should('contain.text', 'Nuestros Servicios')

    // ── PASO 13: Validar que hay exactamente 3 tarjetas de servicios ────
    cy.get('#servicios .card').should('have.length', 3)

    // ── PASO 14: Aserción de texto en las 3 tarjetas de servicio ────────
    cy.get('#servicios .card').eq(0).should('contain.text', 'Reparación de Lavadoras')
    cy.get('#servicios .card').eq(1).should('contain.text', 'Reparación de Neveras')
    cy.get('#servicios .card').eq(2).should('contain.text', 'Mantenimiento Preventivo')

    // ── PASO 15: Validar que la sección PRODUCTOS existe ────────────────
    cy.get('#productos').should('exist')
    cy.get('#productos h2').should('contain.text', 'Venta de Insumos')

    // ── PASO 16: Validar que hay 4 productos en el grid ─────────────────
    cy.get('#productGrid .product-card').should('have.length', 4)

    // ── PASO 17: Aserción de elementos presentes — imágenes de productos
    cy.get('#productGrid .product-card img').each(($img) => {
      cy.wrap($img).should('exist')
      cy.wrap($img).should('have.attr', 'src')
      cy.wrap($img).invoke('attr', 'src').should('not.be.empty')
    })

    // ── PASO 18: Validar estilo CSS del precio (color cyan primario) ─────
    cy.get('.product-card .price')
      .first()
      .should('have.css', 'color', 'rgb(0, 198, 255)')

    // ── PASO 19: Validar botones "Agregar al carrito" presentes ─────────
    cy.get('.agregar-btn').should('have.length', 4)
    cy.get('.agregar-btn').first().should('contain.text', 'Agregar al carrito')

    // ── PASO 20: Validar sección NOSOTROS ───────────────────────────────
    cy.get('#nosotros').should('exist')
    cy.get('#nosotros h2').should('contain.text', 'Sobre RepairTech')
    cy.get('#nosotros p').should('contain.text', 'reparación')

    // ── PASO 21: Validar sección CONTACTO ───────────────────────────────
    cy.get('#contacto').should('exist')
    cy.get('#contacto h2').should('contain.text', 'Contáctanos')

    // ── PASO 22: Validar el FOOTER y su contenido ───────────────────────
    cy.get('.footer').should('be.visible')
    cy.get('.footer').should('contain.text', 'RepairTech')
    cy.get('.footer').should('contain.text', 'Tecnológico de Antioquia')
    cy.get('.footer').should('contain.text', 'Medellín, Colombia')

    // ── PASO 23: Validar integrantes del equipo en el footer ────────────
    cy.get('.team-list').should('contain.text', 'Carlo')
    cy.get('.team-list').should('contain.text', 'Magno')
    cy.get('.team-list').should('contain.text', 'Cassidy')

    // ── PASO 24: Validar los enlaces rápidos del footer (dropdown nav) ──
    cy.get('.footer-links a').should('have.length.at.least', 4)
    cy.get('.footer-links a').eq(0).should('contain.text', 'Inicio')
    cy.get('.footer-links a').eq(1).should('contain.text', 'Servicios')
    cy.get('.footer-links a').eq(2).should('contain.text', 'Insumos')

    // ── PASO 25: Validar estilo CSS del footer (background oscuro) ───────
    cy.get('.footer-bottom').should('be.visible')
    cy.get('.footer-bottom').should('contain.text', 'Desarrollado por el equipo de RepairTech')

    // ── PASO 26: Acción — Navegar a sección Servicios via enlace footer ─
    cy.get('.footer-links a[href="#servicios"]').click()
    cy.url().should('include', '#servicios')

    // ── PASO 27: Acción — Navegar de vuelta a Inicio ────────────────────
    cy.get('.footer-links a[href="#inicio"]').click()
    cy.url().should('include', '#inicio')

    // ── PASO 28: Validar botones de auth en header (sin sesión) ─────────
    cy.get('.auth-buttons .btn-secondary').first().should('contain.text', 'Registrarse')
    cy.get('.auth-buttons .btn-primary').should('contain.text', 'Iniciar Sesión')

    // ── PASO 29: Validar botón del carrito en header ─────────────────────
    cy.get('.auth-buttons').should('contain.text', '🛒')
    cy.get('.cart-count').should('contain.text', '0')

    // ── PASO 30: Validar font-family del body (Poppins) ──────────────────
    cy.get('body').should('have.css', 'font-family').and('include', 'Poppins')

  })

})

// CP-02 — Venta de insumos y carrito de compras
// URL bajo prueba: http://localhost:3002/#productos

describe('CP-02 | Insumos: catálogo, carrito, envío y cupón', () => {
  const URL_ESPERADA = `${Cypress.config('baseUrl')}/#productos`;
  const TITULO_ESPERADO = 'RepairTeach | Reparación y Mantenimiento';

  const productos = [
    { nombre: 'Motor para Lavadora', precio: '$120.000', alt: 'Repuesto Lavadora' },
    { nombre: 'Termostato Nevera', precio: '$45.000', alt: 'Repuesto Nevera' },
    { nombre: 'Compresor Nevera', precio: '$250.000', alt: 'Compresor Nevera' },
    { nombre: 'Bomba de Agua Lavadora', precio: '$85.000', alt: 'Bomba de Agua' },
  ];

  it('agrega insumos al carrito, aplica envío y cupón y finaliza la compra', () => {
    // Paso 1 — Abrir la URL de insumos
    cy.abrirSeccion('/#productos');

    // Paso 2 — Aserción de título y URL
    cy.title().should('eq', TITULO_ESPERADO);
    cy.url().should('eq', URL_ESPERADA);

    // Paso 3 — Aserción de texto y estilos del encabezado de la sección
    cy.get('#productos h2')
      .scrollIntoView()
      .should('have.text', 'Venta de Insumos')
      .validarEstilo('color', 'rgb(15, 32, 39)');
    cy.get('#productos').validarEstilo('background-color', 'rgb(255, 255, 255)');

    // Paso 4 — Elementos presentes: 4 tarjetas con imagen cargada, nombre, precio y botón
    cy.get('#productGrid .product-card').should('have.length', productos.length).each(($card, i) => {
      cy.wrap($card).scrollIntoView().within(() => {
        cy.get('img')
          .should('be.visible')
          .and('have.attr', 'alt', productos[i].alt)
          .and(($img) => expect($img[0].naturalWidth, 'imagen cargada').to.be.greaterThan(0));
        cy.get('h3').should('have.text', productos[i].nombre);
        cy.get('.price').should('have.text', productos[i].precio);
        cy.contains('button', 'Agregar al carrito').should('be.visible');
      });
    });

    // Paso 5 — Estilos CSS del precio y del botón
    cy.get('.product-card .price').first().validarEstilo('color', 'rgb(0, 198, 255)');
    cy.get('.product-card .agregar-btn').first().validarEstilo('cursor', 'pointer');

    // Paso 6 — Acción: agregar 2 motores y 1 termostato
    cy.contains('.product-card', 'Motor para Lavadora').find('button').click().click();
    cy.contains('.product-card', 'Termostato Nevera').find('button').click();
    cy.get('.desktop-only .cart-count').should('have.text', '3');

    // Paso 7 — Abrir el carrito y validar los ítems
    cy.get('.desktop-only').contains('button', '🛒').click();
    cy.get('#cartModal').should('be.visible');
    cy.get('#cartModal h2').should('have.text', 'Carrito de Compras');
    cy.get('#cartModal .cart-items li').should('have.length', 2);
    cy.contains('#cartModal .cart-items li', 'Motor para Lavadora').find('.cart-item-qty').should('have.text', '2');
    cy.contains('.cart-summary p', 'Subtotal').invoke('text').should('match', /\$285[.,]000/);

    // Paso 8 — Lista desplegable de envío: opciones presentes y selección
    const opcionesEnvio = ['Recoger en tienda - Gratis', 'Envío estándar - $5.000', 'Envío express - $10.000'];
    cy.get('.cart-shipping select option').should('have.length', 3).each(($opt, i) => {
      cy.wrap($opt).should('have.text', opcionesEnvio[i]);
    });
    cy.get('.cart-shipping select').should('have.value', '0').select('Envío estándar - $5.000');
    cy.get('.cart-shipping select').should('have.value', '5000');
    cy.contains('.cart-summary p', 'Envío').invoke('text').should('match', /\$5[.,]000/);

    // Paso 9 — Cupón inválido (mensaje no exitoso)
    cy.get('.cart-coupon input').type('DESCUENTO99');
    cy.contains('.cart-coupon button', 'Aplicar').click();
    cy.get('.coupon-msg').should('have.text', 'Cupón inválido.');

    // Paso 10 — Cupón válido (mensaje exitoso) y descuento aplicado
    cy.get('.cart-coupon input').clear().type('repair10');
    cy.contains('.cart-coupon button', 'Aplicar').click();
    cy.get('.coupon-msg').should('have.text', 'Cupón aplicado: 10%');
    cy.contains('.cart-summary p', 'Descuento').invoke('text').should('match', /\$28[.,]500/);

    // Paso 11 — Método de pago (radio buttons)
    cy.get('input[name="cartPayment"]').should('have.length', 3);
    cy.get('input[name="cartPayment"][value="card"]').should('be.checked');
    cy.get('input[name="cartPayment"][value="transfer"]').check().should('be.checked');

    // Paso 12 — Total = 285.000 − 28.500 + 5.000
    cy.get('.cart-total').invoke('text').should('match', /Total: \$261[.,]500/);

    // Paso 13 — Finalizar compra y validar mensaje exitoso
    cy.contains('.checkout-buttons button', 'Finalizar Compra').click();
    cy.get('.alert-modal-content.alert-success').should('be.visible').within(() => {
      cy.get('.alert-title').should('have.text', '¡Gracias por tu compra!');
      cy.get('.alert-message').should('have.text', 'Compra realizada exitosamente.');
      cy.contains('button', 'Aceptar').click();
    });
    cy.get('#cartModal').should('not.exist');
    cy.get('.desktop-only .cart-count').should('have.text', '0');
  });
});

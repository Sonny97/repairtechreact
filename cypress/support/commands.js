// Abre una sección del sitio y espera a que desaparezca el loader inicial (1.5 s).
Cypress.Commands.add('abrirSeccion', (ruta) => {
  cy.visit(ruta);
  cy.get('#loader', { timeout: 10000 }).should('not.exist');
});

// Valida un estilo CSS calculado por el navegador.
Cypress.Commands.add('validarEstilo', { prevSubject: 'element' }, (subject, propiedad, valor) => {
  cy.wrap(subject).should('have.css', propiedad, valor);
});

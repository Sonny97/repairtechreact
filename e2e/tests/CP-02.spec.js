/**
 * CP-02: Formulario de Contacto - Validación de Llenado y Mensajes
 *
 * Este caso de prueba valida el funcionamiento completo del formulario de contacto:
 * - Llenado correcto con datos válidos
 * - Validación de errores al enviar con campos vacíos
 * - Aserciones de texto (mensajes de error, placeholders)
 * - Aserciones de elementos presentes (inputs, textarea, botón)
 * - Aserciones de estilos CSS
 * - Aserciones de título y URL
 *
 * Técnicas aplicadas:
 * - Actions: sendKeys, click, clear, submit
 * - Assertions: texto de errores, valores de inputs, estilos CSS
 * - Dropdown: validación de selects si existen
 *
 * URL base: http://localhost:3002
 */

const { By, Key } = require('selenium-webdriver');
const assert = require('assert');

describe('CP-02: Formulario de Contacto - Llenado y Validación', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';

  beforeEach(async () => {
    // Navegar a la página principal antes de cada test
    await driver.get(BASE_URL + '/');
    await driver.sleep(1000);

    // Scroll hasta la sección de contacto
    await driver.executeScript(
      "document.querySelector('#contacto').scrollIntoView({ behavior: 'instant' });"
    );
    await driver.sleep(1000);
  });

  it('CP-02-01: Validar que el formulario de contacto está presente', async () => {
    // STEP 1: Buscar el formulario de contacto por su ID
    const formulario = await driver.findElement(By.id('formularioContacto'));
    assert.strictEqual(
      formulario !== null,
      true,
      'El formulario de contacto debe estar presente en la página'
    );
    console.log('  ✅ Formulario de contacto encontrado');

    // STEP 2: Verificar que el formulario tiene el atributo 'novalidate'
    const noValidate = await formulario.getAttribute('novalidate');
    assert.strictEqual(
      noValidate !== null,
      true,
      'El formulario debe tener validación HTML5 deshabilitada (novalidate)'
    );
  });

  it('CP-02-02: Validar elementos del formulario (inputs, textarea, botón)', async () => {
    // STEP 3: Verificar que existe el campo nombre
    const inputNombre = await driver.findElement(By.id('nombre'));
    assert.strictEqual(
      inputNombre !== null,
      true,
      'El campo de nombre debe existir'
    );

    // STEP 4: Verificar que existe el campo email
    const inputEmail = await driver.findElement(By.id('email'));
    assert.strictEqual(
      inputEmail !== null,
      true,
      'El campo de email debe existir'
    );

    // STEP 5: Verificar que existe el campo teléfono
    const inputTelefono = await driver.findElement(By.id('telefono'));
    assert.strictEqual(
      inputTelefono !== null,
      true,
      'El campo de teléfono debe existir'
    );

    // STEP 6: Verificar que existe el textarea de mensaje
    const textareaMensaje = await driver.findElement(By.id('mensaje'));
    assert.strictEqual(
      textareaMensaje !== null,
      true,
      'El textarea de mensaje debe existir'
    );

    // STEP 7: Verificar que existe el botón de envío
    const botonEnviar = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    assert.strictEqual(
      botonEnviar !== null,
      true,
      'El botón de enviar debe existir'
    );

    // STEP 8: Obtener el texto del botón
    const textoBoton = await botonEnviar.getText();
    assert.strictEqual(
      textoBoton.includes('Enviar'),
      true,
      `El botón debe decir "Enviar" o similar. Obtenido: "${textoBoton}"`
    );
    console.log(`  Texto del botón: "${textoBoton}"`);
  });

  it('CP-02-03: Validar placeholders de los campos', async () => {
    // STEP 9: Obtener placeholder del campo nombre
    const inputNombre = await driver.findElement(By.id('nombre'));
    const placeholderNombre = await inputNombre.getAttribute('placeholder');
    assert.strictEqual(
      placeholderNombre.length > 0,
      true,
      'El campo nombre debe tener un placeholder'
    );
    console.log(`  Placeholder nombre: "${placeholderNombre}"`);

    // STEP 10: Obtener placeholder del campo email
    const inputEmail = await driver.findElement(By.id('email'));
    const placeholderEmail = await inputEmail.getAttribute('placeholder');
    assert.strictEqual(
      placeholderEmail.length > 0,
      true,
      'El campo email debe tener un placeholder'
    );
    console.log(`  Placeholder email: "${placeholderEmail}"`);

    // STEP 11: Validar tipo de input email
    const tipoEmail = await inputEmail.getAttribute('type');
    assert.strictEqual(
      tipoEmail,
      'email',
      'El campo de email debe tener type="email"'
    );

    // STEP 12: Obtener placeholder del textarea
    const textarea = await driver.findElement(By.id('mensaje'));
    const placeholderMensaje = await textarea.getAttribute('placeholder');
    console.log(`  Placeholder mensaje: "${placeholderMensaje}"`);
  });

  it('CP-02-04: Validar estilos CSS del formulario', async () => {
    // STEP 13: Obtener estilos del formulario
    const formulario = await driver.findElement(By.css('#formularioContacto'));

    const backgroundColor = await formulario.getCssValue('background-color');
    console.log(`  Background del formulario: ${backgroundColor}`);

    // STEP 14: Verificar que los inputs tienen bordes definidos
    const inputNombre = await driver.findElement(By.id('nombre'));
    const borderInput = await inputNombre.getCssValue('border');
    console.log(`  Borde del input: ${borderInput}`);

    // STEP 15: Verificar font-family de los inputs
    const fontFamilyInput = await inputNombre.getCssValue('font-family');
    assert.strictEqual(
      fontFamilyInput.length > 0,
      true,
      'Los inputs deben tener una fuente definida'
    );
    console.log(`  Font-family de inputs: ${fontFamilyInput}`);

    // STEP 16: Verificar el color del botón
    const boton = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    const colorBoton = await boton.getCssValue('color');
    console.log(`  Color del botón: ${colorBoton}`);

    // STEP 17: Verificar el background-color del botón
    const bgBoton = await boton.getCssValue('background-color');
    console.log(`  Background del botón: ${bgBoton}`);

    // STEP 18: Verificar padding del formulario
    const paddingForm = await formulario.getCssValue('padding');
    console.log(`  Padding del formulario: ${paddingForm}`);

    // STEP 19: Verificar border-radius del botón
    const borderRadiusBoton = await boton.getCssValue('border-radius');
    console.log(`  Border-radius del botón: ${borderRadiusBoton}`);
  });

  it('CP-02-05: Llenar formulario con datos válidos y enviar', async () => {
    // STEP 20: Limpiar y escribir en el campo nombre
    const inputNombre = await driver.findElement(By.id('nombre'));
    await inputNombre.clear();
    await inputNombre.sendKeys('Juan Pérez');
    const valorNombre = await inputNombre.getAttribute('value');
    assert.strictEqual(
      valorNombre,
      'Juan Pérez',
      'El nombre debe ser "Juan Pérez"'
    );

    // STEP 21: Escribir en el campo email
    const inputEmail = await driver.findElement(By.id('email'));
    await inputEmail.clear();
    await inputEmail.sendKeys('juan.perez@example.com');
    const valorEmail = await inputEmail.getAttribute('value');
    assert.strictEqual(
      valorEmail,
      'juan.perez@example.com',
      'El email debe ser "juan.perez@example.com"'
    );

    // STEP 22: Escribir en el campo teléfono (solo números, 10 dígitos)
    const inputTelefono = await driver.findElement(By.id('telefono'));
    await inputTelefono.clear();
    await inputTelefono.sendKeys('3001234567');
    const valorTelefono = await inputTelefono.getAttribute('value');
    assert.strictEqual(
      valorTelefono,
      '3001234567',
      'El teléfono debe ser "3001234567"'
    );

    // STEP 23: Escribir en el textarea de mensaje
    const textareaMensaje = await driver.findElement(By.id('mensaje'));
    await textareaMensaje.clear();
    const mensajePrueba = 'Necesito servicio de reparación para mi lavadora Samsung.';
    await textareaMensaje.sendKeys(mensajePrueba);
    const valorMensaje = await textareaMensaje.getAttribute('value');
    assert.strictEqual(
      valorMensaje.length >= 10,
      true,
      'El mensaje debe tener al menos 10 caracteres'
    );
    console.log(`  Mensaje ingresado: "${mensajePrueba}"`);

    // STEP 24: Hacer scroll hasta el botón
    const botonEnviar = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', botonEnviar);
    await driver.sleep(500);

    // STEP 25: Hacer click en el botón de enviar
    await botonEnviar.click();
    await driver.sleep(2000);

    // STEP 26: Verificar que aparece el modal de éxito (AlertModal)
    const alertModal = await driver.findElement(By.css('.alert-modal-overlay, .alert-modal-content'));
    assert.strictEqual(
      alertModal !== null,
      true,
      'Debe aparecer un modal después del envío'
    );

    // STEP 27: Buscar el mensaje de éxito
    const modalContent = await alertModal.getText();
    assert.strictEqual(
      modalContent.includes('Enviado') || modalContent.includes('éxito') ||
      modalContent.includes('Éxito') || modalContent.includes('correctamente'),
      true,
      `El modal debe contener un mensaje de éxito. Contenido: "${modalContent}"`
    );
    console.log(`  ✅ Mensaje de éxito encontrado: "${modalContent}"`);
  });

  it('CP-02-06: Validar mensajes de error al enviar formulario vacío', async () => {
    // STEP 28: Hacer scroll hasta el formulario
    const formulario = await driver.findElement(By.id('formularioContacto'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', formulario);
    await driver.sleep(500);

    // STEP 29: Enviar el formulario sin llenar datos
    const botonEnviar = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    await botonEnviar.click();
    await driver.sleep(1000);

    // STEP 30: Buscar el contenedor de errores
    const erroresContainer = await driver.findElements(
      By.css('.errores-container, .error-message, .errors')
    );

    assert.strictEqual(
      erroresContainer.length > 0,
      true,
      'Debe aparecer un mensaje de error al enviar vacío'
    );

    // STEP 31: Obtener el texto de errores
    const textoErrores = await erroresContainer[0].getText();
    assert.strictEqual(
      textoErrores.length > 0,
      true,
      'Debe haber texto en el mensaje de error'
    );
    console.log(`  Mensajes de error: "${textoErrores}"`);

    // STEP 32: Verificar que el mensaje contenga al menos una validación
    const tieneValidacion =
      textoErrores.includes('nombre') ||
      textoErrores.includes('correo') ||
      textoErrores.includes('teléfono') ||
      textoErrores.includes('mensaje') ||
      textoErrores.includes('requerido');
    assert.strictEqual(
      tieneValidacion,
      true,
      'El mensaje de error debe mencionar los campos requeridos'
    );
  });

  it('CP-02-07: Validar mensaje de error con email inválido', async () => {
    // STEP 33: Llenar nombre válido
    const inputNombre = await driver.findElement(By.id('nombre'));
    await inputNombre.clear();
    await inputNombre.sendKeys('Pedro Gómez');

    // STEP 34: Llenar email inválido (sin @)
    const inputEmail = await driver.findElement(By.id('email'));
    await inputEmail.clear();
    await inputEmail.sendKeys('pedrogmail.com'); // Falta @

    // STEP 35: Llenar teléfono válido
    const inputTelefono = await driver.findElement(By.id('telefono'));
    await inputTelefono.clear();
    await inputTelefono.sendKeys('3109876543');

    // STEP 36: Llenar mensaje válido
    const textareaMensaje = await driver.findElement(By.id('mensaje'));
    await textareaMensaje.clear();
    await textareaMensaje.sendKeys('Mi nevera no enfria correctamente.');

    // STEP 37: Enviar formulario
    const botonEnviar = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    await botonEnviar.click();
    await driver.sleep(1000);

    // STEP 38: Verificar que aparece error de email inválido
    const erroresContainer = await driver.findElements(By.css('.errores-container'));
    assert.strictEqual(
      erroresContainer.length > 0,
      true,
      'Debe aparecer mensaje de error por email inválido'
    );

    const textoError = await erroresContainer[0].getText();
    const tieneErrorEmail =
      textoError.includes('válido') ||
      textoError.includes('correo') ||
      textoError.includes('email');
    assert.strictEqual(
      tieneErrorEmail,
      true,
      `El mensaje debe indicar error en el email. Obtenido: "${textoError}"`
    );
    console.log(`  ✅ Error de email inválido capturado: "${textoError}"`);
  });

  it('CP-02-08: Validar mensaje de error con teléfono con pocos dígitos', async () => {
    // STEP 39: Llenar nombre válido
    const inputNombre = await driver.findElement(By.id('nombre'));
    await inputNombre.clear();
    await inputNombre.sendKeys('María López');

    // STEP 40: Llenar email válido
    const inputEmail = await driver.findElement(By.id('email'));
    await inputEmail.clear();
    await inputEmail.sendKeys('maria.lopez@test.com');

    // STEP 41: Llenar teléfono con menos de 10 dígitos
    const inputTelefono = await driver.findElement(By.id('telefono'));
    await inputTelefono.clear();
    await inputTelefono.sendKeys('12345'); // Solo 5 dígitos

    // STEP 42: Llenar mensaje válido
    const textareaMensaje = await driver.findElement(By.id('mensaje'));
    await textareaMensaje.clear();
    await textareaMensaje.sendKeys('Necesito reparar mi estufa.');

    // STEP 43: Enviar formulario
    const botonEnviar = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    await botonEnviar.click();
    await driver.sleep(1000);

    // STEP 44: Verificar que aparece error de teléfono
    const erroresContainer = await driver.findElements(By.css('.errores-container'));
    const textoError = erroresContainer.length > 0
      ? await erroresContainer[0].getText()
      : '';

    const tieneErrorTelefono =
      textoError.includes('teléfono') ||
      textoError.includes('dígitos') ||
      textoError.includes('10');
    assert.strictEqual(
      tieneErrorTelefono,
      true,
      `El mensaje debe indicar error en el teléfono (10 dígitos). Obtenido: "${textoError}"`
    );
    console.log(`  ✅ Error de teléfono capturado: "${textoError}"`);
  });

  it('CP-02-09: Validar que el formulario se limpia después de envío exitoso', async () => {
    // STEP 45: Llenar formulario con datos válidos
    const inputNombre = await driver.findElement(By.id('nombre'));
    await inputNombre.clear();
    await inputNombre.sendKeys('Carlos Ruiz');

    const inputEmail = await driver.findElement(By.id('email'));
    await inputEmail.clear();
    await inputEmail.sendKeys('carlos.ruiz@ejemplo.com');

    const inputTelefono = await driver.findElement(By.id('telefono'));
    await inputTelefono.clear();
    await inputTelefono.sendKeys('3205551234');

    const textareaMensaje = await driver.findElement(By.id('mensaje'));
    await textareaMensaje.clear();
    await textareaMensaje.sendKeys('Mi lavadora hace ruido extraño.');

    // STEP 46: Enviar formulario
    const botonEnviar = await driver.findElement(
      By.css('#formularioContacto button[type="submit"]')
    );
    await botonEnviar.click();
    await driver.sleep(2000);

    // STEP 47: Cerrar el modal de éxito si aparece
    const botonesCerrar = await driver.findElements(By.css('.close, .btn-close'));
    if (botonesCerrar.length > 0) {
      await botonesCerrar[0].click();
      await driver.sleep(500);
    }

    // STEP 48: Hacer scroll de vuelta al formulario
    await driver.executeScript(
      "document.querySelector('#contacto').scrollIntoView({ behavior: 'instant' });"
    );
    await driver.sleep(1000);

    // STEP 49: Verificar que los campos se limpiaron
    const valorNombre = await inputNombre.getAttribute('value');
    const valorEmail = await inputEmail.getAttribute('value');
    const valorTelefono = await inputTelefono.getAttribute('value');
    const valorMensaje = await textareaMensaje.getAttribute('value');

    assert.strictEqual(
      valorNombre === '' && valorEmail === '' &&
      valorTelefono === '' && valorMensaje === '',
      true,
      'Todos los campos deben estar vacíos después de un envío exitoso'
    );
    console.log('  ✅ Formulario limpiado correctamente después del envío exitoso');
  });

  it('CP-02-10: Validar URL y título de la página durante el flujo', async () => {
    // STEP 50: Verificar URL actual
    const urlActual = await driver.getCurrentUrl();
    assert.strictEqual(
      urlActual.includes('localhost:3002') || urlActual.includes('repairtech'),
      true,
      `La URL debe ser del dominio de RepairTech. Obtenida: ${urlActual}`
    );

    // STEP 51: Verificar título de la página
    const titulo = await driver.getTitle();
    assert.strictEqual(
      titulo.length > 0,
      true,
      'El título de la página debe estar definido'
    );
    console.log(`  Título de la página: "${titulo}"`);
    console.log(`  URL actual: "${urlActual}"`);

    // STEP 52: Verificar que la sección contacto tiene el ID correcto
    const seccionContacto = await driver.findElement(By.id('contacto'));
    assert.strictEqual(
      seccionContacto !== null,
      true,
      'La sección de contacto debe existir con id="contacto"'
    );

    // STEP 53: Obtener y mostrar el heading de la sección contacto
    const headingContacto = await seccionContacto.findElement(By.css('h2'));
    const textoHeading = await headingContacto.getText();
    console.log(`  Heading de contacto: "${textoHeading}"`);
    assert.strictEqual(
      textoHeading.length > 0,
      true,
      'El heading de contacto debe tener texto'
    );

    console.log('  ✅ Validaciones finales de URL y título completadas');
  });
});

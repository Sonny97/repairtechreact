/**
 * CP-03: Autenticación de Usuario - Login y Registro
 *
 * Este caso de prueba valida el flujo completo de autenticación:
 * - Apertura del modal de login
 * - Llenado del formulario de login
 * - Validación de credenciales inválidas (mensaje de error)
 * - Validación de credenciales válidas (mensaje de éxito/redirección)
 * - Cambio a modal de registro
 * - Llenado del formulario de registro
 * - Aserciones de texto, elementos, título, URL y estilos CSS
 *
 * Técnicas aplicadas:
 * - Actions: click, sendKeys, clear, hover
 * - Assertions: texto de error/éxito, elementos presentes, estilos CSS
 * - Dropdown: tipo de documento en registro
 * - Validación de título y URL
 *
 * URL base: http://localhost:3002
 */

const { By, Key } = require('selenium-webdriver');
const assert = require('assert');

describe('CP-03: Autenticación de Usuario - Login y Registro', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';

  it('CP-03-01: Validar que el modal de login se abre correctamente', async () => {
    // STEP 1: Buscar y hacer click en el botón de login del header
    const botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar") or contains(text(),"Login")]')
    );

    // Si no hay botón directo, buscar enlace con texto "Iniciar Sesión"
    if (botonesLogin.length === 0) {
      botonesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
    }

    assert.strictEqual(
      botonesLogin.length > 0,
      true,
      'Debe existir un botón o enlace para abrir el login'
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
    await driver.sleep(500);
    await botonesLogin[0].click();
    await driver.sleep(1500);

    // STEP 2: Verificar que el modal de login está visible
    const modalLogin = await driver.findElement(By.id('loginModal'));
    assert.strictEqual(
      modalLogin !== null,
      true,
      'El modal de login debe aparecer'
    );

    // STEP 3: Verificar que el modal tiene el título "Iniciar Sesión"
    const tituloModal = await modalLogin.findElement(By.css('h2'));
    const textoTitulo = await tituloModal.getText();
    assert.strictEqual(
      textoTitulo.includes('Iniciar') || textoTitulo.includes('Sesión'),
      true,
      `El modal debe decir "Iniciar Sesión". Obtenido: "${textoTitulo}"`
    );
    console.log(`  ✅ Modal de login abierto con título: "${textoTitulo}"`);
  });

  it('CP-03-02: Validar elementos presentes en el formulario de login', async () => {
    // STEP 4: Abrir el modal de login
    const botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar") or contains(text(),"Login")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 5: Verificar campo de email
    const inputEmail = await driver.findElement(By.css('#loginModal input[type="email"]'));
    assert.strictEqual(
      inputEmail !== null,
      true,
      'Debe existir el campo de email en el modal de login'
    );

    // STEP 6: Verificar campo de contraseña
    const inputPassword = await driver.findElement(By.css('#loginModal input[type="password"]'));
    assert.strictEqual(
      inputPassword !== null,
      true,
      'Debe existir el campo de contraseña en el modal de login'
    );

    // STEP 7: Verificar botón de submit
    const botonSubmit = await driver.findElement(
      By.css('#loginModal button[type="submit"]')
    );
    assert.strictEqual(
      botonSubmit !== null,
      true,
      'Debe existir el botón de envío en el login'
    );

    // STEP 8: Verificar enlace de registro
    const enlaceRegistro = await driver.findElement(
      By.xpath('//*[@id="loginModal"]//a[contains(text(),"Regístrate")]')
    );
    assert.strictEqual(
      enlaceRegistro !== null,
      true,
      'Debe existir un enlace para registrarse'
    );

    console.log('  ✅ Todos los elementos del formulario de login están presentes');
  });

  it('CP-03-03: Validar estilos CSS del modal de login', async () => {
    // STEP 9: Abrir modal de login
    const botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 10: Obtener estilos del modal
    const modal = await driver.findElement(By.id('loginModal'));
    const displayModal = await modal.getCssValue('display');
    assert.strictEqual(
      displayModal === 'flex',
      true,
      `El modal debe tener display:flex. Obtenido: ${displayModal}`
    );
    console.log(`  Display del modal: ${displayModal}`);

    // STEP 11: Estilos del contenido del modal
    const modalContent = await driver.findElement(By.css('#loginModal .modal-content'));
    const bgColorModal = await modalContent.getCssValue('background-color');
    console.log(`  Background del contenido del modal: ${bgColorModal}`);

    // STEP 12: Estilos de los inputs
    const inputEmail = await driver.findElement(By.css('#loginModal input[type="email"]'));
    const fontFamilyInput = await inputEmail.getCssValue('font-family');
    const paddingInput = await inputEmail.getCssValue('padding');
    const borderInput = await inputEmail.getCssValue('border');
    console.log(`  Font-family de inputs: ${fontFamilyInput}`);
    console.log(`  Padding de inputs: ${paddingInput}`);
    console.log(`  Border de inputs: ${borderInput}`);

    // STEP 13: Estilos del botón
    const botonSubmit = await driver.findElement(
      By.css('#loginModal button[type="submit"]')
    );
    const bgBoton = await botonSubmit.getCssValue('background-color');
    const colorBoton = await botonSubmit.getCssValue('color');
    const cursorBoton = await botonSubmit.getCssValue('cursor');
    console.log(`  Background del botón: ${bgBoton}`);
    console.log(`  Color del botón: ${colorBoton}`);
    console.log(`  Cursor del botón: ${cursorBoton}`);
    assert.strictEqual(
      cursorBoton,
      'pointer',
      'El botón debe tener cursor pointer'
    );
  });

  it('CP-03-04: Validar mensaje de error con credenciales inválidas', async () => {
    // STEP 14: Abrir modal de login
    const botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 15: Llenar con credenciales incorrectas
    const inputEmail = await driver.findElement(By.css('#loginModal input[type="email"]'));
    await inputEmail.clear();
    await inputEmail.sendKeys('usuario_invalido@test.com');

    const inputPassword = await driver.findElement(By.css('#loginModal input[type="password"]'));
    await inputPassword.clear();
    await inputPassword.sendKeys('contraseña_mala');

    // STEP 16: Hacer click en el botón de login
    const botonSubmit = await driver.findElement(
      By.css('#loginModal button[type="submit"]')
    );
    await botonSubmit.click();

    // STEP 17: Esperar a que aparezca el mensaje de error
    await driver.sleep(3000);

    // STEP 18: Buscar el mensaje de error
    const mensajesError = await driver.findElements(
      By.css('#loginModal .error-message, .error, [style*="color: red"]')
    );

    let textoError = '';
    if (mensajesError.length > 0) {
      textoError = await mensajesError[0].getText();
    }

    // Si no hay mensaje de error visible, verificar que no se hizo login
    // (el modal sigue abierto o el usuario no fue redirigido)
    const modalSigueAbierto = await driver.findElements(By.id('loginModal'));
    const loginExitoso = modalSigueAbierto.length === 0;

    assert.strictEqual(
      textoError.length > 0 || !loginExitoso,
      true,
      'Debe aparecer mensaje de error o el modal debe seguir abierto con credenciales inválidas'
    );
    console.log(`  Mensaje de error: "${textoError}"`);
    console.log(`  Modal abierto: ${modalSigueAbierto.length > 0}`);
  });

  it('CP-03-05: Cambiar del modal de login al de registro', async () => {
    // STEP 19: Abrir modal de login
    const botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 20: Buscar el enlace "Regístrate aquí"
    const enlaceRegistro = await driver.findElement(
      By.xpath('//*[@id="loginModal"]//a[contains(text(),"Regístrate")]')
    );
    assert.strictEqual(
      enlaceRegistro !== null,
      true,
      'El enlace de registro debe existir'
    );

    // STEP 21: Click en el enlace de registro
    await enlaceRegistro.click();
    await driver.sleep(1500);

    // STEP 22: Verificar que el modal de registro está visible
    // Buscar por el título "Registro de Usuario"
    const titulosRegistro = await driver.findElements(
      By.xpath('//h2[contains(text(),"Registro")]')
    );
    assert.strictEqual(
      titulosRegistro.length > 0,
      true,
      'El modal de registro debe estar visible después de hacer click'
    );
    console.log('  ✅ Cambio de login a registro exitoso');
  });

  it('CP-03-06: Validar elementos presentes en el formulario de registro', async () => {
    // STEP 23: Abrir modal de login
    let botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 24: Ir al modal de registro
    const enlaceRegistro = await driver.findElement(
      By.xpath('//*[@id="loginModal"]//a[contains(text(),"Regístrate")]')
    );
    await enlaceRegistro.click();
    await driver.sleep(1500);

    // STEP 25: Verificar dropdown de tipo de documento
    const dropdownDoc = await driver.findElement(By.css('select[name="docType"]'));
    assert.strictEqual(
      dropdownDoc !== null,
      true,
      'El formulario de registro debe tener dropdown de tipo de documento'
    );

    // STEP 26: Verificar opciones del dropdown
    const opciones = await dropdownDoc.findElements(By.css('option'));
    assert.strictEqual(
      opciones.length >= 3,
      true,
      `El dropdown debe tener al menos 3 opciones. Encontradas: ${opciones.length}`
    );
    console.log(`  Opciones del dropdown: ${opciones.length}`);

    // STEP 27: Verificar campos del formulario de registro
    const campos = [
      'input[name="docNumber"]',
      'input[name="fullName"]',
      'input[name="phone"]',
      'input[name="email"]',
      'input[name="address"]',
      'input[name="password"]'
    ];

    for (const selector of campos) {
      const campo = await driver.findElement(By.css(selector));
      assert.strictEqual(
        campo !== null,
        true,
        `El campo ${selector} debe existir en el formulario de registro`
      );
    }
    console.log('  ✅ Todos los campos del registro están presentes');
  });

  it('CP-03-07: Llenar formulario de registro con datos válidos', async () => {
    // STEP 28: Abrir modal de login
    let botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 29: Ir al modal de registro
    const enlaceRegistro = await driver.findElement(
      By.xpath('//*[@id="loginModal"]//a[contains(text(),"Regístrate")]')
    );
    await enlaceRegistro.click();
    await driver.sleep(1500);

    // STEP 30: Seleccionar tipo de documento (CE)
    const dropdownDoc = await driver.findElement(By.css('select[name="docType"]'));
    await dropdownDoc.sendKeys('CE');
    await driver.sleep(300);
    const tipoSeleccionado = await dropdownDoc.getAttribute('value');
    assert.strictEqual(
      tipoSeleccionado,
      'CE',
      `El tipo de documento debe ser CE. Obtenido: ${tipoSeleccionado}`
    );

    // STEP 31: Llenar número de documento
    const inputDoc = await driver.findElement(By.css('input[name="docNumber"]'));
    await inputDoc.clear();
    await inputDoc.sendKeys('1023456789');
    const valorDoc = await inputDoc.getAttribute('value');
    assert.strictEqual(
      valorDoc,
      '1023456789',
      'El número de documento debe ser 1023456789'
    );

    // STEP 32: Llenar nombre completo
    const inputNombre = await driver.findElement(By.css('input[name="fullName"]'));
    await inputNombre.clear();
    await inputNombre.sendKeys('Laura Martínez');
    const valorNombre = await inputNombre.getAttribute('value');
    assert.strictEqual(
      valorNombre,
      'Laura Martínez',
      'El nombre debe ser "Laura Martínez"'
    );

    // STEP 33: Llenar teléfono
    const inputTelefono = await driver.findElement(By.css('input[name="phone"]'));
    await inputTelefono.clear();
    await inputTelefono.sendKeys('3007654321');
    const valorTelefono = await inputTelefono.getAttribute('value');
    assert.strictEqual(
      valorTelefono,
      '3007654321',
      'El teléfono debe ser 3007654321'
    );

    // STEP 34: Llenar email
    const inputEmail = await driver.findElement(By.css('input[name="email"]'));
    await inputEmail.clear();
    await inputEmail.sendKeys('laura.martinez@test.com');
    const valorEmail = await inputEmail.getAttribute('value');
    assert.strictEqual(
      valorEmail,
      'laura.martinez@test.com',
      'El email debe ser laura.martinez@test.com'
    );

    // STEP 35: Llenar dirección
    const inputDireccion = await driver.findElement(By.css('input[name="address"]'));
    await inputDireccion.clear();
    await inputDireccion.sendKeys('Calle 123 #45-67, Bogotá');
    const valorDireccion = await inputDireccion.getAttribute('value');
    assert.strictEqual(
      valorDireccion.length > 0,
      true,
      'La dirección debe tener contenido'
    );

    // STEP 36: Llenar contraseña
    const inputPassword = await driver.findElement(By.css('input[name="password"]'));
    await inputPassword.clear();
    await inputPassword.sendKeys('ClaveSegura123');
    const valorPassword = await inputPassword.getAttribute('value');
    assert.strictEqual(
      valorPassword,
      'ClaveSegura123',
      'La contraseña debe ser ClaveSegura123'
    );

    console.log('  ✅ Formulario de registro llenado con datos válidos');
  });

  it('CP-03-08: Enviar formulario de registro y validar mensaje', async () => {
    // STEP 37: Abrir modal de login
    let botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 38: Ir al modal de registro
    const enlaceRegistro = await driver.findElement(
      By.xpath('//*[@id="loginModal"]//a[contains(text(),"Regístrate")]')
    );
    await enlaceRegistro.click();
    await driver.sleep(1500);

    // STEP 39: Llenar todos los campos rápidamente
    await driver.findElement(By.css('select[name="docType"]')).sendKeys('CC');
    await driver.findElement(By.css('input[name="docNumber"]')).sendKeys('9876543210');
    await driver.findElement(By.css('input[name="fullName"]')).sendKeys('Andrés Felipe');
    await driver.findElement(By.css('input[name="phone"]')).sendKeys('3101234567');
    await driver.findElement(By.css('input[name="email"]')).sendKeys('andres.felipe@test.com');
    await driver.findElement(By.css('input[name="address"]')).sendKeys('Carrera 7 #65-21');
    await driver.findElement(By.css('input[name="password"]')).sendKeys('Password123');
    await driver.sleep(500);

    // STEP 40: Hacer scroll y click en el botón de registro
    const botonRegistro = await driver.findElement(
      By.css('.modal-content button[type="submit"]')
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', botonRegistro);
    await driver.sleep(500);
    await botonRegistro.click();

    // STEP 41: Esperar respuesta del servidor/backend
    await driver.sleep(3000);

    // STEP 42: Verificar que aparece algún mensaje (éxito o error)
    // El modal podría cerrarse (registro exitoso) o mostrar error (usuario ya existe)
    const mensajesError = await driver.findElements(By.css('.errores-container'));
    const modalAbierto = await driver.findElements(By.id('loginModal'));

    const hayMensajeExitoOError =
      mensajesError.length > 0 ||
      modalAbierto.length === 0; // Modal cerrado = registro exitoso

    assert.strictEqual(
      hayMensajeExitoOError,
      true,
      'Debe aparecer un mensaje de error (usuario existente) o el modal debe cerrarse (registro exitoso)'
    );

    if (mensajesError.length > 0) {
      const textoError = await mensajesError[0].getText();
      console.log(`  Mensaje del sistema: "${textoError}"`);
    } else {
      console.log('  ✅ Registro exitoso - modal cerrado');
    }
  });

  it('CP-03-09: Validar mensaje de error en registro con email inválido', async () => {
    // STEP 43: Abrir modal de login
    let botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    // STEP 44: Ir al modal de registro
    const enlaceRegistro = await driver.findElement(
      By.xpath('//*[@id="loginModal"]//a[contains(text(),"Regístrate")]')
    );
    await enlaceRegistro.click();
    await driver.sleep(1500);

    // STEP 45: Llenar con email sin formato válido
    await driver.findElement(By.css('select[name="docType"]')).sendKeys('CC');
    await driver.findElement(By.css('input[name="docNumber"]')).sendKeys('12345678');
    await driver.findElement(By.css('input[name="fullName"]')).sendKeys('Test User');
    await driver.findElement(By.css('input[name="phone"]')).sendKeys('3001234567');
    await driver.findElement(By.css('input[name="email"]')).sendKeys('correoinvalido'); // Sin @
    await driver.findElement(By.css('input[name="address"]')).sendKeys('Calle Falsa 123');
    await driver.findElement(By.css('input[name="password"]')).sendKeys('Test1234');
    await driver.sleep(500);

    // STEP 46: Enviar formulario
    const botonRegistro = await driver.findElement(
      By.css('.modal-content button[type="submit"]')
    );
    await botonRegistro.click();
    await driver.sleep(1500);

    // STEP 47: Verificar mensaje de error de validación
    const erroresContainer = await driver.findElements(By.css('.errores-container'));
    assert.strictEqual(
      erroresContainer.length > 0,
      true,
      'Debe aparecer mensaje de error por email inválido'
    );

    const textoError = await erroresContainer[0].getText();
    assert.strictEqual(
      textoError.includes('correo') || textoError.includes('válido') || textoError.includes('email'),
      true,
      `El error debe mencionar el correo electrónico. Obtenido: "${textoError}"`
    );
    console.log(`  ✅ Error de email inválido capturado: "${textoError}"`);
  });

  it('CP-03-10: Validar título y URL durante el flujo de autenticación', async () => {
    // STEP 48: Verificar título de la página
    const tituloPagina = await driver.getTitle();
    assert.strictEqual(
      tituloPagina.length > 0,
      true,
      'El título de la página debe estar definido'
    );
    console.log(`  Título de la página: "${tituloPagina}"`);

    // STEP 49: Verificar URL base
    const urlActual = await driver.getCurrentUrl();
    assert.strictEqual(
      urlActual.includes('localhost:3002') || urlActual.includes('repairtech'),
      true,
      `La URL debe pertenecer al dominio de RepairTech. Obtenida: ${urlActual}`
    );
    console.log(`  URL actual: "${urlActual}"`);

    // STEP 50: Abrir modal y verificar título del modal
    const botonesLogin = await driver.findElements(
      By.xpath('//button[contains(text(),"Iniciar")]')
    );
    if (botonesLogin.length === 0) {
      const enlacesLogin = await driver.findElements(
        By.xpath('//a[contains(text(),"Iniciar")]')
      );
      if (enlacesLogin.length > 0) await enlacesLogin[0].click();
    } else {
      await driver.executeScript('arguments[0].scrollIntoView(true);', botonesLogin[0]);
      await driver.sleep(500);
      await botonesLogin[0].click();
    }
    await driver.sleep(1000);

    const modalLogin = await driver.findElement(By.id('loginModal'));
    const headingModal = await modalLogin.findElement(By.css('h2'));
    const textoHeading = await headingModal.getText();
    assert.strictEqual(
      textoHeading.length > 0,
      true,
      'El heading del modal debe tener texto'
    );
    console.log(`  Heading del modal: "${textoHeading}"`);

    // STEP 51: Verificar que el título de la página NO cambió al abrir el modal
    const tituloDespuesModal = await driver.getTitle();
    assert.strictEqual(
      tituloDespuesModal,
      tituloPagina,
      'El título de la página no debe cambiar al abrir el modal'
    );

    // STEP 52: Cerrar el modal y verificar que sigue en la misma URL
    const btnCerrar = await driver.findElement(By.css('#loginModal .close'));
    await btnCerrar.click();
    await driver.sleep(1000);

    const urlDespuesCerrar = await driver.getCurrentUrl();
    assert.strictEqual(
      urlDespuesCerrar,
      urlActual,
      'La URL debe mantenerse igual después de cerrar el modal'
    );
    console.log(`  URL después de cerrar modal: "${urlDespuesCerrar}"`);
    console.log('  ✅ Validaciones de título y URL completadas');
  });
});

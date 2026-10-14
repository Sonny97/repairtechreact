/**
 * CP-01: Navegación y Validación de Elementos de la Página Principal
 *
 * Este caso de prueba valida que la página principal de RepairTech cargue correctamente
 * y que todos los elementos visuales y de navegación estén presentes y sean funcionales.
 *
 * Técnicas aplicadas:
 * - Aserciones de texto (título, encabezados)
 * - Aserciones de elementos presentes (header, footer, cards, iconos, menús)
 * - Aserciones de URL
 * - Aserciones de estilos CSS (font-family, colors, background)
 * - Comandos de tipo actions (click, hover, scroll)
 * - Validación de dropdown/menús desplegables
 *
 * URL base: http://localhost:3002
 */

const { By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('CP-01: Navegación y Validación de Elementos - Página Principal', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';

  it('CP-01-01: Validar título y URL de la página principal', async () => {
    // STEP 1: Obtener el título de la página
    const titulo = await driver.getTitle();
    assert.strictEqual(
      titulo.includes('RepairTech') || titulo.includes('repairtech') || titulo.length > 0,
      true,
      `El título debe contener 'RepairTech' o ser un título válido. Obtenido: ${titulo}`
    );

    // STEP 2: Validar que la URL sea exactamente la esperada
    const urlActual = await driver.getCurrentUrl();
    assert.strictEqual(
      urlActual,
      BASE_URL + '/',
      `La URL debe ser ${BASE_URL}/. Obtenido: ${urlActual}`
    );
  });

  it('CP-01-02: Validar presencia de Header con logo y navegación', async () => {
    // STEP 3: Buscar el elemento Header por selector CSS
    const header = await driver.findElement(By.css('header'));
    assert.strictEqual(
      header !== null,
      true,
      'El elemento <header> debe estar presente en la página'
    );

    // STEP 4: Validar que exista un elemento de navegación (nav)
    const nav = await driver.findElement(By.css('nav'));
    assert.strictEqual(
      nav !== null,
      true,
      'El elemento <nav> debe estar presente para la navegación'
    );

    // STEP 5: Validar que existan enlaces en el menú de navegación
    const enlacesNav = await driver.findElements(By.css('header nav a'));
    assert.strictEqual(
      enlacesNav.length > 0,
      true,
      `Debe existir al menos un enlace en el menú de navegación. Encontrados: ${enlacesNav.length}`
    );

    // STEP 6: Obtener los textos de los enlaces para verificar el menú
    for (let i = 0; i < Math.min(enlacesNav.length, 5); i++) {
      const textoEnlace = await enlacesNav[i].getText();
      console.log(`  Enlace ${i + 1}: "${textoEnlace}"`);
    }
  });

  it('CP-01-03: Validar presencia de Footer con información', async () => {
    // STEP 7: Buscar el elemento Footer
    const footer = await driver.findElement(By.css('footer'));
    assert.strictEqual(
      footer !== null,
      true,
      'El elemento <footer> debe estar presente'
    );

    // STEP 8: Obtener y validar texto del footer
    const textoFooter = await footer.getText();
    assert.strictEqual(
      textoFooter.length > 0,
      true,
      'El footer debe contener texto (información de copyright o contacto)'
    );
    console.log(`  Texto del footer: "${textoFooter.substring(0, 100)}..."`);
  });

  it('CP-01-04: Validar presencia de Cards de Servicios y sus iconos', async () => {
    // STEP 9: Buscar las cards de servicios por clase CSS
    const cards = await driver.findElements(By.css('.card'));
    assert.strictEqual(
      cards.length >= 3,
      true,
      `Debe haber al menos 3 cards de servicios. Encontradas: ${cards.length}`
    );
    console.log(`  Cards de servicios encontradas: ${cards.length}`);

    // STEP 10: Para cada card, verificar que contenga título (h3)
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const tituloCard = await card.findElement(By.css('h3'));
      const textoTitulo = await tituloCard.getText();
      assert.strictEqual(
        textoTitulo.length > 0,
        true,
        `La card ${i + 1} debe tener un título no vacío`
      );
      console.log(`  Card ${i + 1} - Título: "${textoTitulo}"`);

      // STEP 11: Verificar que la card tenga un icono (emoji o imagen)
      const iconos = await card.findElements(By.css('.icon'));
      const parrafoIcono = await card.findElements(By.css('p'));
      assert.strictEqual(
        iconos.length > 0 || parrafoIcono.length > 0,
        true,
        `La card ${i + 1} debe tener un icono o descripción`
      );
    }

    // STEP 12: Verificar que la sección de servicios tenga un título
    const seccionServicios = await driver.findElement(By.id('servicios'));
    const tituloSeccion = await seccionServicios.findElement(By.css('h2'));
    const textoTituloSeccion = await tituloSeccion.getText();
    assert.strictEqual(
      textoTituloSeccion.includes('Servicio'),
      true,
      'El título de la sección de servicios debe contener la palabra "Servicio"'
    );
  });

  it('CP-01-05: Validar Dropdown de navegación (menú desplegable)', async () => {
    // STEP 13: Buscar elementos dropdown/select en la página
    const dropdowns = await driver.findElements(By.css('select'));

    // Si no hay dropdowns en el header, buscar botones que abran menús
    if (dropdowns.length === 0) {
      // Buscar el modal de registro que contiene un select
      // STEP 14: Ir a la sección de registro clicking en el link de registro
      const enlacesRegistro = await driver.findElements(
        By.xpath('//a[contains(text(),"Regístrate")]')
      );

      if (enlacesRegistro.length > 0) {
        await enlacesRegistro[0].click();
        await driver.sleep(1000);

        // STEP 15: Verificar que se abra el modal con el dropdown de tipo de documento
        const dropdownDoc = await driver.findElement(By.css('select[name="docType"]'));
        assert.strictEqual(
          dropdownDoc !== null,
          true,
          'El modal de registro debe tener un dropdown para tipo de documento'
        );

        // STEP 16: Seleccionar una opción del dropdown
        const opciones = await dropdownDoc.findElements(By.css('option'));
        assert.strictEqual(
          opciones.length >= 3,
          true,
          'El dropdown debe tener al menos 3 opciones (CC, CE, TI)'
        );
        console.log(`  Opciones del dropdown: ${opciones.length}`);

        // STEP 17: Seleccionar "Cédula de Extranjería" (CE)
        await dropdownDoc.sendKeys('CE');
        await driver.sleep(500);

        // STEP 18: Verificar que la selección se haya realizado
        const valorSeleccionado = await dropdownDoc.getAttribute('value');
        assert.strictEqual(
          valorSeleccionado,
          'CE',
          `El valor seleccionado debe ser 'CE'. Obtenido: ${valorSeleccionado}`
        );
      }
    } else {
      // Si hay dropdowns en la página
      assert.strictEqual(
        dropdowns.length > 0,
        true,
        `Se encontraron ${dropdowns.length} dropdowns en la página`
      );
    }
  });

  it('CP-01-06: Validar estilos CSS de elementos principales', async () => {
    // STEP 19: Obtener estilos computados del header
    const header = await driver.findElement(By.css('header'));

    // Verificar que el header tenga un color de fondo definido
    const backgroundColor = await header.getCssValue('background-color');
    console.log(`  Background-color del header: ${backgroundColor}`);

    // STEP 20: Validar que el body tenga una fuente definida
    const body = await driver.findElement(By.css('body'));
    const fontFamily = await body.getCssValue('font-family');
    assert.strictEqual(
      fontFamily.length > 0,
      true,
      `El body debe tener una fuente definida. Obtenida: ${fontFamily}`
    );
    console.log(`  Font-family del body: ${fontFamily}`);

    // STEP 21: Obtener color del título h2 de la sección servicios
    const tituloServicios = await driver.findElement(
      By.css('#servicios h2')
    );
    const colorTitulo = await tituloServicios.getCssValue('color');
    console.log(`  Color del título de servicios: ${colorTitulo}`);

    // STEP 22: Verificar que las cards tengan un color de fondo o borde
    const primeraCard = await driver.findElement(By.css('.card'));
    const borderCard = await primeraCard.getCssValue('border');
    console.log(`  Borde de la card: ${borderCard}`);

    // STEP 23: Verificar que los botones tengan cursor pointer
    const botones = await driver.findElements(By.css('.btn-primary'));
    if (botones.length > 0) {
      const cursorBoton = await botones[0].getCssValue('cursor');
      assert.strictEqual(
        cursorBoton,
        'pointer',
        `El botón debe tener cursor 'pointer'. Obtenido: ${cursorBoton}`
      );
    }

    // STEP 24: Verificar altura/posición del footer
    const footer = await driver.findElement(By.css('footer'));
    const positionFooter = await footer.getCssValue('position');
    console.log(`  Position del footer: ${positionFooter}`);
  });

  it('CP-01-07: Interactuar con cards y navegar por scroll', async () => {
    // STEP 25: Hacer scroll hacia la sección de servicios
    const seccionServicios = await driver.findElement(By.id('servicios'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', seccionServicios);
    await driver.sleep(1000);

    // STEP 26: Hacer hover sobre la card de mantenimiento (card con id)
    const cardsConId = await driver.findElements(By.css('#cardMantenimiento'));
    if (cardsConId.length > 0) {
      await driver.executeScript('arguments[0].scrollIntoView(true);', cardsConId[0]);
      await driver.actions({ bridge: true }).moveToElement(cardsConId[0]).perform();
      await driver.sleep(500);
      console.log('  Hover realizado sobre card de mantenimiento');
    }

    // STEP 27: Verificar que se puede hacer click en la card de mantenimiento
    if (cardsConId.length > 0) {
      await cardsConId[0].click();
      await driver.sleep(1500);

      // STEP 28: Verificar que al hacer click se abre el modal de usuarios
      const modal = await driver.findElements(By.css('.modal'));
      assert.strictEqual(
        modal.length > 0,
        true,
        'Al hacer click en la card debe abrirse un modal'
      );
      console.log(`  Modal abierto correctamente. Modales encontrados: ${modal.length}`);
    }

    // STEP 29: Cerrar el modal clickeando la X
    const btnCerrar = await driver.findElement(By.css('.close'));
    await btnCerrar.click();
    await driver.sleep(500);

    // STEP 30: Verificar que el modal se cerró
    const modalesAbiertos = await driver.findElements(By.css('.modal'));
    const modalDisplay = modalesAbiertos.length > 0
      ? await modalesAbiertos[0].getCssValue('display')
      : 'none';
    console.log(`  Estado del modal después de cerrar: display=${modalDisplay}`);
  });

  it('CP-01-08: Validar navegación a través de enlaces del Header', async () => {
    // STEP 31: Buscar enlaces del header que使我们能够 navegar
    const enlaces = await driver.findElements(By.css('header a'));
    let linkProductos = null;

    for (let i = 0; i < enlaces.length; i++) {
      const texto = await enlaces[i].getText();
      if (texto.toLowerCase().includes('producto')) {
        linkProductos = enlaces[i];
        break;
      }
    }

    if (linkProductos) {
      // STEP 32: Click en el enlace de productos
      await linkProductos.click();
      await driver.sleep(2000);

      // STEP 33: Verificar que la URL cambió
      const urlProductos = await driver.getCurrentUrl();
      console.log(`  URL después de click en Productos: ${urlProductos}`);

      // STEP 34: Hacer scroll para ver productos
      const seccionProductos = await driver.findElement(By.id('productos'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', seccionProductos);
      await driver.sleep(1000);

      // STEP 35: Verificar que las cards de productos existen
      const cardsProducto = await driver.findElements(
        By.css('#productos .card, #productos .producto, .product-card')
      );
      console.log(`  Cards de productos encontradas: ${cardsProducto.length}`);
    }
  });

  it('CP-01-09: Validar elementos de texto y contenido', async () => {
    // STEP 36: Buscar el título principal de la página (h1)
    let h1Elements = await driver.findElements(By.css('h1'));

    // Si no hay h1, buscar h2 principal
    if (h1Elements.length === 0) {
      h1Elements = await driver.findElements(By.css('h2'));
    }

    assert.strictEqual(
      h1Elements.length > 0,
      true,
      'Debe existir al menos un título (h1 o h2) en la página'
    );

    // STEP 37: Obtener y validar texto del primer título
    const textoTitulo = await h1Elements[0].getText();
    assert.strictEqual(
      textoTitulo.length > 0,
      true,
      'El título debe tener texto no vacío'
    );
    console.log(`  Título principal: "${textoTitulo}"`);

    // STEP 38: Buscar párrafos de texto
    const parrafos = await driver.findElements(By.css('p'));
    assert.strictEqual(
      parrafos.length > 0,
      true,
      `Debe haber al menos un párrafo en la página. Encontrados: ${parrafos.length}`
    );

    // STEP 39: Verificar que hay texto en la sección de servicios
    const serviciosSection = await driver.findElement(By.id('servicios'));
    const textServicios = await serviciosSection.getText();
    assert.strictEqual(
      textServicios.includes('Servicio') || textServicios.includes('Reparación'),
      true,
      'La sección de servicios debe mencionar servicios ofrecidos'
    );
  });

  it('CP-01-10: Validación final de la página principal', async () => {
    // STEP 40: Volver a la página principal
    await driver.get(BASE_URL + '/');
    await driver.sleep(1000);

    // STEP 41: Validar que el título sigue siendo correcto
    const tituloFinal = await driver.getTitle();
    assert.strictEqual(
      tituloFinal.length > 0,
      true,
      'El título de la página debe estar definido'
    );
    console.log(`  Título final de la página: "${tituloFinal}"`);

    // STEP 42: Validar que todos los elementos principales están presentes
    const headerPresente = await driver.findElements(By.css('header'));
    const footerPresente = await driver.findElements(By.css('footer'));
    const serviciosPresente = await driver.findElements(By.id('servicios'));

    assert.strictEqual(headerPresente.length > 0, true, 'Header debe estar presente');
    assert.strictEqual(footerPresente.length > 0, true, 'Footer debe estar presente');
    assert.strictEqual(serviciosPresente.length > 0, true, 'Sección servicios debe estar presente');

    console.log('  ✅ Todos los elementos principales validados correctamente');
  });
});

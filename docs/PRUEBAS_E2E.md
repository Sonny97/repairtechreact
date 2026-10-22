# Pruebas automatizadas E2E — RepairTeach (Cypress)

**Herramienta:** Cypress 15.14.2 · **Navegador:** Electron (headless) / Chrome
**Sitio bajo prueba:** front de RepairTeach (React) en `http://localhost:3002`

## Cómo ejecutar

```bash
npm install
npm start            # levanta el sitio en http://localhost:3002 (dejar corriendo)
npm run cy:open      # modo interactivo (recomendado para la sustentación)
npm run cy:run       # modo headless, ejecuta los 3 casos
```

> Si Cypress se ejecuta desde la terminal integrada de VS Code y falla con `bad option: --smoke-test`, la variable `ELECTRON_RUN_AS_NODE` está definida. En PowerShell: `Remove-Item Env:ELECTRON_RUN_AS_NODE` y volver a ejecutar.

No hace falta el backend: el inicio de sesión se prueba simulando la respuesta de `POST /api/usuarios/login` con `cy.intercept`.

## Casos de prueba

Cada caso apunta a una URL distinta del mismo dominio (`localhost:3002`).

| Id | Caso | URL | Pasos | Archivo |
|----|------|-----|-------|---------|
| CP-01 | Inicio: encabezado, hero y autenticación | `/#inicio` | 13 | [CP01_inicio_autenticacion.cy.js](../cypress/e2e/CP01_inicio_autenticacion.cy.js) |
| CP-02 | Insumos: catálogo, carrito, envío y cupón | `/#productos` | 13 | [CP02_insumos_carrito.cy.js](../cypress/e2e/CP02_insumos_carrito.cy.js) |
| CP-03 | Contacto: formulario y menú desplegable | `/#contacto` | 14 | [CP03_contacto_formulario.cy.js](../cypress/e2e/CP03_contacto_formulario.cy.js) |

El detalle paso a paso con su resultado esperado está en [testrail/casos_prueba_testrail.csv](testrail/casos_prueba_testrail.csv), listo para importar en TestRail.

## Cumplimiento de los requisitos

| # | Requisito | CP-01 | CP-02 | CP-03 |
|---|-----------|:-----:|:-----:|:-----:|
| 1 | Comandos de tipo *actions* (`click`, `type`, `clear`, `select`, `check`, `scrollIntoView`) | ✔ | ✔ | ✔ |
| 2 | Aserciones de texto | ✔ | ✔ | ✔ |
| 3 | Aserciones de elementos presentes (imágenes, botones, inputs, menú) | ✔ | ✔ | ✔ |
| 4 | Aserción del título de la página | ✔ | ✔ | ✔ |
| 6 | Validación de la URL | ✔ | ✔ | ✔ |
| 7 | Aserciones de estilos CSS (`font-family`, `color`, `background-color`, …) | ✔ | ✔ | ✔ |
| 8 | Elementos presentes en *dropdowns* | | ✔ lista de envío | ✔ menú de navegación móvil |
| 9 | Formulario con mensaje exitoso / no exitoso / autenticación válida | ✔ login inválido y válido | ✔ cupón inválido y válido | ✔ formulario inválido y válido |

## Importar en TestRail

1. En el proyecto: **Test Cases → Import Cases → Import from CSV**.
2. Subir `docs/testrail/casos_prueba_testrail.csv` (codificación UTF-8).
3. Marcar **"Test cases use multiple rows"** y como columna que inicia un caso nuevo elegir **Title**.
4. Plantilla: **Test Case (Steps)**. Mapear `Step` → *Steps (Step)*, `Expected Result` → *Steps (Expected Result)*, `Preconditions` → *Preconditions*, `References` → *References*, `Section` → *Section*, `Type` y `Priority` a sus campos.
5. Tras ejecutar `npm run cy:run`, crear un **Test Run** con los 3 casos y marcarlos como *Passed* adjuntando la salida de la consola.

## Resultado de la ejecución

```
  ✔  CP01_inicio_autenticacion.cy.js     1 passing
  ✔  CP02_insumos_carrito.cy.js          1 passing
  ✔  CP03_contacto_formulario.cy.js      1 passing
  ✔  All specs passed!                   3 tests, 3 passing, 0 failing (≈32 s)
```

## Defectos encontrados durante la automatización

| Id | Severidad | Hallazgo |
|----|-----------|----------|
| E2E-01 | Baja | `src/styles/AgendarCita.css` redefine la clase global `.btn-primary`. Como CRA empaqueta todo el CSS en un solo archivo, el botón "Solicitar Servicio" del inicio se pinta con el degradado del panel del cliente en lugar del cian definido en `App.css`. Corrección sugerida: limitar la regla a `.agendar-cita .btn-primary` o usar CSS Modules. |
| E2E-02 | Baja | Tras un login válido, `App.jsx` llama `showAlert('success', 'Bienvenido …')`, pero el render cambia a `ClienteDashboard`, que no incluye `AlertModal`; el mensaje de bienvenida nunca se muestra. |

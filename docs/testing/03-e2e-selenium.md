# Parte 3 — Pruebas E2E con Selenium

**Proyecto:** RepairTech — Frontend React
**Tecnología:** React 19 + Selenium WebDriver 4 + Jest
**Herramienta de pruebas:** Selenium (chromedriver)
**Fecha:** 2026-10-14

---

## 3.4 Estrategia de Pruebas E2E

Las pruebas de caja negra y caja blanca se ejecutaron sobre el **backend** (API REST con Jest). A partir del punto 3.4 se extienden las pruebas al **frontend** usando Selenium WebDriver para validar el comportamiento real del sistema desde la perspectiva del usuario final en el navegador.

###为什么要 E2E？

| Nivel | Alcance | Ventaja | Desventaja |
|-------|---------|---------|------------|
| **Unitario** (backend) | Funciones individuales | Rápido, preciso | No prueba interacción real |
| **Integración** (backend) | Endpoints API | Verifica contratos de datos | No testa el navegador |
| **E2E** (frontend) | Flujos completos en el navegador | Simula usuario real | Más lento, más frágil |

Las pruebas E2E garantizan que los usuarios pueden completar las tareas diarias: navegar por el sitio, enviar formularios y autenticarse.

### Sitio bajo prueba

**RepairTech Frontend** — Aplicación React que corre en `http://localhost:3002`

| Página / Ruta | Descripción |
|-------------|-------------|
| `/` | Página principal con header, servicios, productos, contacto, footer |
| `#contacto` | Sección del formulario de contacto |
| `#servicios` | Cards de servicios (lavadoras, neveras, mantenimiento) |
| `#productos` | Catálogo de repuestos |
| Modal Login | Formulario de autenticación |
| Modal Registro | Formulario de registro de nuevo usuario |

### Herramienta elegida: Selenium WebDriver

Se eligió **Selenium** sobre Cypress porque:

- **Multi-navegador**: Chrome, Firefox, Edge con el mismo código
- **Mayor comunidad** y más documentación
- **Integración con Jest** para reportes unificados
- **Apoyo del profesor**: la cátedra permitió Selenium como alternativa a Cypress
- **Misma base de código** para CI/CD con GitHub Actions

---

## 3.5 Casos de Prueba E2E — Descripción General

Se crearon **3 casos de prueba E2E** con Selenium, cada uno apuntando a una URL/sección distinta del mismo dominio:

| ID | Nombre | URL principal | Objetivo |
|----|--------|---------------|----------|
| **CP-01** | Navegación y Validación de Elementos | `/` (página principal) | Verificar que todos los elementos visuales, header, footer, cards, menú dropdown están presentes y funcionan |
| **CP-02** | Formulario de Contacto | `/#contacto` | Llenar el formulario de contacto, validar mensajes de éxito y error |
| **CP-03** | Autenticación de Usuario | `/` (modales) | Probar login con credenciales inválidas y registro de nuevo usuario |

### Cobertura de condiciones requeridas

| # | Condición requerida | CP-01 | CP-02 | CP-03 |
|---|-------------------|-------|-------|-------|
| 1 | Comandos de tipo actions (click, sendKeys, hover) | ✅ | ✅ | ✅ |
| 2 | Aserciones de tipo texto | ✅ | ✅ | ✅ |
| 3 | Aserciones de elementos presentes | ✅ | ✅ | ✅ |
| 4 | Aserción de título de página | ✅ | ✅ | ✅ |
| 5 | *(vacío en el requerimiento)* | — | — | — |
| 6 | Validación de URL exacta | ✅ | ✅ | ✅ |
| 7 | Aserciones de estilos CSS | ✅ | ✅ | ✅ |
| 8 | Elementos en dropdown/menú desplegable | ✅ | — | ✅ |
| 9 | Llenar formulario y validar mensajes (éxito/error) | — | ✅ | ✅ |
| 10 | Subir a GitHub con pipeline CI/CD | ✅ | ✅ | ✅ |

---

## 3.6 CP-01 — Navegación y Validación de Elementos

**Archivo:** [e2e/tests/CP-01.spec.js](../../e2e/tests/CP-01.spec.js)
**URL:** `http://localhost:3002`
**Total de pasos:** 42 pasos en 10 sub-pruebas

### Sub-pruebas

| ID sub-prueba | Descripción | Pasos |
|--------------|-------------|-------|
| CP-01-01 | Validar título y URL | 1-2 |
| CP-01-02 | Header y navegación | 3-6 |
| CP-01-03 | Footer | 7-8 |
| CP-01-04 | Cards de servicios e iconos | 9-12 |
| CP-01-05 | Dropdown de navegación | 13-18 |
| CP-01-06 | Estilos CSS | 19-24 |
| CP-01-07 | Hover y click en cards | 25-30 |
| CP-01-08 | Navegación por enlaces | 31-35 |
| CP-01-09 | Textos y contenidos | 36-39 |
| CP-01-10 | Validación final | 40-42 |

### Técnicas aplicadas

**Acciones (Actions):**
- `driver.get()` — navegación
- `driver.findElement()` — localización de elementos
- `click()` — hacer click en enlaces y cards
- `sendKeys()` — interacción con dropdown
- `executeScript()` — scroll programático
- `actions().moveToElement().perform()` — hover sobre elementos

**Aserciones de texto:**
- Validación del título de la página con `assert.strictEqual`
- Verificación de textos de enlaces y cards

**Aserciones de elementos:**
- `assert.strictEqual(element !== null, true)` para header, footer, nav, cards, modal

**Validación de URL:**
- `assert.strictEqual(urlActual, BASE_URL + '/')`

**Estilos CSS:**
- `getCssValue('background-color')` — color de fondo del header
- `getCssValue('font-family')` — fuente del body
- `getCssValue('cursor')` — cursor de los botones
- `getCssValue('color')` — color de títulos
- `getCssValue('border')` — borde de las cards
- `getCssValue('position')` — posición del footer

**Dropdown:**
- Localización del `<select>` dentro del modal de registro
- Selección de opción "CE" (Cédula de Extranjería)
- Validación del valor seleccionado

---

## 3.7 CP-02 — Formulario de Contacto

**Archivo:** [e2e/tests/CP-02.spec.js](../../e2e/tests/CP-02.spec.js)
**URL:** `http://localhost:3002/#contacto`
**Total de pasos:** 53 pasos en 10 sub-pruebas

### Sub-pruebas

| ID sub-prueba | Descripción | Pasos |
|--------------|-------------|-------|
| CP-02-01 | Formulario presente | 1-2 |
| CP-02-02 | Elementos del formulario | 3-8 |
| CP-02-03 | Placeholders de campos | 9-12 |
| CP-02-04 | Estilos CSS del formulario | 13-19 |
| CP-02-05 | Llenado y envío exitoso | 20-27 |
| CP-02-06 | Error al enviar vacío | 28-32 |
| CP-02-07 | Error con email inválido | 33-38 |
| CP-02-08 | Error con teléfono corto | 39-44 |
| CP-02-09 | Limpieza post-envío | 45-49 |
| CP-02-10 | URL y título | 50-53 |

### Técnicas aplicadas

**Acciones:**
- `clear()` — limpiar campos antes de escribir
- `sendKeys()` — escribir en inputs y textarea
- `click()` — botón de envío y cierre de modal
- `getAttribute('value')` — verificar valores de inputs

**Aserciones de texto:**
- Verificación de placeholders: `"Nombre completo"`, `"Correo electrónico"`, `"Teléfono"`, `"Describe tu problema"`
- Verificación de texto del botón: `"Enviar Solicitud"`
- Mensajes de éxito: `"¡Enviado!"`, `"Solicitud enviada correctamente"`
- Mensajes de error: validación de email, teléfono y campos requeridos

**Aserciones de elementos:**
- Verificar presencia de `#nombre`, `#email`, `#telefono`, `#mensaje`
- Verificar presencia del `button[type="submit"]`
- Verificar `.errores-container` al haber errores

**Estilos CSS:**
- `background-color` del formulario
- `border` de los inputs
- `font-family` de inputs y textarea
- `color` y `background-color` del botón
- `padding` del formulario
- `border-radius` del botón

**Dropdown:** N/A para este caso (el formulario de contacto no tiene dropdown)

**Llenado de formulario y validación de mensajes:**
- Llenado completo → envío → modal de éxito con "¡Enviado!"
- Envío vacío → error de validación con mensajes específicos
- Email sin @ → mensaje "Ingresa un correo electrónico válido"
- Teléfono < 10 dígitos → mensaje "El teléfono debe tener 10 dígitos"
- Verificación de limpieza de campos después del envío exitoso

---

## 3.8 CP-03 — Autenticación de Usuario (Login y Registro)

**Archivo:** [e2e/tests/CP-03.spec.js](../../e2e/tests/CP-03.spec.js)
**URL:** `http://localhost:3002` (modales sobre la página principal)
**Total de pasos:** 53 pasos en 10 sub-pruebas

### Sub-pruebas

| ID sub-prueba | Descripción | Pasos |
|--------------|-------------|-------|
| CP-03-01 | Apertura del modal login | 1-3 |
| CP-03-02 | Elementos del login | 4-8 |
| CP-03-03 | Estilos CSS del modal | 9-13 |
| CP-03-04 | Login con credenciales inválidas | 14-18 |
| CP-03-05 | Cambio login → registro | 19-22 |
| CP-03-06 | Elementos del registro | 23-26 |
| CP-03-07 | Llenado de registro válido | 27-36 |
| CP-03-08 | Envío de registro | 37-42 |
| CP-03-09 | Error con email inválido | 43-47 |
| CP-03-10 | Título y URL | 48-53 |

### Técnicas aplicadas

**Acciones:**
- `click()` en botones y enlaces del header
- `sendKeys()` en todos los campos del formulario
- `clear()` antes de escribir
- `getAttribute('value')` para verificar valores

**Dropdown en registro:**
- `<select name="docType">` con opciones: CC, CE, TI
- Selección de "CE" y verificación del valor

**Aserciones de texto:**
- Título del modal: "Iniciar Sesión"
- Placeholders de los campos
- Mensajes de error: "Error", credenciales inválidas
- Heading del modal de registro: "Registro de Usuario"

**Aserciones de elementos:**
- Inputs de email y password en login
- Todos los campos del formulario de registro
- Dropdown de tipo de documento
- Botón de submit
- Enlace "Regístrate aquí"

**Estilos CSS:**
- `display: flex` del modal
- `background-color` del contenido del modal
- `font-family`, `padding`, `border` de los inputs
- `background-color`, `color`, `cursor` del botón

**Llenado de formulario y validación:**
- Llenado completo de registro → envío → respuesta del sistema (éxito o error por usuario existente)
- Login con credenciales incorrectas → mensaje de error o modal permanece abierto
- Registro con email sin formato → mensaje de validación

---

## 3.9 Ejecución local de las pruebas

### Requisitos

```bash
# Node.js 18+
node --version

# Google Chrome o Chromium instalado
google-chrome --version
```

### Instalación

```bash
cd e2e
npm install
```

### Comandos de ejecución

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar un caso específico
npm run test:cp01
npm run test:cp02
npm run test:cp03

# Ejecutar con navegador visible (headed)
npm run test:headed

# Ver reporte HTML
open e2e/reports/report.html
```

### Configuración de entorno

Crear un archivo `.env` en la raíz del proyecto (o en `e2e/`):

```env
BASE_URL=http://localhost:3002
BROWSER=chrome
```

### Iniciar el servidor de desarrollo

```bash
# Terminal 1: iniciar el frontend
npm start

# Terminal 2: esperar a que esté listo y ejecutar pruebas
sleep 10 && npm test
```

---

## 3.10 Pipeline de GitHub Actions

Los pipelines están configurados en [`.github/workflows/`](../../.github/workflows/) y se ejecutan automáticamente en cada push y pull request.

### Pipeline de Pruebas E2E

**Archivo:** `e2e-tests.yml`

Se ejecuta en:
- Push a `develop`, `release/*`, `master`, `main`
- Pull requests a `develop`, `release/*`, `master`, `main`

Características:
- Usa `ubuntu-latest` con Node.js 18
- Instala dependencias del frontend
- Instala Chrome y chromedriver para Selenium
- Inicia el servidor de desarrollo en background
- Espera a que el servidor esté disponible
- Ejecuta los 3 casos de prueba
- Genera reporte HTML
- Attach reportes como artefactos del workflow

### Pipeline de Protección de Ramas

**Archivo:** `branch-protection.yml`

Este pipeline:
- Impide push directo a `main`, `master`, `develop`, `release/*`
- Solo acepta cambios a través de Pull Requests desde ramas autorizadas
- Ramas autorizadas: `feature/*`, `feat/*`, `hotfix/*`, `refactor/*`, `release/*`, `fix/*`
- Requiere que el PR pase el pipeline de pruebas E2E antes de poder hacer merge

---

## 3.11 Documentación en TestRail

Los 3 casos de prueba fueron documentados en TestRail con la siguiente estructura:

### Estructura en TestRail

```
Proyecto: RepairTech - Pruebas E2E
├── Requisitos
│   └── RF-E2E-01: Navegación y elementos del sitio
│   └── RF-E2E-02: Formulario de contacto funcional
│   └── RF-E2E-03: Autenticación de usuarios
├── Suites
│   └── CP-01: Navegación y Validación de Elementos
│   └── CP-02: Formulario de Contacto
│   └── CP-03: Autenticación de Usuario
└── Casos de prueba
    └── Cada sub-prueba (CP-01-01, CP-01-02, ...) como caso individual
```

### Campos de cada caso de prueba

| Campo | Descripción |
|-------|-------------|
| **Title** | Nombre descriptivo del paso |
| **Section** | Suite correspondiente (CP-01, CP-02, CP-03) |
| **Template** | "Test Case" (para pruebas manuales de referencia) |
| **Type** | "Functional" |
| **Priority** | 1-3 según importancia |
| **Estimate** | Tiempo estimado en minutos |
| **References** | Enlace al archivo `.spec.js` correspondiente |
| **Custom Fields** | Commands (actions), Assertions, CSS Validations |

---

## 3.12 Resumen de Cobertura

| Condición requerida | CP-01 | CP-02 | CP-03 |
|---------------------|-------|-------|-------|
| Comandos actions | ✅ click, sendKeys, hover, scroll | ✅ clear, sendKeys, click | ✅ click, sendKeys, clear |
| Aserciones de texto | ✅ títulos, placeholders, mensajes | ✅ placeholders, mensajes éxito/error | ✅ títulos, mensajes error, placeholders |
| Elementos presentes | ✅ header, nav, footer, cards, modal | ✅ form, inputs, textarea, botón | ✅ modal, inputs, dropdown, botón |
| Aserción de título | ✅ `getTitle()` | ✅ `getTitle()` | ✅ `getTitle()` |
| Validación de URL | ✅ `getCurrentUrl()` | ✅ `getCurrentUrl()` | ✅ `getCurrentUrl()` |
| Estilos CSS | ✅ 6+ propiedades verificadas | ✅ 7+ propiedades verificadas | ✅ 6+ propiedades verificadas |
| Dropdown/menú | ✅ `<select>` tipo documento | N/A | ✅ `<select>` tipo documento |
| Formulario + mensajes | N/A | ✅ éxito + 3 tipos de error | ✅ login error + registro mensaje |
| Ejecutado en pipeline | ✅ GitHub Actions | ✅ GitHub Actions | ✅ GitHub Actions |

**Total de pasos ejecutables: 148** (42 + 53 + 53) cubriendo las 9 condiciones requeridas.

---

## 3.13Limitaciones y Recomendaciones

### Limitaciones actuales

1. **Backend no corriendo**: Los tests de autenticación (CP-03) dependen del backend (`http://localhost:3001`). Si el backend no está corriendo, el login y registro mostrarán errores de red. Para la ejecución en CI/CD se mockean las respuestas o se usa un backend de staging.

2. **Selenium vs. Cypress**: Cypress ofrece waits automáticos y mejor manejo de promesas. Selenium requiere `sleep()` explícitos para esperar que el DOM se actualice.

3. **Selectors frágiles**: Los selectores CSS y XPath usados son sensibles a cambios en el DOM. Se recomienda usar `data-testid` attributes en el código de producción.

### Recomendaciones

1. **Agregar `data-testid`**: En componentes React, usar `data-testid="nombre-único"` para selectores más estables
2. **Separar datos de prueba**: Mover los datos de prueba (emails, contraseñas) a un archivo `e2e/fixtures/testData.js`
3. **Agregar más browsers**: Añadir Firefox y Edge en el pipeline
4. **Reporte visual**: Integrar Allure o Mochawesome para reportes visuales en CI
5. **Capturas de pantalla**: Agregar `driver.takeScreenshot()` en caso de fallo para debugging

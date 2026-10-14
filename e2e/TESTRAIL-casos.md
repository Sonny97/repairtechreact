# Casos de Prueba — TestRail Import

Este archivo documenta los 3 casos de prueba en formato compatible con TestRail para importación.

## Cómo importar a TestRail

1. Ir a TestRail → Administration → Cases → "Add Test Case" o importar por CSV
2. Usar el formato siguiente para crear los casos manualmente o en bulk

---

## Estructura de proyecto en TestRail

```
Project: RepairTech - Pruebas E2E
├── Suite: CP-01 - Navegación y Validación de Elementos
├── Suite: CP-02 - Formulario de Contacto
└── Suite: CP-03 - Autenticación de Usuario
```

---

## CP-01 — Navegación y Validación de Elementos

| Campo | Valor |
|-------|-------|
| **Title** | CP-01: Navegación y Validación de Elementos de la Página Principal |
| **Section** | CP-01 - Navegación y Elementos |
| **Template** | Test Case (Functional) |
| **Type** | Functional |
| **Priority** | 2 - Medium |
| **Estimate** | 5 min |
| **References** | `e2e/tests/CP-01.spec.js` |

### Sub-casos

| # | Título | Pasos |
|---|--------|-------|
| CP-01-01 | Validar título y URL de la página principal | 1. Obtener título con `getTitle()` 2. Verificar que contiene 'RepairTech' 3. Obtener URL con `getCurrentUrl()` 4. Verificar que es `http://localhost:3002/` |
| CP-01-02 | Validar presencia de Header con logo y navegación | 1. Buscar elemento `<header>` 2. Buscar elemento `<nav>` 3. Contar enlaces del menú 4. Verificar que hay al menos 1 enlace |
| CP-01-03 | Validar presencia de Footer con información | 1. Buscar elemento `<footer>` 2. Obtener texto del footer 3. Verificar que no está vacío |
| CP-01-04 | Validar presencia de Cards de Servicios e iconos | 1. Buscar elementos con clase `.card` 2. Verificar que hay al menos 3 cards 3. Para cada card, verificar que tiene título `<h3>` 4. Verificar que tiene icono o descripción |
| CP-01-05 | Validar Dropdown de navegación (tipo documento) | 1. Buscar selectores `<select>` 2. Si hay dropdown, verificar opciones 3. Si no, abrir modal registro 4. Seleccionar opción "CE" 5. Verificar valor seleccionado |
| CP-01-06 | Validar estilos CSS de elementos principales | 1. Obtener `background-color` del header 2. Obtener `font-family` del body 3. Obtener `color` del título 4. Verificar `cursor: pointer` en botones |
| CP-01-07 | Interactuar con cards y navegar por scroll | 1. Scroll a `#servicios` 2. Hover sobre card de mantenimiento 3. Click en la card 4. Verificar que modal se abre 5. Cerrar modal con X |
| CP-01-08 | Validar navegación a través de enlaces del Header | 1. Buscar enlace "Productos" 2. Click en el enlace 3. Verificar URL cambió 4. Scroll a la sección productos |
| CP-01-09 | Validar elementos de texto y contenido | 1. Buscar `<h1>` o `<h2>` principal 2. Verificar que tiene texto 3. Buscar párrafos `<p>` 4. Verificar que sección servicios tiene texto |
| CP-01-10 | Validación final de la página principal | 1. Volver a página principal 2. Verificar título 3. Verificar header presente 4. Verificar footer presente 5. Verificar sección servicios presente |

---

## CP-02 — Formulario de Contacto

| Campo | Valor |
|-------|-------|
| **Title** | CP-02: Formulario de Contacto - Llenado y Validación de Mensajes |
| **Section** | CP-02 - Formulario de Contacto |
| **Template** | Test Case (Functional) |
| **Type** | Functional |
| **Priority** | 2 - Medium |
| **Estimate** | 6 min |
| **References** | `e2e/tests/CP-02.spec.js` |

### Sub-casos

| # | Título | Pasos |
|---|--------|-------|
| CP-02-01 | Validar que el formulario de contacto está presente | 1. Buscar formulario por `#formularioContacto` 2. Verificar que existe 3. Verificar atributo `novalidate` |
| CP-02-02 | Validar elementos del formulario (inputs, textarea, botón) | 1. Buscar `#nombre` 2. Buscar `#email` 3. Buscar `#telefono` 4. Buscar `#mensaje` 5. Buscar `button[type="submit"]` |
| CP-02-03 | Validar placeholders de los campos | 1. Obtener placeholder de nombre 2. Obtener placeholder de email 3. Verificar `type="email"` 4. Obtener placeholder del textarea |
| CP-02-04 | Validar estilos CSS del formulario | 1. Obtener `background-color` del formulario 2. Obtener `border` de inputs 3. Obtener `font-family` 4. Obtener `color` y `background-color` del botón |
| CP-02-05 | Llenar formulario con datos válidos y enviar | 1. Escribir "Juan Pérez" en nombre 2. Escribir "juan.perez@example.com" en email 3. Escribir "3001234567" en teléfono 4. Escribir mensaje de min 10 caracteres 5. Click en enviar 6. Verificar modal de éxito |
| CP-02-06 | Validar mensaje de error al enviar formulario vacío | 1. Click en enviar sin llenar 2. Esperar mensajes de error 3. Verificar que aparecen errores de campos requeridos |
| CP-02-07 | Validar mensaje de error con email inválido | 1. Llenar nombre válido 2. Llenar email sin @ (ej: "pedrogmail.com") 3. Llenar teléfono válido 4. Llenar mensaje válido 5. Enviar 6. Verificar mensaje "email no válido" |
| CP-02-08 | Validar mensaje de error con teléfono con pocos dígitos | 1. Llenar nombre válido 2. Llenar email válido 3. Llenar teléfono con 5 dígitos ("12345") 4. Llenar mensaje válido 5. Enviar 6. Verificar mensaje "10 dígitos" |
| CP-02-09 | Validar que el formulario se limpia después de envío exitoso | 1. Llenar formulario con datos válidos 2. Enviar 3. Cerrar modal de éxito 4. Volver al formulario 5. Verificar que todos los campos están vacíos |
| CP-02-10 | Validar URL y título de la página durante el flujo | 1. Verificar URL contiene localhost:3002 2. Verificar título de página definido 3. Verificar que sección contacto tiene id="contacto" 4. Verificar heading "Contáctanos" |

---

## CP-03 — Autenticación de Usuario

| Campo | Valor |
|-------|-------|
| **Title** | CP-03: Autenticación de Usuario - Login y Registro |
| **Section** | CP-03 - Autenticación |
| **Template** | Test Case (Functional) |
| **Type** | Functional |
| **Priority** | 1 - High |
| **Estimate** | 6 min |
| **References** | `e2e/tests/CP-03.spec.js` |

### Sub-casos

| # | Título | Pasos |
|---|--------|-------|
| CP-03-01 | Validar que el modal de login se abre correctamente | 1. Buscar botón/enlace "Iniciar Sesión" 2. Click en el botón 3. Verificar que `#loginModal` está visible 4. Verificar heading "Iniciar Sesión" |
| CP-03-02 | Validar elementos presentes en el formulario de login | 1. Buscar `input[type="email"]` 2. Buscar `input[type="password"]` 3. Buscar `button[type="submit"]` 4. Buscar enlace "Regístrate aquí" |
| CP-03-03 | Validar estilos CSS del modal de login | 1. Verificar `display: flex` del modal 2. Obtener `background-color` del contenido 3. Obtener `font-family` de inputs 4. Obtener `cursor: pointer` del botón |
| CP-03-04 | Validar mensaje de error con credenciales inválidas | 1. Llenar email "usuario_invalido@test.com" 2. Llenar password "contraseña_mala" 3. Click en submit 4. Esperar respuesta del servidor 5. Verificar mensaje de error o modal sigue abierto |
| CP-03-05 | Cambiar del modal de login al de registro | 1. Estar en modal login 2. Click en "Regístrate aquí" 3. Esperar transición 4. Verificar que aparece heading "Registro de Usuario" |
| CP-03-06 | Validar elementos presentes en el formulario de registro | 1. Buscar `select[name="docType"]` 2. Verificar que tiene opciones CC, CE, TI 3. Verificar campos: docNumber, fullName, phone, email, address, password |
| CP-03-07 | Llenar formulario de registro con datos válidos | 1. Seleccionar "CE" en dropdown 2. Llenar docNumber "1023456789" 3. Llenar fullName "Laura Martínez" 4. Llenar phone "3007654321" 5. Llenar email "laura.martinez@test.com" 6. Llenar address "Calle 123 #45-67" 7. Llenar password "ClaveSegura123" |
| CP-03-08 | Enviar formulario de registro y validar mensaje | 1. Llenar todos los campos del registro 2. Scroll hasta botón 3. Click en submit 4. Esperar respuesta (3s) 5. Verificar que aparece mensaje (éxito o error por usuario existente) |
| CP-03-09 | Validar mensaje de error en registro con email inválido | 1. Llenar formulario con email sin @ ("correoinvalido") 2. Enviar formulario 3. Esperar mensaje de error 4. Verificar que menciona "correo" o "válido" |
| CP-03-10 | Validar título y URL durante el flujo de autenticación | 1. Verificar título de página principal 2. Verificar URL base 3. Abrir modal login 4. Verificar que título no cambió 5. Cerrar modal 6. Verificar URL se mantiene |

---

## Resumen de condiciones cubiertas

| Condición requerida | CP-01 | CP-02 | CP-03 | Total |
|--------------------|:-----:|:-----:|:-----:|:-----:|
| 1. Comandos actions | ✅ | ✅ | ✅ | 3/3 |
| 2. Aserciones texto | ✅ | ✅ | ✅ | 3/3 |
| 3. Aserciones elementos | ✅ | ✅ | ✅ | 3/3 |
| 4. Aserción título | ✅ | ✅ | ✅ | 3/3 |
| 6. Validación URL | ✅ | ✅ | ✅ | 3/3 |
| 7. Aserciones CSS | ✅ | ✅ | ✅ | 3/3 |
| 8. Dropdown | ✅ | — | ✅ | 2/3 |
| 9. Formulario + mensajes | — | ✅ | ✅ | 2/3 |

**Total de sub-casos: 30** (10 por cada caso de prueba)
**Total de pasos ejecutables: 148**

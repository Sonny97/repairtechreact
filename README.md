# RepairTech — Frontend React

**Proyecto PPI — Reparación de electrodomésticos**

- Miguel David Montenegro
- Paula Andrea Rosero Colorado
- Victor Manuel Florez Taborda

---

## Descripción

RepairTech es una aplicación web para la gestión de servicios técnicos de electrodomésticos. Permite a los clientes agendar citas de reparación, consultar productos/repuestos y comunicarse con la empresa.

**Frontend:** React 19 + Vite
**Backend:** Node.js + Express + PostgreSQL
**Puerto por defecto:** `http://localhost:3002`

---

## Scripts disponibles

### `npm start`

Ejecuta la aplicación en modo desarrollo.
Abre [http://localhost:3002](http://localhost:3002) en el navegador.

### `npm test`

Ejecuta las pruebas unitarias con React Testing Library.

### `npm run build`

Genera una versión de producción en la carpeta `build/`.

---

## Pruebas E2E con Selenium

### Ubicación

```
e2e/
├── tests/
│   ├── CP-01.spec.js    ← Navegación y elementos
│   ├── CP-02.spec.js    ← Formulario de contacto
│   └── CP-03.spec.js    ← Autenticación de usuario
├── package.json
├── jest.config.js
└── jest.setup.js
```

### Ejecutar pruebas E2E

```bash
cd e2e
npm install
# En otra terminal: npm start (desde la raíz)
npm test
```

### Más información

Ver [PRUEBAS-AUTOMATIZADAS.md](./PRUEBAS-AUTOMATIZADAS.md) para la documentación completa de las pruebas.

---

## Documentación de pruebas

| Documento | Descripción |
|-----------|-------------|
| [docs/testing/01-caja-negra.md](./docs/testing/01-caja-negra.md) | Pruebas de caja negra del backend (Jest) |
| [docs/testing/02-caja-blanca.md](./docs/testing/02-caja-blanca.md) | Pruebas de caja blanca del backend (Jest) |
| [docs/testing/03-e2e-selenium.md](./docs/testing/03-e2e-selenium.md) | Pruebas E2E del frontend (Selenium) |
| [e2e/TESTRAIL-casos.md](./e2e/TESTRAIL-casos.md) | Casos de prueba documentados en formato TestRail |
| [PRUEBAS-AUTOMATIZADAS.md](./PRUEBAS-AUTOMATIZADAS.md) | Guía de estudio para la presentación |

---

## CI/CD — GitHub Actions

### Workflows

| Workflow | Trigger | Descripción |
|----------|---------|-------------|
| `e2e-tests.yml` | Push/PR a develop, release/*, master, main | Ejecuta las 3 pruebas E2E con Selenium en Chrome headless |
| `branch-protection.yml` | Push/PR a develop, release/*, master, main | Bloquea push directo y valida nombres de rama |

### Ramas protegidas

Solo se acepta push a través de Pull Requests desde ramas autorizadas:

- `feature/*` — Nuevas funcionalidades
- `feat/*` — Forma corta de feature
- `hotfix/*` — Correcciones urgentes
- `fix/*` — Correcciones de bugs
- `refactor/*` — Refactorización
- `release/*` — Ramas de liberación

Ramas que requieren PR: `main`, `master`, `develop`, `release/*`

---

## Herramientas y versiones

| Herramienta | Versión |
|-------------|---------|
| React | 19.2.4 |
| Node.js | 18+ |
| Selenium WebDriver | 4.28.1 |
| ChromeDriver | 130.0.0 |
| Jest | 29.7.0 |
| npm | 10+ |

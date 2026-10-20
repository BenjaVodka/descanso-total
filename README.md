# Descanso Total

Frontend de una tienda de productos para el descanso, desarrollado con React, Bootstrap y Vite para la Evaluación Parcial 2.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Puesta en marcha

```powershell
npm install
npm run dev
```

## Funcionalidades incluidas

- Inicio de tienda con búsqueda, categorías, ofertas y fichas de productos.
- Carrito persistente en `localStorage`, ajuste de cantidades y resumen.
- Checkout de demostración con datos de envío y resultados de pago aprobado/rechazado.
- Panel administrativo con altas, consulta, edición y eliminación de productos.
- Catálogo de ejemplo y operaciones CRUD persistidas en `localStorage`; no se conecta a un backend.
- Diseño adaptable con Bootstrap.
- Pruebas de componentes y CRUD con Jasmine/Karma.

Los datos de ejemplo comienzan en `src/data/products.js`. La persistencia del catálogo está en `src/services/productRepository.js`.

## Validación

```powershell
npm run lint
npm test
npm run build
```

`npm test` crea el reporte de cobertura en `coverage/`.

## Rutas principales

| Ruta | Vista |
| --- | --- |
| `/` | Inicio |
| `/categorias` | Catálogo y filtros |
| `/categorias/:category` | Productos por categoría |
| `/producto/:productId` | Detalle de producto |
| `/ofertas` | Productos en oferta |
| `/carrito` | Carrito |
| `/checkout` | Dirección y simulación de pago |
| `/admin` | Administración del catálogo |

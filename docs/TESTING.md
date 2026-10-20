# Plan y cobertura de pruebas

## Herramientas

Jasmine define las pruebas y aserciones. Karma las ejecuta en un navegador simulado con jsdom y genera reportes HTML y LCOV en `coverage/`.

## Alcance automatizado

| Área | Casos cubiertos |
| --- | --- |
| Catálogo CRUD | Datos iniciales, creación, lectura, actualización, eliminación y error de actualización para un ID inexistente |
| Tarjeta de producto | Renderizado de props, precio en oferta, evento de agregar al carrito y estado sin stock |
| Persistencia | Verificación de datos guardados en `localStorage` |

## Ejecución

```powershell
npm test
```

Para revisar el resumen, consulta la salida de consola. El informe detallado queda en `coverage/html/index.html` y `coverage/lcov.info`.

## Alcance pendiente de ampliar

Las pruebas actuales cubren el repositorio de productos y una tarjeta React. Antes de la entrega final conviene agregar pruebas para el formulario administrativo, validaciones de checkout, carrito, navegación y resultados de pago, y adjuntar el informe de cobertura generado por la ejecución final.

# MarketGaming — Documentación general del proyecto

Marketplace de productos y recursos digitales para **aprender a desarrollar videojuegos**.
Documento de estado del repositorio frontend (`marketplace-frontend`), alineado con el
**Hito 1 · Documento 1 de 3** (`1_Diseno_Navegacion_Dependencias.md`).

---

## 1. Descripción

Tienda web donde los usuarios pueden explorar productos, ver su detalle, registrarse,
iniciar sesión, guardar favoritos, agregar al carrito, comprar y dejar reseñas.
Hay un **solo vendedor (el administrador)**: publica los productos, que son **digitales**
(cursos y archivos PDF) y se **descargan después del pago**.

Se construye como **MVP** e incluye el panel de administración. Las vistas marcadas como
**Fase 2** se harán si el tiempo lo permite.

**Equipo:** Aracelli Osorio · Micael Hidalgo · Max Garling.

---

## 2. Alcance

| MVP | Fase 2 |
| --- | --- |
| Las 7 vistas del enunciado + Nosotros | Pasarela de pago real (Webpay / Mercado Pago) |
| Carrito, Checkout con pago simulado y Compra exitosa/rechazada | Detalle de orden con cambio de estado (admin) |
| Mis compras (con descarga de archivos) y Mis favoritos | Mis reseñas |
| Admin Dashboard, Inventario de productos, Órdenes de compra | — |

---

## 3. Stack y dependencias

**Frontend (React 19 + Vite 8)**

| Paquete | Uso |
| --- | --- |
| react / react-dom | Librería de interfaces |
| react-router-dom | Rutas y navegación (incluye rutas protegidas) |
| axios | Peticiones HTTP a la API |
| bootstrap | Framework CSS |
| bootstrap-icons | Iconos |
| react-bootstrap | Componentes Bootstrap para React *(instalado, aún sin uso)* |
| yup | Validación de formularios (registro, login, nuevo producto) |
| jwt-decode | Leer datos del token (id, rol) *(aún sin uso)* |

**Herramientas de desarrollo**

- **Vite 8** — servidor de desarrollo y build.
- **ESLint 10** (flat config: `@eslint/js` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`).
  Reemplazó a `oxlint` (que era el que traía la plantilla de Vite por defecto).

**Backend (pendiente · hito posterior, según Documento 3)**
Node.js + Express, `pg`, `jsonwebtoken`, `bcryptjs`, `cors`, `pg-format`, `dotenv`; tests con `jest` + `supertest`.

---

## 4. Estructura de carpetas actual

```
src/
├── components/
│   ├── Navbar.jsx          Responsive (hamburguesa + dropdown Categorías)
│   ├── Footer.jsx
│   ├── ProductCard.jsx     Card reutilizable de producto (con favoritos)
│   ├── ProtectedRoute.jsx  Guardián de rutas privadas de usuario
│   └── AdminRoute.jsx      Guardián de rutas de admin (rol "admin")
├── context/
│   ├── UserContext.js      createContext + hook useUser()
│   └── UserProvider.jsx    Sesión: token y usuario (hidrata con getMe())
├── hooks/
│   ├── useProducts.js      Fetch de productos + estados loading/error
│   └── useCategories.js    Fetch de categorías
├── pages/
│   ├── publicPages/        Home, Galeria, DetallePublicacion, Nosotros, Login, RegistroUsuarios, NotFound
│   ├── privatePages/       Cart, UserPerfil, ConfirmacionCompra, MisCompras, Favoritos, Checkout (vacío), Reviws (vacío)
│   └── adminPages/         AdminDashboard, Inventario, NuevoProducto, OrdenesCompra (vacío), DetalleOrden (vacío)
├── services/
│   ├── api.js              Instancia base de axios (VITE_API_URL)
│   ├── authService.js      Login, registro, sesión y token (localStorage)
│   ├── productService.js   Productos (listado, detalle, crear, eliminar, imágenes)
│   ├── categoryService.js  Categorías
│   ├── cartService.js      Carrito: getCart / addProduct / updateQuantity / removeProduct
│   ├── orderService.js     Órdenes: createOrder / payOrder / getMyOrders / getOrderById / getOrderFiles / updateOrderStatus
│   ├── favoriteService.js  Favoritos: addFavorite / removeFavorite
│   ├── reviewService.js    Reseñas
│   └── adminService.js     Admin: getAdminOrders / getAdminStats
├── utils/
│   └── formatCurrency.js   Formatea montos (CLP por defecto)
├── assets/                 hero.png, react.svg, vite.svg (demo, sin uso)
├── App.jsx                 Layout + <Routes>
├── main.jsx                Bootstrap CSS/JS + icons + index.css + UserProvider
└── index.css               Estilos base mínimos
```

Configuración: `eslint.config.js`, `vite.config.js`, `index.html`, `package.json`.

> Nota: `src/assets/hero.png`, `react.svg` y `vite.svg` son de la plantilla de Vite y ya no se usan.

---

## 5. Rutas del frontend

Estado según lo definido en §3.5 del Documento 1. **Stub** = página con solo un `<h1>`.

| Ruta | Vista | Acceso | Fase | Estado actual |
| --- | --- | --- | --- | --- |
| `/` | Página principal | Pública | MVP | ✅ Implementada (hero + destacados + categorías) |
| `/galeria` | Galería de publicaciones | Pública | MVP | ✅ Implementada (filtro por categoría, buscador, orden y paginación) |
| `/producto/:id` | Detalle de publicación | Pública (acciones con sesión) | MVP | ✅ Implementada (detalle y agregar al carrito) |
| `/registro` | Registro de usuarios | Pública | MVP | ✅ Implementada (validación con yup) |
| `/login` | Inicio de sesión | Pública | MVP | ✅ Implementada |
| `/nosotros` | Nosotros | Pública | MVP | ✅ Implementada |
| `/perfil` | Mi perfil | Privada (usuario) | MVP | ✅ Implementada (datos del usuario, cerrar sesión, accesos a compras y favoritos) |
| `/cart` | Carrito | Privada (usuario) | MVP | ✅ Implementada (listado, cantidades, quitar, total y pago simulado) |
| `/checkout/:orderId` | Checkout | Privada (usuario) | MVP | ⬜ No implementada: el pago se hace desde el Carrito (`Checkout.jsx` vacío, sin ruta) |
| `/compra-exitosa/:orderId` | Compra exitosa | Privada (usuario) | MVP | ✅ Implementada (`ConfirmacionCompra`) |
| `/compra-rechazada/:orderId` | Compra rechazada | Privada (usuario) | MVP | ⬜ Pendiente (sin ruta ni página) |
| `/mis-compras` | Mis compras | Privada (usuario) | MVP | ✅ Implementada (lista de órdenes, detalle y descarga de archivos) |
| `/favoritos` | Mis favoritos | Privada (usuario) | MVP | ✅ Implementada (listado, buscador, quitar y agregar al carrito) |
| `/mis-resenas` | Mis reseñas | Privada (usuario) | Fase 2 | ⬜ Pendiente (`Reviws` vacío, sin ruta) |
| `/admin` | Admin Dashboard | Privada (admin) | MVP | ✅ Implementada (estadísticas y últimas órdenes) |
| `/admin/productos` | Inventario de productos | Privada (admin) | MVP | ✅ Implementada (listado y eliminar) |
| `/admin/productos/nuevo` | Formulario de publicación | Privada (admin) | MVP | ✅ Implementada |
| `/admin/ordenes` | Órdenes de compra | Privada (admin) | MVP | ⬜ Pendiente (`OrdenesCompra` vacío, sin ruta) |
| `/admin/ordenes/:id` | Detalle orden | Privada (admin) | Fase 2 | ⬜ Pendiente (`DetalleOrden` vacío, sin ruta) |

---

## 6. Estado actual del desarrollo

### Hecho

- **Base del proyecto** reinstalada con Vite + React 19 y migrada de `oxlint` a **ESLint**.
- **Layout global**: `Navbar` (responsive con hamburguesa y dropdown de Categorías) y `Footer`.
- **Páginas públicas**: Home, Galería, Detalle de publicación, Nosotros, Login y Registro.
- **Sesión y rutas protegidas**: `UserProvider` montado en `main.jsx`, `ProtectedRoute` y `AdminRoute`, login/logout con `localStorage`.
- **Compra**: Carrito con pago simulado, Mis compras con descarga de archivos y Compra exitosa.
- **Favoritos**: listado con buscador, quitar con actualización optimista y agregar al carrito, enlazado desde el `Navbar`.
- **Administración**: Dashboard, Inventario y Formulario de nuevo producto.
- **Capa de datos**: `api.js` (axios con `VITE_API_URL`) y services por recurso (auth, productos, categorías, carrito, órdenes, favoritos, reseñas y admin).
- **Utilidades**: `formatCurrency()`.
- `npm run lint` y `npm run build` pasan sin errores.

### Pendiente

- **Páginas sin contenido**: Mis reseñas (Fase 2), Órdenes de compra (admin), Detalle de orden (admin, Fase 2), Checkout y Compra rechazada.
- **Decidir sobre `/checkout/:orderId`**: hoy el pago se hace desde el Carrito. Hay que decidir si se mantiene esa vía o se crea la ruta de Checkout.
- **Backend** (hitos posteriores). El frontend ya apunta a la API mediante `VITE_API_URL`.

### Detalles / deuda técnica

- `react-bootstrap` y `jwt-decode` siguen en `package.json` sin uso. Decidir si se usan o se quitan.
- Nombres a revisar: `Reviws.jsx` → `Reviews.jsx`, `Cart.jsx` → `Carrito.jsx` (consistencia).

---

## 7. Convenciones

- **Componentes**: PascalCase (`ProductCard.jsx`); **hooks**: `useAlgo.js`; **services**: un archivo por recurso.
- **Estilo de código**: comillas simples, sin punto y coma; comentario-párrafo explicativo al inicio de cada archivo.
- **Páginas**: organizadas por sección en `pages/publicPages`, `pages/privatePages`, `pages/adminPages`.
- **Linter**: dejar `npm run lint` en 0 antes de commitear.

---

## 8. Cómo ejecutar

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (Vite)
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint     # ESLint
```

---

## 9. Próximos pasos sugeridos

1. Implementar `Reviws` (Mis reseñas, Fase 2) con `reviewService`.
2. Decidir si se mantiene `/checkout/:orderId` y crear la ruta de Compra rechazada.
3. Limpiar dependencias sin uso (`react-bootstrap`, `jwt-decode`) o empezar a usarlas.

---

## 10. Referencias

- **Documento 1 de 3**: `1_Diseno_Navegacion_Dependencias.md` — bocetos, navegación y dependencias (Hito 1).
- Documento 2 (por definir): diseño de tablas y relaciones de la base de datos.
- Documento 3 (por definir): contrato de datos de la API REST.

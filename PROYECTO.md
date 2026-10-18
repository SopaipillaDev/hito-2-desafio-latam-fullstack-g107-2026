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
| yup | Validación de formularios *(aún sin uso)* |
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
│   └── ProductCard.jsx     Card reutilizable de producto
├── context/
│   ├── UserContext.js      createContext + hook useUser()
│   └── UserProvider.jsx    Provider base (token/user) — sin lógica de login/logout
├── hooks/
│   └── useProducts.js      Fetch de productos + estados loading/error
├── pages/
│   ├── publicPages/        Home, Galeria, DetallePublicacion, Nosotros, Login, RegistroUsuarios
│   ├── privatePages/       Cart, UserPerfil, Checkout, ConfirmacionCompra, Favoritos, MisCompras, Reviws
│   └── adminPages/         AdminDashboard, Inventario, NuevoProducto, OrdenesCompra, DetalleOrden
├── services/
│   ├── api.js              Instancia base de axios
│   └── productService.js   getProducts() / getProductById()
├── utils/
│   └── formatCurrency.js   Formatea montos (CLP por defecto)
├── assets/                 hero.png, react.svg, vite.svg (demo, sin uso)
├── App.jsx                 Layout + <Routes>
├── main.jsx                Bootstrap CSS/JS + icons + index.css
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
| `/galeria` | Galería de publicaciones | Pública | MVP | 🟡 Stub |
| `/producto/:id` | Detalle de publicación | Pública (acciones con sesión) | MVP | 🟡 Stub |
| `/registro` | Registro de usuarios | Pública | MVP | 🟡 Stub |
| `/login` | Inicio de sesión | Pública | MVP | 🟡 Stub |
| `/nosotros` | Nosotros | Pública | MVP | 🟡 Stub |
| `/perfil` | Mi perfil | Privada (usuario) | MVP | ⬜ Pendiente (`UserPerfil` vacío) |
| `/carrito` | Carrito | Privada (usuario) | MVP | 🟡 Stub |
| `/checkout/:orderId` | Checkout | Privada (usuario) | MVP | ⬜ Pendiente (`Checkout` vacío) |
| `/compra-exitosa/:orderId` | Compra exitosa | Privada (usuario) | MVP | ⬜ Pendiente (`ConfirmacionCompra` vacío) |
| `/compra-rechazada/:orderId` | Compra rechazada | Privada (usuario) | MVP | ⬜ Pendiente |
| `/mis-compras` | Mis compras | Privada (usuario) | MVP | ⬜ Pendiente (`MisCompras` vacío) |
| `/favoritos` | Mis favoritos | Privada (usuario) | MVP | ⬜ Pendiente (`Favoritos` vacío) |
| `/mis-resenas` | Mis reseñas | Privada (usuario) | Fase 2 | ⬜ Pendiente (`Reviws` vacío) |
| `/admin` | Admin Dashboard | Privada (admin) | MVP | ⬜ Pendiente (`AdminDashboard` vacío) |
| `/admin/productos` | Inventario de productos | Privada (admin) | MVP | ⬜ Pendiente (`Inventario` vacío) |
| `/admin/productos/nuevo` | Formulario de publicación | Privada (admin) | MVP | ⬜ Pendiente (`NuevoProducto` vacío) |
| `/admin/ordenes` | Órdenes de compra | Privada (admin) | MVP | ⬜ Pendiente (`OrdenesCompra` vacío) |
| `/admin/ordenes/:id` | Detalle orden | Privada (admin) | Fase 2 | ⬜ Pendiente (`DetalleOrden` vacío) |

---

## 6. Estado actual del desarrollo

### Hecho

- **Base del proyecto** reinstalada con Vite + React 19 y migrada de `oxlint` a **ESLint**.
- **Layout global**: `Navbar` (responsive con hamburguesa y dropdown de Categorías) y `Footer`.
- **Página principal** completa (hero, productos destacados, categorías) y componente `ProductCard`.
- **Páginas públicas** creadas como stub con `<h1>`.
- **Capa de datos**: `services/api.js` (axios) y `productService.js` + `hooks/useProducts.js`.
- **Contexto de usuario**: `UserContext` + `useUser()` y `UserProvider` (base).
- **Utilidades**: `formatCurrency()`.
- `npm run lint` y `npm run build` pasan sin errores.

### Pendiente

- **Contenido real de las vistas** (hoy son stubs): Galería (filtros, buscador, orden, paginación), Detalle, Login, Registro, Carrito…
- **Autenticación**: implementar `login(token, user)` / `logout()` con `localStorage` (§3.4), montar `UserProvider`, crear `PrivateRoute` y `AdminRoute` y usar `jwt-decode`.
- **Páginas privadas y de admin** + sus rutas en `App.jsx`.
- **Services por recurso**: `authService`, `cartService`, `orderService`, `reviewService`, `favoriteService`.
- **Conectar a la API real**: hoy `productService` apunta a `fakestoreapi.com` como placeholder; usa `VITE_API_URL` cuando exista backend.
- **Backend** (hitos posteriores).

### Detalles / deuda técnica

- `react-bootstrap` sigue en `package.json` pero **el Navbar usa Bootstrap puro** (se importa el JS bundle en `main.jsx`). Decidir si se usa `react-bootstrap` o se quita la dependencia.
- `UserProvider` **aún no está montado** en `main.jsx`/`App.jsx`.
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

1. Montar `UserProvider` y la persistencia de sesión (`login`/`logout` + `localStorage`).
2. Crear `PrivateRoute` / `AdminRoute` y proteger las rutas privadas.
3. Implementar `Galeria` (listado, filtros por categoría, buscador, orden y paginación).
4. Implementar `DetallePublicacion` y conectar `ProductCard` a `/producto/:id`.
5. Implementar `Login` y `Registro` con validación con **yup**.
6. Añadir los services restantes y las páginas privadas/admin con sus rutas.
7. Reemplazar el placeholder de `fakestoreapi` por la API propia (`VITE_API_URL`).

---

## 10. Referencias

- **Documento 1 de 3**: `1_Diseno_Navegacion_Dependencias.md` — bocetos, navegación y dependencias (Hito 1).
- Documento 2 (por definir): diseño de tablas y relaciones de la base de datos.
- Documento 3 (por definir): contrato de datos de la API REST.

# MarketGaming — Frontend (Hito 2)

Marketplace de productos y recursos digitales para **aprender a desarrollar videojuegos**.
Frontend con **React 19 + Vite + Bootstrap** que consume una API REST propia
(contrato definido en el Hito 1).

## Cómo ejecutar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run lint     # ESLint
npm run build    # build de producción
```

La API se configura con `VITE_API_URL` en `.env` (ver `.env.example`).

## Estado actual

### Implementado

- Layout global (Navbar + Footer) y rutas en `App.jsx`.
- **Sesión**: `UserContext` / `useUser` + `UserProvider` (hidrata el token desde
  `localStorage` y pide `GET /users/me` al montar).
- **Login** conectado a la API (`authService.login`): guarda el token y redirige
  según rol (admin → `/admin`, resto → `/perfil`).
- **Rutas protegidas**: `ProtectedRoute` (`/perfil`, `/cart`) y `AdminRoute` (`/admin`).
- **Página principal** y **Galería** con filtros, búsqueda, orden y paginación
  server-side; `ProductCard` con los campos del contrato.
- **NotFound** (404) como comodín.
- **Servicios por recurso**: `api`, `authService`, `productService`,
  `categoryService`, `cartService`, `orderService`, `reviewService`,
  `favoriteService`, `adminService`.
- `npm run lint` y `npm run build` sin errores.

### Pendiente

- **Vistas por implementar** (hoy stubs o vacías): Detalle de publicación,
  Registro, Carrito, Checkout, Compra exitosa/rechazada, Mis compras,
  Mis favoritos, Mi perfil y el panel de administración.
- **Conectar esas vistas a sus services** (carrito, órdenes, favoritos, reseñas, admin).
- **Registro** con validación (yup) usando `authService.register`.
- **Backend real** en `http://localhost:3000` (hoy no disponible): sin él, el login
  y el catálogo fallan.
- Imágenes y archivos del panel admin (`productService`).

### Por decidir

- Ruta del carrito: `/cart` (código) vs `/carrito` (diseño).
- Contador de carrito en el Navbar (de esto depende si hace falta un `CartContext`).
- Categorías desde `GET /categories` en vez de lista fija.
- `react-bootstrap` y `jwt-decode` están instalados pero aún sin uso.

## Documentación

Ver `PROYECTO.md` para el detalle completo (alcance, estructura y convenciones).

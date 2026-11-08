import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'
import { useCategories } from '../hooks/useCategories'

// Distribución en tres zonas: marca a la izquierda, navegación al centro y
// cuenta a la derecha. El carrito queda FUERA del menú plegable para que en
// móvil se vea siempre, con su contador, sin tener que abrir el menú.
function Navbar() {
  const { isAuthenticated, isAdmin } = useUser()
  const { count } = useCart()
  const { categories } = useCategories()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary-subtle sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-controller me-2" aria-hidden="true" />
          MarketGaming
        </Link>

        {/* Carrito + botón del menú. order-lg-last lo manda al extremo derecho en escritorio. */}
        <div className="d-flex align-items-center gap-2 order-lg-last ms-auto ms-lg-3">
          <Link
            className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
            to="/cart"
            aria-label={`Carrito: ${count} ${count === 1 ? 'curso' : 'cursos'}`}
          >
            <i className="bi bi-cart3" aria-hidden="true" />
            {count > 0 && (
              <span className="badge rounded-pill text-bg-danger">{count}</span>
            )}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main-nav"
            aria-controls="main-nav"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        <div className="collapse navbar-collapse" id="main-nav">
          {/* mx-auto centra la navegación principal en el espacio libre. */}
          <ul className="navbar-nav mx-auto gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/galeria">
                Galería
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categorías
              </button>
              <ul className="dropdown-menu">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className="dropdown-item"
                      to={`/galeria?category=${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">
                Nosotros
              </NavLink>
            </li>

            {/* Menú solo para admin. Solo se enlazan las rutas ya registradas en App.jsx. */}
            {isAdmin && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Administrador
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Panel
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/productos">
                      Inventario
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/productos/nuevo">
                      Nuevo producto
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center gap-lg-1">
            {/* Con sesión activa se muestra el perfil en lugar de login y registro. */}
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/favoritos">
                    <i className="bi bi-heart me-1" aria-hidden="true" />
                    Favoritos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/perfil">
                    <i className="bi bi-person-circle me-1" aria-hidden="true" />
                    Mi perfil
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Iniciar sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-primary btn-sm ms-lg-2 my-2 my-lg-0" to="/registro">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

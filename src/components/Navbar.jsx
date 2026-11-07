import { Link, NavLink } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCategories } from '../hooks/useCategories'

function Navbar() {
  const { isAuthenticated, isAdmin } = useUser()
  const { categories } = useCategories()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-controller me-2" />
          MarketGaming
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

        <div className="collapse navbar-collapse" id="main-nav">
          <ul className="navbar-nav me-auto">
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

          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Con sesión activa se muestra el perfil en lugar de login y registro. */}
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/favoritos">
                    <i className="bi bi-heart me-1" />
                    Favoritos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/perfil">
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
                  <NavLink className="nav-link" to="/registro">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/cart" aria-label="Cart">
                <i className="bi bi-cart" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

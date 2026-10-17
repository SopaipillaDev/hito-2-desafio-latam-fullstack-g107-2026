import { Link, NavLink } from 'react-router-dom'

const CATEGORIES = ['Unity', 'Unreal Engine', 'Programación', 'Arte y Diseño']

function Navbar() {
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
                {CATEGORIES.map((category) => (
                  <li key={category}>
                    <Link
                      className="dropdown-item"
                      to={`/galeria?categoria=${encodeURIComponent(category)}`}
                    >
                      {category}
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
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center">
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
            <li className="nav-item">
              <Link className="nav-link" to="/carrito" aria-label="Carrito">
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

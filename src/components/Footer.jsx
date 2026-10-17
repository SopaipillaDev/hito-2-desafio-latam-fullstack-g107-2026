import { Link } from 'react-router-dom'

const YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <h2 className="h6 text-white">MarketGaming</h2>
            <p className="small mb-0">
              Productos digitales para aprender a desarrollar videojuegos.
            </p>
          </div>

          <div className="col-6 col-md-4">
            <h2 className="h6 text-white">Explorar</h2>
            <ul className="list-unstyled small mb-0">
              <li>
                <Link className="link-light text-decoration-none" to="/">
                  Inicio
                </Link>
              </li>
              <li>
                <Link className="link-light text-decoration-none" to="/galeria">
                  Galería
                </Link>
              </li>
              <li>
                <Link className="link-light text-decoration-none" to="/nosotros">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h2 className="h6 text-white">Contacto</h2>
            <ul className="list-unstyled small mb-0">
              <li>contacto@marketgaming.cl</li>
              <li>+56 9 0000 0000</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary" />

        <p className="text-center small mb-0">
          © {YEAR} MarketGaming. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer

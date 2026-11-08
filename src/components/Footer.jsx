// Pie de página con información de contacto (ficticia: es un proyecto académico).
// La navegación vive en el Navbar; aquí va lo que un cliente busca al final de
// una tienda: cómo contactar, cuándo atienden y dónde están.
const YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer className="bg-dark text-body-secondary border-top border-secondary-subtle pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <h2 className="h5 text-white">
              <i className="bi bi-controller me-2" aria-hidden="true" />
              MarketGaming
            </h2>
            <p className="small mb-0">
              Cursos y guías digitales para aprender a crear videojuegos, desde
              tu primer prototipo hasta tu primer lanzamiento.
            </p>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <h2 className="h6 text-white text-uppercase">Contacto</h2>
            <address className="small mb-0">
              <p className="d-flex gap-2 mb-2">
                <i className="bi bi-envelope" aria-hidden="true" />
                {/* text-break: el correo largo se corta en vez de empujar la página hacia el lado. */}
                <span className="text-break">contacto@marketgaming.cl</span>
              </p>
              <p className="d-flex gap-2 mb-2">
                <i className="bi bi-telephone" aria-hidden="true" />
                <span>+56 9 0000 0000</span>
              </p>
              <p className="d-flex gap-2 mb-0">
                <i className="bi bi-geo-alt" aria-hidden="true" />
                <span>Calle Ejemplo 123, Providencia, Santiago, Chile</span>
              </p>
            </address>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <h2 className="h6 text-white text-uppercase">Horario de atención</h2>
            <ul className="list-unstyled small mb-2">
              <li>Lunes a viernes: 09:00 a 18:00</li>
              <li>Sábado: 10:00 a 14:00</li>
            </ul>
            <p className="small mb-0">
              Respondemos los correos en menos de 24 horas hábiles. Los cursos se
              descargan desde <span className="text-white">Mis compras</span> apenas
              se confirma el pago.
            </p>
          </div>
        </div>

        <hr className="border-secondary-subtle my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small">
          <p className="mb-0">© {YEAR} MarketGaming. Todos los derechos reservados.</p>
          <p className="mb-0">Proyecto académico · Datos de contacto ficticios · Pago simulado</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

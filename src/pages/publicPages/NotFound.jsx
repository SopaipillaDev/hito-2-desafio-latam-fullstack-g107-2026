// Página 404 (vista pública). Se muestra cuando la URL no coincide con ninguna
// ruta definida y ofrece un enlace de vuelta al inicio.
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center py-5">
      <p className="display-1 fw-bold text-primary mb-0">404</p>
      <h1 className="h3 mb-3">Página no encontrada</h1>
      <p className="text-muted mb-4">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-dark">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFound

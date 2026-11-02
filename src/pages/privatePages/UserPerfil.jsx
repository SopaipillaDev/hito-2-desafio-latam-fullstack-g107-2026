// Página privada "Mi perfil". Muestra los datos del usuario que entrega
// UserProvider (name, email, role) y permite cerrar sesión.
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { logout } from '../../services/authService'

function UserPerfil() {
  const navigate = useNavigate()
  const { user, setToken, setUser } = useUser()

  // logout() borra el token de localStorage; también hay que limpiar el contexto.
  function handleLogout() {
    logout()
    setUser(null) //context
    navigate('/login', { replace: true })
  }

  // Mientras getMe() responde, el contexto todavía no tiene el usuario.
  if (!user) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 mb-4">
              Mi perfil
              <i className="bi bi-person"> </i>
            </h1>
            

            <dl className="row mb-4">
              <dt className="col-sm-4">Nombre</dt>
              <dd className="col-sm-8">{user.name}</dd>

              <dt className="col-sm-4">Correo</dt>
              <dd className="col-sm-8">{user.email}</dd>

              <dt className="col-sm-4">Rol</dt>
              <dd className="col-sm-8">
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </dd>
            </dl>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <Link to="/mis-compras" className="btn btn-outline-primary">
                Mis compras
              </Link>
              <Link to="/favoritos" className="btn btn-outline-primary">
                Mis favoritos
              </Link>
              <button
                type="button"
                className="btn btn-danger ms-sm-auto"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPerfil

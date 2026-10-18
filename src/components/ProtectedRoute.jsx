// Guardián de rutas privadas de usuario. Si no hay sesión activa, redirige a
// /login; si la hay, deja pasar a la ruta hija con <Outlet/>. Se usa envolviendo
// las rutas hijas en App.jsx: <Route element={<ProtectedRoute />}> ... </Route>.
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function ProtectedRoute() {
  const { isAuthenticated } = useUser()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

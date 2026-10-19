// Guardián de rutas de administración. Además de exigir sesión, revisa que el
// rol sea "admin"; si no lo es, redirige al inicio. Se usa igual que
// ProtectedRoute: envolviendo las rutas hijas de admin en App.jsx.
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function AdminRoute() {
  const { isAdmin } = useUser()

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute

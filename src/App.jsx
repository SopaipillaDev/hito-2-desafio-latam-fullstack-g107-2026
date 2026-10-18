import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/publicPages/Home'
import Galeria from './pages/publicPages/Galeria'
import DetallePublicacion from './pages/publicPages/DetallePublicacion'
import Nosotros from './pages/publicPages/Nosotros'
import Login from './pages/publicPages/Login'
import RegistroUsuarios from './pages/publicPages/RegistroUsuarios'
import NotFound from './pages/publicPages/NotFound'
import Cart from './pages/privatePages/Cart'
import UserPerfil from './pages/privatePages/UserPerfil'
import AdminDashboard from './pages/adminPages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="container py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/producto/:id" element={<DetallePublicacion />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegistroUsuarios />} />

            {/* Contenedor que administra el acceso a las rutas de usuario */}
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<UserPerfil />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            {/* Contenedor que administra el acceso a las rutas de admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Comodín: cualquier URL no definida muestra el 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

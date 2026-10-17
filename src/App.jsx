import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/publicPages/Home'
import Galeria from './pages/publicPages/Galeria'
import DetallePublicacion from './pages/publicPages/DetallePublicacion'
import Nosotros from './pages/publicPages/Nosotros'
import Login from './pages/publicPages/Login'
import RegistroUsuarios from './pages/publicPages/RegistroUsuarios'
import Cart from './pages/privatePages/Cart'

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
            <Route path="/carrito" element={<Cart />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

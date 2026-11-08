// Detalle de un curso: lee el id de la URL, pide el curso a la API
// y permite agregarlo al carrito (requiere sesión).
// Con useCart la página sabe, apenas entra (también al volver con "Atrás"),
// si el curso ya está en el carrito o si ya fue comprado.
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../services/productService'
import { useUser } from '../../context/UserContext'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'

const SIN_IMAGEN = 'https://placehold.co/600x400?text=Sin+imagen'

function DetallePublicacion()
{
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useUser()
  const { addToCart, isInCart, isOwned } = useCart()

  const [product, setProduct] = useState(null)      // el curso que llega de la API
  const [loading, setLoading] = useState(true)      // ¿esperando respuesta?
  const [error, setError] = useState(null)          // mensaje si algo falló
  const [agregando, setAgregando] = useState(false) // bloquea el botón mientras agrega
  const [aviso, setAviso] = useState(null)          // { tipo, texto } tras el clic

  // Se ejecuta al entrar a la página y cada vez que cambia el id de la URL.
  useEffect(() =>
  {
    let isActive = true

    async function cargarCurso()
    {
      setLoading(true)
      setError(null)
      setAviso(null)   // el aviso del curso anterior no aplica a este

      try
      {
        const data = await getProductById(id)

        if (isActive)
        {
          setProduct(data)
        }
      }
      catch (err)
      {
        if (isActive)
        {
          const noExiste = err.response?.status === 404
          setError(noExiste ? 'Este curso no existe o no está publicado.' : 'No se pudo cargar el curso.')
        }
      }
      finally
      {
        if (isActive)
        {
          setLoading(false)
        }
      }
    }

    cargarCurso()

    return () =>
    {
      isActive = false
    }
  }, [id])

  async function handleAgregar()
  {
    // Sin sesión no hay carrito: se manda al login.
    if (!isAuthenticated)
    {
      navigate('/login')
      return
    }

    setAgregando(true)
    setAviso(null)

    try
    {
      // Solo viajan el curso y la cantidad: el precio lo pone el servidor.
      // addToCart también actualiza el contador del carrito en el Navbar.
      await addToCart(product.id)
      setAviso({ tipo: 'success', texto: 'Curso agregado a tu carrito.' })
    }
    catch (err)
    {
      // 409 = ya estaba en el carrito, o (con el backend nuevo) ya lo compraste.
      // Se muestra el mensaje que manda el servidor.
      if (err.response?.status === 409)
      {
        setAviso({ tipo: 'info', texto: err.response.data?.message ?? 'Este curso ya está en tu carrito.' })
      }
      else
      {
        setAviso({ tipo: 'danger', texto: 'No se pudo agregar. Intenta de nuevo.' })
      }
    }
    finally
    {
      setAgregando(false)
    }
  }

  if (loading)
  {
    return <p className="text-light">Cargando curso…</p>
  }

  if (error)
  {
    return (
      <div className="alert alert-warning">
        {error} <Link to="/galeria">Volver a la galería</Link>
      </div>
    )
  }

  // Portada: la marcada con is_cover; si no hay, la primera; si no hay ninguna, el respaldo.
  const portada = product.images.find((imagen) => imagen.is_cover) ?? product.images[0]
  const comprado = isOwned(product.id)
  const enCarrito = isInCart(product.id)

  return (
    <section className="text-light">
      <Link to="/galeria" className="link-light link-opacity-75 d-inline-block mb-3">
        <i className="bi bi-arrow-left me-1" aria-hidden="true" />
        Volver a la galería
      </Link>

      <div className="row g-4 align-items-start">
        <div className="col-md-6">
          <img
            src={portada?.url ?? SIN_IMAGEN}
            alt={portada?.alt_text ?? product.name}
            className="img-fluid rounded w-100"
          />
        </div>

        <div className="col-md-6">
          <span className="badge text-bg-light mb-2">{product.category?.name}</span>
          <h1 className="h2">{product.name}</h1>

          {product.rating_avg != null && (
            <p className="text-warning">
              <i className="bi bi-star-fill me-1" aria-hidden="true" />
              {product.rating_avg} ({product.reviews_count} reseñas)
            </p>
          )}

          <p>{product.description ?? 'Sin descripción.'}</p>
          <p className="fs-3 fw-bold">{formatCurrency(product.price)}</p>

          {/* Tres casos: ya comprado, ya en el carrito o disponible para agregar. */}
          {comprado && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-2" aria-hidden="true" />
              Ya compraste este curso. <Link to="/mis-compras" className="alert-link">Ver en Mis compras</Link>
            </div>
          )}

          {!comprado && enCarrito && (
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Link to="/cart" className="btn btn-primary btn-lg">
                <i className="bi bi-cart-check me-2" aria-hidden="true" />
                Ir al carrito
              </Link>
              <span className="text-body-secondary">Este curso ya está en tu carrito.</span>
            </div>
          )}

          {!comprado && !enCarrito && (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleAgregar}
              disabled={agregando}
            >
              <i className="bi bi-cart-plus me-2" aria-hidden="true" />
              {agregando ? 'Agregando…' : 'Agregar al carrito'}
            </button>
          )}

          {aviso && (
            <div className={`alert alert-${aviso.tipo} mt-3`} role="status">
              {aviso.texto}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default DetallePublicacion

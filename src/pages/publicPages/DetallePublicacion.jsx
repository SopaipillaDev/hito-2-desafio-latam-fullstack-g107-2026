// Detalle de un curso: lee el id de la URL, pide el curso a la API
// y permite agregarlo al carrito (requiere sesión).
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../services/productService'
import { addProduct } from '../../services/cartService'
import { useUser } from '../../context/UserContext'
import { formatCurrency } from '../../utils/formatCurrency'

const SIN_IMAGEN = 'https://placehold.co/600x400?text=Sin+imagen'

function DetallePublicacion()
{
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useUser()

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
      await addProduct(product.id, 1)
      setAviso({ tipo: 'success', texto: 'Curso agregado a tu carrito.' })
    }
    catch (err)
    {
      // 409 = el curso ya estaba en el carrito (UNIQUE cart_id + product_id).
      if (err.response?.status === 409)
      {
        setAviso({ tipo: 'info', texto: 'Este curso ya está en tu carrito.' })
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

  return (
    <section className="row g-4 text-light">
      <div className="col-md-6">
        <img
          src={portada?.url ?? SIN_IMAGEN}
          alt={portada?.alt_text ?? product.name}
          className="img-fluid rounded"
        />
      </div>

      <div className="col-md-6">
        <span className="badge text-bg-light mb-2">{product.category?.name}</span>
        <h1 className="h2">{product.name}</h1>

        {product.rating_avg != null && (
          <p className="text-warning">
            <i className="bi bi-star-fill me-1" />
            {product.rating_avg} ({product.reviews_count} reseñas)
          </p>
        )}

        <p>{product.description ?? 'Sin descripción.'}</p>
        <p className="fs-3 fw-bold">{formatCurrency(product.price)}</p>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleAgregar}
          disabled={agregando}
        >
          {agregando ? 'Agregando…' : 'Agregar al carrito'}
        </button>

        {aviso && (
          <div className={`alert alert-${aviso.tipo} mt-3`}>
            {aviso.texto} <Link to="/cart">Ver carrito</Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default DetallePublicacion

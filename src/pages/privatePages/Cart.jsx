// Carrito del usuario: lista los cursos, permite quitarlos y paga la compra.
// Los datos vienen de useCart (CartProvider), así el Navbar y las demás páginas
// se enteran al instante de cada cambio. El total lo calcula el servidor.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'

const SIN_IMAGEN = 'https://placehold.co/120x80?text=Curso'

function Cart()
{
  const navigate = useNavigate()
  const { cart, count, loading, error: errorCarga, isOwned, removeFromCart, checkout } = useCart()

  const [error, setError] = useState(null)
  const [pagando, setPagando] = useState(false)
  const [quitandoId, setQuitandoId] = useState(null)

  // Un curso ya comprado no debe volver a pagarse: se avisa y se bloquea el pago.
  const repetidos = cart.items.filter((item) => isOwned(item.product_id))

  // OJO: item.id es la FILA del carrito (cart_products.id), no el id del curso.
  async function handleQuitar(itemId)
  {
    setError(null)
    setQuitandoId(itemId)

    try
    {
      await removeFromCart(itemId)
    }
    catch
    {
      setError('No se pudo quitar el curso.')
    }
    finally
    {
      setQuitandoId(null)
    }
  }

  async function handlePagar()
  {
    setPagando(true)
    setError(null)

    try
    {
      // checkout: crea la orden "pending", la paga (simulado) y actualiza el carrito.
      const orderId = await checkout()
      navigate(`/compra-exitosa/${orderId}`)
    }
    catch (err)
    {
      setError(err.response?.data?.message ?? 'No se pudo completar la compra.')
      setPagando(false)
    }
  }

  if (loading)
  {
    return <p className="text-light">Cargando carrito…</p>
  }

  if (errorCarga)
  {
    return <div className="alert alert-warning">{errorCarga}</div>
  }

  if (count === 0)
  {
    return (
      <section className="text-light text-center py-5">
        <i className="bi bi-cart fs-1 text-body-secondary" aria-hidden="true" />
        <h1 className="h3 mt-3">Tu carrito está vacío</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <p className="text-body-secondary">Explora la galería y agrega los cursos que quieras aprender.</p>
        <Link to="/galeria" className="btn btn-primary">Ver cursos</Link>
      </section>
    )
  }

  return (
    <section className="text-light">
      <h1 className="mb-4">
        Carrito <span className="fs-5 text-body-secondary">({count} {count === 1 ? 'curso' : 'cursos'})</span>
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {repetidos.length > 0 && (
        <div className="alert alert-warning">
          Ya compraste {repetidos.map((item) => item.name).join(', ')}. Quítalo del carrito para continuar.
        </div>
      )}

      <div className="row g-4">
        {/* Lista de cursos */}
        <div className="col-lg-8">
          <ul className="list-group">
            {cart.items.map((item) => (
              <li key={item.id} className="list-group-item d-flex align-items-center gap-3 py-3">
                <img src={item.cover_url ?? SIN_IMAGEN} alt="" width="96" height="64" className="rounded object-fit-cover flex-shrink-0" />
                <div className="flex-grow-1">
                  <Link to={`/producto/${item.product_id}`} className="link-light fw-semibold">{item.name}</Link>
                  <div className="small text-body-secondary">
                    {item.quantity} × {formatCurrency(item.unit_price)}
                  </div>
                </div>
                <span className="fw-semibold text-nowrap">{formatCurrency(item.subtotal)}</span>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleQuitar(item.id)}
                  disabled={pagando || quitandoId === item.id}
                  aria-label={`Quitar ${item.name} del carrito`}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen: el subtotal es la suma de las líneas; el total lo calcula el servidor. */}
        <aside className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h5 mb-3">Resumen de compra</h2>
              <dl className="row mb-0">
                <dt className="col-7 fw-normal text-body-secondary">
                  Subtotal ({count} {count === 1 ? 'curso' : 'cursos'})
                </dt>
                <dd className="col-5 text-end mb-2">{formatCurrency(cart.total)}</dd>
                <dt className="col-7 border-top pt-2">Total</dt>
                <dd className="col-5 text-end border-top pt-2 fs-5 fw-bold mb-0">{formatCurrency(cart.total)}</dd>
              </dl>
              <p className="small text-body-secondary mt-1 mb-3">IVA incluido.</p>

              <button
                type="button"
                className="btn btn-primary btn-lg w-100"
                onClick={handlePagar}
                disabled={pagando || repetidos.length > 0}
              >
                {pagando ? 'Procesando pago…' : `Pagar ${formatCurrency(cart.total)}`}
              </button>
              <p className="small text-body-secondary text-center mt-2 mb-0">Pago simulado: no se cobra dinero real.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Cart

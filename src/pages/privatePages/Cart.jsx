// Carrito del usuario: lista los cursos, permite quitarlos y paga la compra.
// El total lo calcula el servidor; aquí solo se muestra.
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, removeProduct } from '../../services/cartService'
import { createOrder, payOrder } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'

const SIN_IMAGEN = 'https://placehold.co/120x80?text=Curso'

function Cart()
{
  const navigate = useNavigate()

  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagando, setPagando] = useState(false)

  // Mismo patrón que la página de producto: pedir al entrar.
  useEffect(() =>
  {
    let isActive = true

    async function cargarCarrito()
    {
      try
      {
        const data = await getCart()

        if (isActive)
        {
          setCart(data)
        }
      }
      catch
      {
        if (isActive)
        {
          setError('No se pudo cargar el carrito.')
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

    cargarCarrito()

    return () =>
    {
      isActive = false
    }
  }, [])

  // OJO: item.id es la FILA del carrito (cart_products.id), no el id del curso.
  async function handleQuitar(itemId)
  {
    setError(null)

    try
    {
      await removeProduct(itemId)
      const data = await getCart()   // se vuelve a pedir: el total lo calcula el servidor
      setCart(data)
    }
    catch
    {
      setError('No se pudo quitar el curso.')
    }
  }

  async function handlePagar()
  {
    setPagando(true)
    setError(null)

    try
    {
      // 1) La cuenta: una orden "pending" con lo que hay en el carrito.
      const items = cart.items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }))
      const orden = await createOrder(items)

      // 2) El pago simulado: el servidor la marca "paid" y vacía el carrito.
      await payOrder(orden.id, 'approved')

      navigate(`/compra-exitosa/${orden.id}`)
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

  if (cart.items.length === 0)
  {
    return (
      <section className="text-light">
        <h1>Carrito</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <p>Tu carrito está vacío.</p>
        <Link to="/galeria" className="btn btn-primary">Ver cursos</Link>
      </section>
    )
  }

  return (
    <section className="text-light">
      <h1 className="mb-4">Carrito</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-dark align-middle">
        <thead>
          <tr>
            <th>Curso</th>
            <th className="text-end">Precio</th>
            <th className="text-end">Cantidad</th>
            <th className="text-end">Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.cover_url ?? SIN_IMAGEN} alt="" width="60" className="me-2 rounded" />
                {item.name}
              </td>
              <td className="text-end">{formatCurrency(item.unit_price)}</td>
              <td className="text-end">{item.quantity}</td>
              <td className="text-end">{formatCurrency(item.subtotal)}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleQuitar(item.id)}
                  disabled={pagando}
                >
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3" className="text-end">Total</th>
            <th className="text-end">{formatCurrency(cart.total)}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>

      <button
        type="button"
        className="btn btn-success btn-lg"
        onClick={handlePagar}
        disabled={pagando}
      >
        {pagando ? 'Procesando pago…' : `Pagar ${formatCurrency(cart.total)}`}
      </button>
      <p className="small mt-2">Pago simulado: no se cobra dinero real.</p>
    </section>
  )
}

export default Cart

// Confirmación de compra: muestra la orden y, si está pagada, sus descargas.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderById, getOrderFiles } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'

function ConfirmacionCompra()
{
  const { orderId } = useParams()

  const [orden, setOrden] = useState(null)
  const [archivos, setArchivos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() =>
  {
    let isActive = true

    async function cargarOrden()
    {
      try
      {
        const data = await getOrderById(orderId)

        // El servidor solo entrega archivos de órdenes pagadas.
        const descargas = data.status === 'paid' ? await getOrderFiles(orderId) : []

        if (isActive)
        {
          setOrden(data)
          setArchivos(descargas)
        }
      }
      catch
      {
        if (isActive)
        {
          setError('No encontramos esta compra.')
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

    cargarOrden()

    return () =>
    {
      isActive = false
    }
  }, [orderId])

  if (loading)
  {
    return <p className="text-light">Cargando compra…</p>
  }

  if (error)
  {
    return <div className="alert alert-warning">{error}</div>
  }

  return (
    <section className="text-light">
      <h1 className="mb-3">
        {orden.status === 'paid' ? '¡Compra confirmada!' : 'Compra pendiente'}
      </h1>
      <p>
        Orden #{orden.id} · Estado: <strong>{orden.status}</strong> · Referencia: {orden.payment_reference ?? '—'}
      </p>

      <ul className="list-group mb-4">
        {orden.items.map((item) => (
          <li key={item.product_id} className="list-group-item d-flex justify-content-between">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatCurrency(item.subtotal)}</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between fw-bold">
          <span>Total pagado</span>
          <span>{formatCurrency(orden.total)}</span>
        </li>
      </ul>

      <h2 className="h4">Tus descargas</h2>
      {archivos.length === 0 && <p>Esta compra no tiene archivos descargables.</p>}
      <ul>
        {archivos.map((archivo) => (
          <li key={archivo.file_url}>
            <a href={archivo.file_url} target="_blank" rel="noreferrer" className="link-light">
              {archivo.file_name}
            </a>
          </li>
        ))}
      </ul>

      <Link to="/galeria" className="btn btn-outline-light">Seguir comprando</Link>
    </section>
  )
}

export default ConfirmacionCompra

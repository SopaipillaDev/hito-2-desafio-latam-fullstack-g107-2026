/* Página "Mis compras". Lista las órdenes del usuario autenticado con getMyOrders() 
 (ya vienen ordenadas por created_at descendente). Al desplegar una orden pide su
detalle con getOrderById() y, si está pagada, sus archivos con getOrderFiles(). */
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import {
  getMyOrders,
  getOrderById,
  getOrderFiles,
} from '../../services/orderService'

const STATUS_LABELS = {
  pending: 'Pendiente',
  paid: 'Pagada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
}

const STATUS_BADGES = {
  pending: 'text-bg-warning',
  paid: 'text-bg-success',
  rejected: 'text-bg-danger',
  cancelled: 'text-bg-secondary',
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function MisCompras() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [details, setDetails] = useState({})

  useEffect(() => {
    let isActive = true

    getMyOrders()
      .then((data) => {
        if (isActive) setOrders(data)
      })
      .catch(() => {
        if (isActive) setError('No pudimos cargar tus compras. Intenta nuevamente.')
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function handleToggleDetail(order) {
    if (openId === order.id) {
      setOpenId(null)
      return
    }

    setOpenId(order.id)

    if (details[order.id] && !details[order.id].error) return

    setDetails((prev) => ({ ...prev, [order.id]: { loading: true } }))

    try {
      const [detail, files] = await Promise.all([
        getOrderById(order.id),
        order.status === 'paid' ? getOrderFiles(order.id) : Promise.resolve([]),
      ])
      setDetails((prev) => ({
        ...prev,
        [order.id]: { loading: false, items: detail.items ?? [], files },
      }))
    } catch {
      setDetails((prev) => ({
        ...prev,
        [order.id]: { loading: false, error: 'No pudimos cargar el detalle.' },
      }))
    }
  }

  if (loading) {
    return (
      <section>
        <h1>Mis compras</h1>
        <p className="text-muted">Cargando compras...</p>
      </section>
    )
  }

  return (
    <section>
      <h1>Mis compras</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead">Aún no tienes compras.</p>
          <Link to="/galeria" className="btn btn-primary">
            Ver productos
          </Link>
        </div>
      ) : (
        orders.length > 0 && (
          <div className="table-responsive">
            <table className="table align-middle tabla-compras">
              <thead>
                <tr>
                  <th scope="col">Orden</th>
                  {/* En pantallas angostas se ocultan Fecha y Productos: la tabla cabe sin scroll horizontal. */}
                  <th scope="col" className="d-none d-sm-table-cell">Fecha</th>
                  <th scope="col" className="text-center d-none d-md-table-cell">Productos</th>
                  <th scope="col" className="text-center">Estado</th>
                  <th scope="col" className="text-end">Total</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const isOpen = openId === order.id
                  const detail = details[order.id]
                  return (
                    <Fragment key={order.id}>
                      <tr>
                        <td className="fw-semibold">#{order.id}</td>
                        <td className="d-none d-sm-table-cell">{formatDate(order.created_at)}</td>
                        <td className="text-center d-none d-md-table-cell">{order.items_count}</td>
                        <td className="text-center">
                          <span className={`badge ${STATUS_BADGES[order.status] ?? 'text-bg-light'}`}>
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </td>
                        <td className="text-end fw-bold text-nowrap">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleToggleDetail(order)}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? `Ocultar detalle de la orden ${order.id}` : `Ver detalle de la orden ${order.id}`}
                          >
                            <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden="true" />
                            <span className="d-none d-sm-inline ms-1">{isOpen ? 'Ocultar' : 'Ver detalle'}</span>
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={6} className="bg-black">
                            {!detail || detail.loading ? (
                              <p className="text-muted mb-0">Cargando detalle...</p>
                            ) : detail.error ? (
                              <p className="text-danger mb-0">{detail.error}</p>
                            ) : (
                              // mx-0: un .row tiene márgenes negativos a los lados; dentro de una celda
                              // sobresalía unos píxeles y activaba el scroll horizontal de la tabla.
                              <div className="row g-4 py-2 mx-0">
                                <div className="col-md-7">
                                  <h2 className="h6">Productos</h2>
                                  <ul className="list-unstyled mb-0">
                                    {detail.items.map((item) => (
                                      <li key={item.product_id} className="d-flex justify-content-between gap-2">
                                        <span>
                                          {item.name} × {item.quantity}
                                        </span>
                                        <span className="text-nowrap">{formatCurrency(item.subtotal)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="col-md-5">
                                  <h2 className="h6">Archivos</h2>
                                  {order.status !== 'paid' ? (
                                    <p className="text-muted mb-0">
                                      Los archivos estarán disponibles una vez pagada la orden.
                                    </p>
                                  ) : detail.files.length === 0 ? (
                                    <p className="text-muted mb-0">No hay archivos disponibles.</p>
                                  ) : (
                                    <div className="d-flex flex-column gap-2">
                                      {/* El backend envía file_name y file_url. Antes se leía file.name y
                                          file.url (undefined): el botón decía solo "Descargar" y no descargaba. */}
                                      {detail.files.map((file) => (
                                        <a
                                          key={file.file_url}
                                          href={file.file_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="btn btn-sm btn-outline-success text-start text-wrap text-break"
                                        >
                                          <i className="bi bi-download me-2" aria-hidden="true" />
                                          Descargar {file.file_name}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  )
}

export default MisCompras

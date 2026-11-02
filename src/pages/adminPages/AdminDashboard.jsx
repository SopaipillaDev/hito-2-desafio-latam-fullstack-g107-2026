// Panel de administración. Muestra métricas globales (GET /admin/stats) y las
// últimas órdenes (GET /admin/orders). Solo lo ve el rol admin (AdminRoute).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminOrders, getAdminStats } from '../../services/adminService'
import { formatCurrency } from '../../utils/formatCurrency'

const STATUS_BADGES = {
  pending: { label: 'Pendiente', className: 'text-bg-warning' },
  paid: { label: 'Pagada', className: 'text-bg-success' },
  rejected: { label: 'Rechazada', className: 'text-bg-danger' },
  cancelled: { label: 'Cancelada', className: 'text-bg-secondary' },
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Se piden ambos endpoints en paralelo. Promise.all espera a que terminen los dos;
  // si uno falla, cae al catch.
  useEffect(() => {
    // Evita actualizar el estado si el componente se desmonta antes de que respondan.
    let isActive = true

    Promise.all([getAdminStats(), getAdminOrders({ limit: 5 })])
      .then(([statsData, ordersData]) => {
        if (!isActive) return
        setStats(statsData)
        // ?? [] protege el render si la respuesta no trae `results`.
        setOrders(ordersData.results ?? [])
      })
      .catch((err) => {
        if (isActive) setError(err)
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  // Mientras llegan los datos se muestra un spinner de Bootstrap.
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando panel...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        No se pudo cargar el panel de administración.
      </div>
    )
  }

  // Tarjetas superiores. Se arman como lista para no repetir el mismo bloque de JSX tres veces.
  const kpis = [
    { label: 'Ventas totales', value: formatCurrency(stats.total_sales) },
    { label: 'Órdenes pagadas', value: stats.orders_paid },
    { label: 'Usuarios registrados', value: stats.users },
  ]

  return (
    <div>
      <h1 className="h3 mb-4">Panel de administración</h1>

      {/* Fila de métricas: en móvil una por fila, en pantallas medianas o más, tres en fila. */}
      <div className="row g-4 mb-4">
        {kpis.map((kpi) => (
          <div className="col-12 col-md-4" key={kpi.label}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <p className="text-muted small mb-1">{kpi.label}</p>
                <p className="h3 fw-bold mb-0">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dos columnas: productos más vendidos (izquierda) y últimas órdenes (derecha). */}
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Productos más vendidos</h2>
              {stats.top_products.length > 0 ? (
                <ol className="list-group list-group-numbered">
                  {stats.top_products.map((product) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-start"
                      key={product.id}
                    >
                      <span className="ms-2 me-auto">{product.name}</span>
                      <span className="badge text-bg-primary rounded-pill">
                        {product.units_sold} uds.
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted mb-0">Aún no hay ventas.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">Últimas órdenes</h2>
                <Link to="/admin/ordenes" className="btn btn-outline-primary btn-sm">
                  Ver todas
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Orden</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        // Si el status no está en STATUS_BADGES, se muestra tal cual con un badge gris.
                        const badge = STATUS_BADGES[order.status]
                        return (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            {/* ?. evita error si la orden viene sin datos de usuario. */}
                            <td>{order.user?.name}</td>
                            <td>{formatCurrency(order.total)}</td>
                            <td>
                              <span className={`badge ${badge?.className ?? 'text-bg-light'}`}>
                                {badge?.label ?? order.status}
                              </span>
                            </td>
                            <td>
                              {new Date(order.created_at).toLocaleDateString('es-CL')}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No hay órdenes todavía.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

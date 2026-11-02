// Inventario de productos para el admin. Lista las publicaciones paginadas
// (GET /products) y permite eliminarlas (DELETE /products/:id). Solo lo ve el
// rol admin (AdminRoute).
import { useEffect, useState } from 'react'
import { deleteProduct, getProducts } from '../../services/productService'
import { formatCurrency } from '../../utils/formatCurrency'

const PAGE_SIZE = 10

function Inventario() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  // Al sumarle 1 se fuerza a volver a pedir la página actual (por ejemplo, tras eliminar).
  const [reloadKey, setReloadKey] = useState(0)

  // Pide la página actual. Se vuelve a ejecutar al cambiar de página o al
  // incrementar reloadKey.
  useEffect(() => {
    // Evita actualizar el estado si el componente se desmonta antes de que llegue la respuesta.
    let isActive = true
    setLoading(true)
    setError('')

    getProducts({ limit: PAGE_SIZE, page })
      .then((data) => {
        if (!isActive) return
        setProducts(data.results ?? [])
        setTotal(data.total ?? 0)
        setTotalPages(data.total_pages ?? 1)
      })
      .catch(() => {
        if (isActive) setError('No se pudo cargar el inventario.')
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [page, reloadKey])

  // Pide confirmación antes de borrar, porque la acción no se puede deshacer.
  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeletingId(product.id)
    try {
      await deleteProduct(product.id)
      setReloadKey((key) => key + 1)
    } catch (err) {
      // Muestra el mensaje del backend (por ejemplo, si el producto tiene órdenes) o uno genérico.
      setError(err.response?.data?.message ?? 'No se pudo eliminar el producto.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Inventario de productos</h1>
        <span className="text-muted">{total} productos</span>
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando inventario...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Portada</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {/* Sin portada se muestra un guion en lugar de una imagen rota. */}
                        {product.cover_url ? (
                          <img
                            src={product.cover_url}
                            alt={product.name}
                            style={{ width: '56px', height: '40px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category?.name}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>
                        <span
                          className={`badge ${
                            product.status === 'published'
                              ? 'text-bg-success'
                              : 'text-bg-secondary'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {products.length === 0 && (
            <p className="text-muted text-center mt-4">No hay productos en el inventario.</p>
          )}

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </button>
              <span className="text-muted">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}

export default Inventario

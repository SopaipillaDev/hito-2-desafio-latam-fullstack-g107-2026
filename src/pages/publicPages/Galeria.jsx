// Galería de publicaciones. El filtrado, la búsqueda, el orden y la paginación
// los hace el SERVIDOR vía query params de GET /products (category, search,
// order_by, limit, page). Cambiar cualquier filtro reinicia a la página 1.
import { useMemo, useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'

// Slugs de categoría del contrato; deben coincidir con el backend.
const CATEGORIES = [
  { id: 'all', name: 'Todas', slug: '' },
  { id: 'unity', name: 'Unity', slug: 'unity' },
  { id: 'unreal-engine', name: 'Unreal Engine', slug: 'unreal-engine' },
  { id: 'programacion', name: 'Programación', slug: 'programacion' },
  { id: 'arte-y-diseno', name: 'Arte y Diseño', slug: 'arte-y-diseno' },
]

const PAGE_SIZE = 12

function Galeria() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  // Params del contrato, estables (useMemo) para no disparar el efecto en bucle.
  const params = useMemo(() => {
    const selected = CATEGORIES.find((item) => item.id === category)
    return {
      category: selected?.slug || undefined,
      search: search.trim() || undefined,
      order_by: sort || undefined,
      limit: PAGE_SIZE,
      page,
    }
  }, [category, search, sort, page])

  const { products, loading, error, total, totalPages } = useProducts(params)

  function changeCategory(id) {
    setCategory(id)
    setPage(1)
  }

  function changeSearch(value) {
    setSearch(value)
    setPage(1)
  }

  function changeSort(value) {
    setSort(value)
    setPage(1)
  }

  const pages = totalPages || 1

  return (
    <main className="bg-dark text-light min-vh-100 py-5">
      <div className="container">
        {/* Encabezado */}
        <div className="mb-4">
          <h1 className="display-6 fw-bold">Galería de publicaciones</h1>
          <p className="text-secondary">
            Explora nuestros productos y recursos.
          </p>
        </div>

        {/* Buscador y orden */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-8">
            <label htmlFor="search" className="form-label">
              Buscar
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-light border-secondary">
                <i className="bi bi-search" />
              </span>
              <input
                id="search"
                type="search"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar productos..."
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <label htmlFor="sort" className="form-label">
              Ordenar por precio
            </label>
            <select
              id="sort"
              className="form-select bg-dark text-light border-secondary"
              value={sort}
              onChange={(event) => changeSort(event.target.value)}
            >
              <option value="">Predeterminado</option>
              <option value="price_ASC">Más barato primero</option>
              <option value="price_DESC">Más caro primero</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          {/* Filtros */}
          <aside className="col-12 col-lg-3">
            <div className="card bg-black text-light border-secondary">
              <div className="card-body">
                <h2 className="h5 mb-3">Categorías</h2>
                <div className="d-flex flex-column gap-2">
                  {CATEGORIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`btn text-start ${
                        category === item.id
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => changeCategory(item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Productos */}
          <section className="col-12 col-lg-9">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando productos...</span>
                </div>
                <p className="text-secondary mt-3">Cargando productos...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                No se pudieron cargar los productos.
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-secondary mb-0">
                    {total} productos encontrados
                  </p>
                </div>

                {products.length > 0 ? (
                  <>
                    <div className="row g-4">
                      {products.map((product) => (
                        <div
                          className="col-12 col-md-6 col-xl-4"
                          key={product.id}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>

                    {pages > 1 && (
                      <nav className="d-flex justify-content-center align-items-center gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          disabled={page <= 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Anterior
                        </button>
                        <span className="text-secondary">
                          Página {page} de {pages}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          disabled={page >= pages}
                          onClick={() => setPage(page + 1)}
                        >
                          Siguiente
                        </button>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-search fs-1 text-secondary" />
                    <h2 className="h5 mt-3">No encontramos productos</h2>
                    <p className="text-secondary">
                      Prueba con otra categoría o término de búsqueda.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default Galeria

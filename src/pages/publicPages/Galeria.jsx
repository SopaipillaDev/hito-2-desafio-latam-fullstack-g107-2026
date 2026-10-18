import { useMemo, useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'

const CATEGORIES = [
  { id: 'all', name: 'Todas', apiCategory: '' },
  { id: 'unity', name: 'Unity', apiCategory: "men's clothing" },
  { id: 'unreal', name: 'Unreal Engine', apiCategory: "women's clothing" },
  { id: 'programacion', name: 'Programación', apiCategory: 'electronics' },
  { id: 'arte', name: 'Arte', apiCategory: 'jewelery' },
  {
    id: 'diseno-videojuegos',
    name: 'Diseño de videojuegos',
    apiCategory: 'electronics',
  },
]

function Galeria() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')

  const { products, loading, error } = useProducts()

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Obtener la categoría seleccionada
    const selectedCategory = CATEGORIES.find(
      (item) => item.id === category
    )

    // Filtrar por categoría
    if (selectedCategory?.apiCategory) {
      result = result.filter(
        (product) =>
          product.category === selectedCategory.apiCategory
      )
    }

    // Filtrar por búsqueda
    if (search.trim()) {
      const searchText = search.toLowerCase().trim()

      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchText)
      )
    }

    // Ordenar por precio
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, category, search, sort])

  return (
    <main className="bg-dark text-light min-vh-100 py-5">
      <div className="container">

        {/* Encabezado */}
        <div className="mb-4">
          <h1 className="display-6 fw-bold">
            Galería de publicaciones
          </h1>

          <p className="text-secondary">
            Explora nuestros productos y recursos.
          </p>
        </div>

        {/* Buscador y orden */}
        <div className="row g-3 mb-4">

          {/* Buscador */}
          <div className="col-12 col-lg-8">

            <label htmlFor="search" className="form-label">
              Buscar
            </label>

            <div className="input-group">
              <span className="input-group-text bg-dark text-light border-secondary">
                <i className="bi bi-search"></i>
              </span>

              <input
                id="search"
                type="search"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar productos..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                }}
              />
            </div>

          </div>

          {/* Ordenar */}
          <div className="col-12 col-lg-4">

            <label htmlFor="sort" className="form-label">
              Ordenar por precio
            </label>

            <select
              id="sort"
              className="form-select bg-dark text-light border-secondary"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value)
              }}
            >
              <option value="">
                Predeterminado
              </option>

              <option value="price-asc">
                Más barato primero
              </option>

              <option value="price-desc">
                Más caro primero
              </option>
            </select>

          </div>

        </div>

        <div className="row g-4">

          {/* Filtros */}
          <aside className="col-12 col-lg-3">

            <div className="card bg-black text-light border-secondary">
              <div className="card-body">

                <h2 className="h5 mb-3">
                  Categorías
                </h2>

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
                      onClick={() => setCategory(item.id)}
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

                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    Cargando productos...
                  </span>
                </div>

                <p className="text-secondary mt-3">
                  Cargando productos...
                </p>

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
                    {filteredProducts.length} productos encontrados
                  </p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="row g-4">

                    {filteredProducts.map((product) => (
                      <div
                        className="col-12 col-md-6 col-xl-4"
                        key={product.id}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="text-center py-5">

                    <i className="bi bi-search fs-1 text-secondary"></i>

                    <h2 className="h5 mt-3">
                      No encontramos productos
                    </h2>

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
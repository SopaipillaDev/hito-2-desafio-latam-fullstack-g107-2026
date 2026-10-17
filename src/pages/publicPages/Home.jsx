import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'

const CATEGORIES = [
  { name: 'Unity', icon: 'bi-box' },
  { name: 'Unreal Engine', icon: 'bi-controller' },
  { name: 'Programación', icon: 'bi-code-slash' },
  { name: 'Arte y Diseño', icon: 'bi-palette' },
]

function Home() {
  const { products, loading, error } = useProducts()
  const featured = products.slice(0, 4)

  return (
    <>
      <section className="bg-dark text-white text-center rounded-4 p-5 mb-5">
        <h1 className="display-5 fw-bold">Aprende a crear videojuegos</h1>
        <p className="lead col-lg-8 mx-auto">
          Cursos y recursos digitales para dominar Unity, Unreal Engine y el
          desarrollo de videojuegos.
        </p>
        <a href="#destacados" className="btn btn-primary btn-lg mt-2">
          Explorar productos
        </a>
      </section>

      <section id="destacados" className="mb-5">
        <h2 className="h3 mb-4">Productos destacados</h2>

        {loading && <p className="text-muted">Cargando productos...</p>}

        {error && (
          <div className="alert alert-danger" role="alert">
            No se pudieron cargar los productos.
          </div>
        )}

        {!loading && !error && (
          <div className="row g-4">
            {featured.map((product) => (
              <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-5">
        <h2 className="h3 mb-4">Categorías</h2>

        <div className="row g-4">
          {CATEGORIES.map((category) => (
            <div className="col-6 col-lg-3" key={category.name}>
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className={`bi ${category.icon} fs-1 text-primary`} />
                  <h3 className="h6 mt-3 mb-0">{category.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home

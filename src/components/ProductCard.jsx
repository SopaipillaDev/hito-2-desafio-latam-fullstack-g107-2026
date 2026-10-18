// Card reutilizable de producto para el contrato real: usa name, cover_url,
// category.name, price y rating_avg. El category del listado es un objeto base.
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

function ProductCard({ product }) {
  return (
    <article className="card h-100 shadow-sm">
      <img
        src={product.cover_url}
        className="card-img-top p-3"
        alt={product.name}
        style={{ height: '180px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">
          {product.category?.name}
        </span>
        <h3 className="h6 card-title">{product.name}</h3>

        {product.rating_avg != null && (
          <p className="text-warning small mb-1">
            <i className="bi bi-star-fill me-1" />
            {product.rating_avg} ({product.reviews_count})
          </p>
        )}

        <p className="fw-bold text-primary mt-auto mb-3">
          {formatCurrency(product.price)}
        </p>
        <Link
          to={`/producto/${product.id}`}
          className="btn btn-outline-primary btn-sm"
        >
          Ver producto
        </Link>
      </div>
    </article>
  )
}

export default ProductCard

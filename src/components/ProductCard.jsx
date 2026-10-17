import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

function ProductCard({ product }) {
  return (
    <article className="card h-100 shadow-sm">
      <img
        src={product.image}
        className="card-img-top p-3"
        alt={product.title}
        style={{ height: '180px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">
          {product.category}
        </span>
        <h3 className="h6 card-title">{product.title}</h3>
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

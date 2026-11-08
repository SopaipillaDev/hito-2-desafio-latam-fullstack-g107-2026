// Card reutilizable de producto para el contrato real: usa name, cover_url,
// category.name, price y rating_avg. El category del listado es un objeto base.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import { useUser } from '../context/UserContext'
import { addFavorite, removeFavorite } from '../services/favoriteService'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useUser()
  const [isFavorite, setIsFavorite] = useState(false)
  const [savingFavorite, setSavingFavorite] = useState(false)

  // Sin sesión no se puede guardar un favorito: se envía al login.
  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setSavingFavorite(true)
    try {
      if (isFavorite) {
        await removeFavorite(product.id)
      } else {
        await addFavorite(product.id)
      }
      setIsFavorite(!isFavorite)
    } catch {
      // Si la petición falla, el corazón conserva su estado anterior.
    } finally {
      setSavingFavorite(false)
    }
  }

  return (
    <article className="card h-100 shadow-sm">
      {/* La portada llena el ancho de la tarjeta en proporción 3:2 (sin franjas vacías). */}
      <img
        src={product.cover_url ?? 'https://placehold.co/600x400?text=Sin+imagen'}
        className="card-img-top"
        alt={product.name}
        style={{ aspectRatio: '3 / 2', objectFit: 'cover' }}
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
        <div className="d-flex gap-2">
          <Link
            to={`/producto/${product.id}`}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            Ver producto
          </Link>
          <button
            type="button"
            className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={handleToggleFavorite}
            disabled={savingFavorite}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={isFavorite}
          >
            <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

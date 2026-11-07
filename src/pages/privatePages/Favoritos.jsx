// Página privada "Mis favoritos". GET /favorites devuelve filas
// { id, created_at, product: { id, name, slug, price, cover_url, rating_avg } },
// así que la tarjeta se arma aquí y no se reutiliza ProductCard (que además
// siempre nace con el corazón apagado). Ojo: DELETE /favorites/:id espera el
// id del PRODUCTO, no el de la fila del favorito.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../../services/favoriteService'
import { addProduct } from '../../services/cartService'
import { formatCurrency } from '../../utils/formatCurrency'

const SIN_IMAGEN = 'https://placehold.co/600x400?text=Curso'

function Favoritos() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const [addingId, setAddingId] = useState(null)
  const [notice, setNotice] = useState(null)
  // Cambiar reloadKey vuelve a ejecutar el efecto de carga (botón Reintentar).
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isActive = true

    // La carga va en una función async (como en useProducts) para no llamar a
    // setState de forma síncrona en el cuerpo del efecto.
    async function loadFavorites() {
      setLoading(true)
      setError(null)

      try {
        const data = await getFavorites()
        if (isActive) setFavorites(Array.isArray(data) ? data : [])
      } catch {
        if (isActive) setError('No pudimos cargar tus favoritos. Intenta nuevamente.')
      } finally {
        if (isActive) setLoading(false)
      }
    }

    loadFavorites()

    return () => {
      isActive = false
    }
  }, [reloadKey])

  // Quitar es optimista: el favorito desaparece al instante y, si la petición
  // falla, se reinserta solo ese favorito (no se restaura toda la lista, para
  // no revivir otros que se hayan quitado mientras tanto).
  async function handleRemove(productId) {
    const removed = favorites.find((fav) => fav.product.id === productId)

    setNotice(null)
    setRemovingId(productId)
    setFavorites((prev) => prev.filter((fav) => fav.product.id !== productId))

    try {
      await removeFavorite(productId)
      setNotice({ tipo: 'success', texto: 'Producto quitado de tus favoritos.' })
    } catch {
      setFavorites((prev) => (removed ? [...prev, removed] : prev))
      setNotice({
        tipo: 'danger',
        texto: 'No pudimos quitar el producto. Intenta nuevamente.',
      })
    } finally {
      setRemovingId(null)
    }
  }

  async function handleAddToCart(productId) {
    setNotice(null)
    setAddingId(productId)

    try {
      await addProduct(productId, 1)
      setNotice({
        tipo: 'success',
        texto: 'Producto agregado a tu carrito.',
        carrito: true,
      })
    } catch (err) {
      // 409 = el producto ya estaba en el carrito (UNIQUE cart_id + product_id).
      if (err.response?.status === 409) {
        setNotice({
          tipo: 'info',
          texto: 'Este producto ya está en tu carrito.',
          carrito: true,
        })
      } else {
        setNotice({
          tipo: 'danger',
          texto: 'No pudimos agregar el producto. Intenta nuevamente.',
        })
      }
    } finally {
      setAddingId(null)
    }
  }

  // El endpoint devuelve todos los favoritos, sin paginación: filtrar en el
  // cliente es suficiente.
  const term = search.trim().toLowerCase()
  const filtered = term
    ? favorites.filter((fav) => fav.product.name.toLowerCase().includes(term))
    : favorites

  if (loading) {
    return (
      <section className="text-light">
        <h1 className="mb-4">Mis favoritos</h1>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando favoritos...</span>
          </div>
          <p className="text-secondary mt-3">Cargando favoritos...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="text-light">
        <h1 className="mb-4">Mis favoritos</h1>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Reintentar
        </button>
      </section>
    )
  }

  return (
    <section className="text-light">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h1 className="mb-1">
            <i className="bi bi-heart-fill text-danger me-2" />
            Mis favoritos
          </h1>
          <p className="text-secondary mb-0">
            {favorites.length === 1
              ? '1 producto guardado'
              : `${favorites.length} productos guardados`}
          </p>
        </div>
      </header>

      {notice && (
        <div
          className={`alert alert-${notice.tipo}`}
          role="alert"
          aria-live="polite"
        >
          {notice.texto}
          {notice.carrito && (
            <>
              {' '}
              <Link to="/cart" className="alert-link">
                Ver carrito
              </Link>
            </>
          )}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heart fs-1 text-secondary" />
          <h2 className="h5 mt-3">Todavía no tienes favoritos</h2>
          <p className="text-secondary">
            Pulsa el corazón de un producto para guardarlo aquí.
          </p>
          <Link to="/galeria" className="btn btn-primary">
            Explorar galería
          </Link>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-4">
              <label htmlFor="favorites-search" className="form-label">
                Buscar en mis favoritos
              </label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-light border-secondary">
                  <i className="bi bi-search" />
                </span>
                <input
                  id="favorites-search"
                  type="search"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-secondary" />
              <h2 className="h5 mt-3">Sin coincidencias</h2>
              <p className="text-secondary">
                Ningún favorito coincide con «{search.trim()}».
              </p>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearch('')}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <>
              {term && (
                <p className="text-secondary">
                  {filtered.length} de {favorites.length} favoritos
                </p>
              )}

              <div className="row g-4">
                {filtered.map((favorite) => {
                  const product = favorite.product

                  return (
                    <div className="col-12 col-md-6 col-xl-4" key={favorite.id}>
                      <article className="card h-100 shadow-sm">
                        <Link to={`/producto/${product.id}`}>
                          <img
                            src={product.cover_url || SIN_IMAGEN}
                            className="card-img-top p-3"
                            alt={product.name}
                            style={{ height: '180px', objectFit: 'contain' }}
                          />
                        </Link>

                        <div className="card-body d-flex flex-column">
                          {product.rating_avg != null && (
                            <p className="text-warning small mb-1">
                              <i className="bi bi-star-fill me-1" />
                              {product.rating_avg}
                            </p>
                          )}

                          <h2 className="h6 card-title">{product.name}</h2>

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
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleAddToCart(product.id)}
                              disabled={addingId === product.id}
                              aria-label={`Agregar ${product.name} al carrito`}
                              title="Agregar al carrito"
                            >
                              {addingId === product.id ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                />
                              ) : (
                                <i className="bi bi-cart-plus" />
                              )}
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemove(product.id)}
                              disabled={removingId === product.id}
                              aria-label={`Quitar ${product.name} de favoritos`}
                              title="Quitar de favoritos"
                            >
                              {removingId === product.id ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                />
                              ) : (
                                <i className="bi bi-heart-fill" />
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}

export default Favoritos

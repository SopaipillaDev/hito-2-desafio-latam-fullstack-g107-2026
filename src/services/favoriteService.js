// Servicio de favoritos. Todas las rutas son privadas (Bearer con
// getAuthHeaders()). Ojo: en DELETE el :product_id es el id del producto, no el
// id de la fila de favoritos.
import api from './api'
import { getAuthHeaders } from './authService'

// GET /favorites → favoritos del usuario.
export async function getFavorites() {
  const { data } = await api.get('/favorites', { headers: getAuthHeaders() })
  return data
}

// POST /favorites → agregar a favoritos. Body: { product_id }.
export async function addFavorite(productId) {
  const { data } = await api.post(
    '/favorites',
    { product_id: productId },
    { headers: getAuthHeaders() },
  )
  return data
}

// DELETE /favorites/:product_id → quitar de favoritos.
export async function removeFavorite(productId) {
  const { data } = await api.delete(`/favorites/${productId}`, {
    headers: getAuthHeaders(),
  })
  return data
}

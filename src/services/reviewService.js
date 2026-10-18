// Servicio de reseñas. La lectura es pública; crear una reseña es privado (el
// user_id sale del token). getMyReviews es Fase 2.
import api from './api'
import { getAuthHeaders } from './authService'

// GET /products/:id/reviews → reseñas de un producto (público).
export async function getProductReviews(productId) {
  const { data } = await api.get(`/products/${productId}/reviews`)
  return data
}

// POST /products/:id/reviews → crear reseña. Body: { rating (1-5), comment }.
export async function createReview(productId, review) {
  const { data } = await api.post(`/products/${productId}/reviews`, review, {
    headers: getAuthHeaders(),
  })
  return data
}

// GET /users/me/reviews → reseñas del usuario logueado (Fase 2).
export async function getMyReviews() {
  const { data } = await api.get('/users/me/reviews', {
    headers: getAuthHeaders(),
  })
  return data
}

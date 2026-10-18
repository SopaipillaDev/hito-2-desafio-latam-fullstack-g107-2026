// Servicio de categorías. La lectura es pública; la creación requiere token de
// admin, por eso usa getAuthHeaders(). Reusa la instancia `api`.
import api from './api'
import { getAuthHeaders } from './authService'

// GET /categories → lista de categorías (público).
export async function getCategories() {
  const { data } = await api.get('/categories')
  return data
}

// POST /categories → crear categoría (admin). Body: { name, slug, description }.
export async function createCategory(category) {
  const { data } = await api.post('/categories', category, {
    headers: getAuthHeaders(),
  })
  return data
}

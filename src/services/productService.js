// Servicio de productos (publicaciones). La lectura del catálogo es pública; las
// acciones de escritura son de admin (Bearer con getAuthHeaders()). Las imágenes
// y archivos se guardan como URL: no se suben archivos, se envía JSON.
import api from './api'
import { getAuthHeaders } from './authService'

// GET /products → listado con filtros y paginación. Query params opcionales:
// category (slug), search, order_by (price_ASC|price_DESC|created_at_DESC),
// limit (12), page (1). Devuelve { total, page, limit, total_pages, results[] }.
export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return data
}

// GET /products/:id → detalle de un producto (incluye imágenes).
export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}

// POST /products → crear publicación (admin).
export async function createProduct(product) {
  const { data } = await api.post('/products', product, {
    headers: getAuthHeaders(),
  })
  return data
}

// PUT /products/:id → actualizar producto completo (admin).
export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product, {
    headers: getAuthHeaders(),
  })
  return data
}

// DELETE /products/:id → eliminar producto (admin).
export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`, {
    headers: getAuthHeaders(),
  })
  return data
}

// GET /products/:id/images → imágenes de un producto (público).
export async function getProductImages(id) {
  const { data } = await api.get(`/products/${id}/images`)
  return data
}

// POST /products/:id/images → agregar imagen (admin). Body: { url, alt_text,
// is_cover, position }.
export async function addProductImage(id, image) {
  const { data } = await api.post(`/products/${id}/images`, image, {
    headers: getAuthHeaders(),
  })
  return data
}

// POST /products/:id/files → agregar archivo descargable (admin). Body:
// { file_url, file_name, file_size }.
export async function addProductFile(id, file) {
  const { data } = await api.post(`/products/${id}/files`, file, {
    headers: getAuthHeaders(),
  })
  return data
}

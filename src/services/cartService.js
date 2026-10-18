// Servicio del carrito. Cada usuario tiene un solo carrito (uno por token), así
// que todas las rutas son privadas y envían el Bearer con getAuthHeaders().
// Ojo: en PUT/DELETE /cart/products/:id el :id es la fila de cart_products, no
// el product_id.
import api from './api'
import { getAuthHeaders } from './authService'

// GET /cart → carrito del usuario (items [] y total 0 si aún no tiene).
export async function getCart() {
  const { data } = await api.get('/cart', { headers: getAuthHeaders() })
  return data
}

// POST /cart/products → agregar producto. Body: { product_id, quantity }.
export async function addProduct(productId, quantity = 1) {
  const { data } = await api.post(
    '/cart/products',
    { product_id: productId, quantity },
    { headers: getAuthHeaders() },
  )
  return data
}

// PUT /cart/products/:id → modificar cantidad. Body: { quantity }.
export async function updateQuantity(id, quantity) {
  const { data } = await api.put(
    `/cart/products/${id}`,
    { quantity },
    { headers: getAuthHeaders() },
  )
  return data
}

// DELETE /cart/products/:id → quitar producto del carrito.
export async function removeProduct(id) {
  const { data } = await api.delete(`/cart/products/${id}`, {
    headers: getAuthHeaders(),
  })
  return data
}

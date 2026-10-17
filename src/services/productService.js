import api from './api'

// Servicio de productos: llamadas concretas a la API de productos.
// Reusa la instancia `api`, así hereda baseURL, timeout y headers.

// GET /products → devuelve la lista de productos.
export async function getProducts() {
  const { data } = await api.get('/products')
  return data
}

// GET /products/:id → devuelve un producto por su id.
export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}

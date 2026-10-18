// Servicio de administración. Rutas exclusivas del rol admin; requieren token y
// el middleware del backend valida role === "admin".
import api from './api'
import { getAuthHeaders } from './authService'

// GET /admin/orders → todas las órdenes del sitio. Query opcional:
// status (pending|paid|rejected|cancelled), limit, page.
export async function getAdminOrders(params = {}) {
  const { data } = await api.get('/admin/orders', {
    params,
    headers: getAuthHeaders(),
  })
  return data
}

// GET /admin/stats → métricas del dashboard (ventas, órdenes pagadas, etc.).
export async function getAdminStats() {
  const { data } = await api.get('/admin/stats', { headers: getAuthHeaders() })
  return data
}

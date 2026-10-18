// Servicio de órdenes y pago. Flujo del contrato: POST /orders (nace "pending"),
// luego POST /orders/:id/payment (simulado en el MVP; responde "paid" o
// "rejected"). Todas las rutas son privadas (Bearer con getAuthHeaders()).
import api from './api'
import { getAuthHeaders } from './authService'

// POST /orders → crear orden. Body: { items: [{ product_id, quantity }] }.
export async function createOrder(items) {
  const { data } = await api.post('/orders', { items }, {
    headers: getAuthHeaders(),
  })
  return data
}

// POST /orders/:id/payment → pagar (simulado). result: "approved" | "rejected".
export async function payOrder(id, result = 'approved') {
  const { data } = await api.post(
    `/orders/${id}/payment`,
    { payment_method: 'simulado', result },
    { headers: getAuthHeaders() },
  )
  return data
}

// GET /orders → órdenes del usuario (mis compras).
export async function getMyOrders() {
  const { data } = await api.get('/orders', { headers: getAuthHeaders() })
  return data
}

// GET /orders/:id → detalle de una orden (dueño o admin).
export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`, { headers: getAuthHeaders() })
  return data
}

// GET /orders/:id/files → archivos descargables de una compra pagada.
export async function getOrderFiles(id) {
  const { data } = await api.get(`/orders/${id}/files`, {
    headers: getAuthHeaders(),
  })
  return data
}

// PUT /orders/:id/status → cambiar estado de la orden (admin · Fase 2).
export async function updateOrderStatus(id, status) {
  const { data } = await api.put(
    `/orders/${id}/status`,
    { status },
    { headers: getAuthHeaders() },
  )
  return data
}

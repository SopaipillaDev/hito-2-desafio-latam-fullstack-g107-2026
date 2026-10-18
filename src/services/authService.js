// Servicio de autenticación y sesión: login, logout, registro, datos del
// usuario logueado y helpers del token. Reusa la instancia `api` (hereda
// baseURL, timeout y headers) y centraliza el token en localStorage. Las rutas
// siguen el contrato de la API: POST /login, POST /users, GET /users/me.
import api from './api'

const TOKEN_KEY = 'marketgaming_token' // Nombre del token en localstorge

// POST /login → inicia sesión y devuelve { token, user }.
export async function login(email, password) {
  const { data } = await api.post('/login', { email, password })
  return data
}

// POST /users → registra un usuario y devuelve el usuario creado (201).
export async function register(datos) {
  const { data } = await api.post('/users', datos)
  return data
}

// GET /users/me → datos del usuario logueado (requiere token en el header).
export async function getMe() {
  const { data } = await api.get('/users/me', { headers: getAuthHeaders() })
  return data
}

// Cierra sesión: borra el token. La redirección la maneja la UI (no el servicio).
export function logout() {
  clearToken()
}

// Lee el token guardado (o null).
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Guarda el token.
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

// Borra el token.
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Header Authorization listo para peticiones privadas.
export function getAuthHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ¿Hay sesión activa? (solo comprueba el token).
export function isAuthenticated() {
  return Boolean(getToken())
}

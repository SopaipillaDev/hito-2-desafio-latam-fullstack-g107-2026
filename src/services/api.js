import axios from 'axios'

// Instancia base de axios con la configuración común a todas las peticiones.
const api = axios.create({
  // URL base: variable de entorno de Vite. Sin respaldo: si falta, el error se nota de inmediato.
  baseURL: import.meta.env.VITE_API_URL,
  // Render gratis tarda cerca de 1 minuto en despertar: se espera hasta 90 segundos.
  timeout: 90000,
  // Envía el cuerpo como JSON por defecto.
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

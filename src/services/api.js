import axios from 'axios'

// Instancia base de axios con la configuración común a todas las peticiones.
const api = axios.create({
  // URL base: variable de entorno de Vite o fakestoreapi por defecto.
  baseURL: import.meta.env.VITE_API_URL ?? 'https://fakestoreapi.com',
  // Cancela la petición si tarda más de 10 segundos.
  timeout: 10000,
  // Envía el cuerpo como JSON por defecto.
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

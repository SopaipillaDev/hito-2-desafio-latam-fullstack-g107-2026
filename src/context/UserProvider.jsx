// Componente que envuelve la app y provee la sesión del usuario a todo el árbol.
// Mantiene con useState el token y los datos del usuario y los entrega mediante
// UserContext.Provider, de modo que cualquier componente pueda leerlos con el
// hook useUser(). El token se hidrata desde localStorage al arrancar; si hay
// token pero todavía no hay datos del usuario, se piden con getMe() (y se cierra
// sesión solo si el token es inválido, 401; ante un fallo de red se conserva).
// Deriva isAuthenticated e isAdmin para los guardianes (ProtectedRoute/AdminRoute).
import { useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import { clearToken, getMe, getToken } from '../services/authService'

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token || user) return

    let isActive = true

    getMe()
      .then((data) => {
        if (isActive) setUser(data)
      })
      .catch((error) => {
        if (!isActive) return
        if (error.response?.status === 401) {
          clearToken()
          setToken(null)
        }
      })

    return () => {
      isActive = false
    }
  }, [token, user])

  // Derivados: a partir del estado, para que los guardianes de rutas no repitan
  // esta lógica.
  const isAuthenticated = Boolean(token)
  const isAdmin = user?.role === 'admin'

  return (
    <UserContext.Provider
      value={{ token, user, isAuthenticated, isAdmin, setToken, setUser }}
    >
      {children}
    </UserContext.Provider>
  )
}

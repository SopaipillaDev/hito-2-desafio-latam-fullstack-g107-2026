// Componente que envuelve la app y provee la sesión del usuario a todo el árbol.
// Mantiene con useState el token y los datos del usuario y los entrega mediante
// UserContext.Provider, de modo que cualquier componente pueda leerlos con el
// hook useUser(). Deriva isAuthenticated e isAdmin para los guardianes de rutas
// (ProtectedRoute / AdminRoute).

import { useState } from 'react'
import { UserContext } from './UserContext'

export function UserProvider({ children }) {
  const [token, setToken] = useState('fake-token-de-prueba')
  const [user, setUser] = useState({ id: 1, name: 'Juan', role: 'user' })

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

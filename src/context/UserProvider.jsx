// Componente que envuelve la app y provee la sesión del usuario a todo el árbol.
// Mantiene con useState el token y los datos del usuario (token, user) y los entrega
// mediante UserContext.Provider, de modo que cualquier componente pueda leerlos con
// el hook useUser(). Por ahora solo expone los setters; falta implementar login(token,
// user) y logout() con persistencia en localStorage (ver §3.4 del documento).
import { useState } from 'react'
import { UserContext } from './UserContext'

export function UserProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

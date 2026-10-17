// Define el contexto de sesión del usuario (UserContext) y el hook useUser para
// consumirlo. UserContext nace con valor null; useUser lo lee con useContext y, si
// se usa fuera de UserProvider, lanza un error para detectar el mal uso. Este archivo
// solo guarda la "base" del contexto: el estado real (token y datos del usuario) lo
// entrega UserProvider.
import { createContext, useContext } from 'react'

export const UserContext = createContext(null)

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider')
  }

  return context
}

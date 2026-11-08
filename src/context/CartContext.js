// Contexto del carrito (CartContext) y el hook useCart para leerlo.
// Igual que UserContext: este archivo solo crea la "base"; el estado real
// (carrito y cursos ya comprados) lo entrega CartProvider.
import { createContext, useContext } from 'react'

export const CartContext = createContext(null)

export function useCart()
{
  const context = useContext(CartContext)

  if (!context)
  {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }

  return context
}

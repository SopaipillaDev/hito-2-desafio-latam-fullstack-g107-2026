// Hook que obtiene la lista de productos desde productService y expone su estado.
// Usa tres useState para los datos (products), el indicador de carga (loading) y el
// error (error). El useEffect se ejecuta una sola vez al montar el componente ([]),
// llama a getProducts() y, según el resultado, guarda los datos o el error, y siempre
// apaga loading al terminar. El flag isActive evita actualizar el estado si el
// componente se desmontó antes de que responda la petición (y cubre el doble montaje
// de StrictMode en desarrollo). Devuelve { products, loading, error }.
import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    getProducts()
      .then((data) => {
        if (isActive) setProducts(data)
      })
      .catch((err) => {
        if (isActive) setError(err)
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  return { products, loading, error }
}

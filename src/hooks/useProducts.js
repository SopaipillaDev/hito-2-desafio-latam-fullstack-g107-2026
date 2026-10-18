// Hook que obtiene la lista de productos desde productService y expone su estado.
// Usa tres useState para los datos (products), el indicador de carga (loading) y el
// error (error). El useEffect ejecuta la petición al montar el componente y cuando
// cambian los parámetros de búsqueda. Según el resultado, guarda los datos o el error,
// y siempre apaga loading al terminar. El flag isActive evita actualizar el estado si
// el componente se desmontó antes de que responda la petición (y cubre el doble montaje
// de StrictMode en desarrollo). Devuelve { products, loading, error }.

import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'

const EMPTY_PARAMS = {}

export function useProducts(params = EMPTY_PARAMS) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    setLoading(true)
    setError(null)

    getProducts(params)
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
  }, [params])

  return { products, loading, error }
}
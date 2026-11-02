// Hook que obtiene la lista de categorías desde categoryService. Se pide una vez
// al montar y devuelve { categories, loading, error }. 
import { useEffect, useState } from 'react'
import { getCategories } from '../services/categoryService'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    getCategories()
      .then((data) => {
        if (isActive) setCategories(data)
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

  return { categories, loading, error }
}

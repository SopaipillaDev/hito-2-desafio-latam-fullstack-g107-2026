// Hook que obtiene UNA página de productos desde productService y expone su
// estado. Recibe `params` (filtros y paginación del contrato: category, search,
// order_by, limit, page) y los pasa al service. El useEffect se re-ejecuta
// cuando cambian los params, por eso el objeto `params` debe ser estable
// (constante fuera del componente o useMemo) para no disparar peticiones en
// bucle. El flag isActive evita actualizar el estado si el componente se
// desmontó (y cubre el doble montaje de StrictMode). Devuelve
// { products, loading, error, total, page, totalPages }.
import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'

const EMPTY_PARAMS = {}

export function useProducts(params = EMPTY_PARAMS) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProducts(params)
        if (!isActive) return
        // El contrato devuelve { total, page, limit, total_pages, results[] }.
        setProducts(data.results ?? [])
        setTotal(data.total ?? 0)
        setPage(data.page ?? 1)
        setTotalPages(data.total_pages ?? 0)
      } catch (err) {
        if (isActive) setError(err)
      } finally {
        if (isActive) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [params])

  return { products, loading, error, total, page, totalPages }
}

// Estado compartido del carrito. Antes, cada página pedía GET /cart por su cuenta
// y nadie más se enteraba: el Navbar no mostraba cuántos cursos había y, al volver
// "atrás" a un curso, la página no sabía que ya estaba en el carrito o ya comprado.
// Ahora el carrito vive aquí y lo leen Navbar, DetallePublicacion, Cart y Favoritos.
//
// Guarda dos cosas del servidor:
//   cart     → { id, items, total } de GET /cart (el total lo calcula el backend)
//   ownedIds → ids de los cursos que el usuario ya pagó (de sus órdenes "paid")
import { useEffect, useState } from 'react'
import { CartContext } from './CartContext'
import { useUser } from './UserContext'
import { addProduct, getCart, removeProduct } from '../services/cartService'
import { createOrder, getMyOrders, getOrderById, payOrder } from '../services/orderService'

const CARRITO_VACIO = { id: null, items: [], total: 0 }

// Cursos ya comprados: las órdenes pagadas y, de cada una, sus productos.
// Hoy el backend no tiene un endpoint "mis cursos", así que se arma con los que existen.
async function cargarComprados()
{
  const ordenes = await getMyOrders()
  const pagadas = ordenes.filter((orden) => orden.status === 'paid')
  const detalles = await Promise.all(pagadas.map((orden) => getOrderById(orden.id)))
  const ids = detalles.flatMap((detalle) => detalle.items.map((item) => item.product_id))

  return [...new Set(ids)]   // Set quita los repetidos
}

export function CartProvider({ children })
{
  const { token } = useUser()

  // Los datos recuerdan a qué sesión (token) pertenecen: si alguien cierra sesión
  // y entra otra persona, nunca se muestra el carrito de la sesión anterior.
  const [datos, setDatos] = useState({ token: null, cart: CARRITO_VACIO, ownedIds: [], error: null })

  // Al iniciar sesión (o al cambiar de usuario) se pide el carrito y las compras.
  useEffect(() =>
  {
    if (!token)
    {
      return
    }

    let isActive = true

    async function cargar()
    {
      try
      {
        const [cart, ownedIds] = await Promise.all([getCart(), cargarComprados()])

        if (isActive)
        {
          setDatos({ token, cart, ownedIds, error: null })
        }
      }
      catch
      {
        // Si falla (por ejemplo, Render despertando), se avisa en vez de mostrar
        // un carrito "vacío" que no es real.
        if (isActive)
        {
          setDatos({ token, cart: CARRITO_VACIO, ownedIds: [], error: 'No se pudo cargar el carrito. Recarga la página.' })
        }
      }
    }

    cargar()

    return () =>
    {
      isActive = false
    }
  }, [token])

  const vigente = Boolean(token) && datos.token === token
  const cart = vigente ? datos.cart : CARRITO_VACIO
  const ownedIds = vigente ? datos.ownedIds : []

  // Vuelve a leer el carrito real del servidor (la única fuente de verdad).
  async function recargarCarrito()
  {
    try
    {
      const nuevo = await getCart()
      setDatos((prev) => ({ ...prev, token, cart: nuevo, error: null }))
    }
    catch
    {
      // Si falla, se conserva lo que había.
    }
  }

  async function addToCart(productId)
  {
    try
    {
      await addProduct(productId, 1)
    }
    finally
    {
      // Pase lo que pase (201 agregado o 409 ya estaba), se sincroniza con el servidor.
      await recargarCarrito()
    }
  }

  async function removeFromCart(itemId)
  {
    await removeProduct(itemId)   // itemId = fila de cart_products, no el id del curso
    await recargarCarrito()
  }

  // Compra en dos pasos: la cuenta (orden "pending") y el pago (simulado).
  async function checkout()
  {
    const items = cart.items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }))
    const orden = await createOrder(items)
    const pago = await payOrder(orden.id, 'approved')

    // El servidor sacó del carrito lo pagado. Se recarga SIN await: así la página
    // navega a la confirmación sin mostrar antes un "carrito vacío" por un instante.
    recargarCarrito()

    // Esos cursos pasan a "comprados".
    if (pago.status === 'paid')
    {
      const comprados = orden.items.map((item) => item.product_id)
      setDatos((prev) => ({ ...prev, ownedIds: [...new Set([...prev.ownedIds, ...comprados])] }))
    }

    return orden.id
  }

  const value =
  {
    cart,
    count: cart.items.length,
    loading: Boolean(token) && !vigente,
    error: vigente ? datos.error : null,
    isInCart: (productId) => cart.items.some((item) => item.product_id === productId),
    isOwned: (productId) => ownedIds.includes(productId),
    addToCart,
    removeFromCart,
    checkout,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

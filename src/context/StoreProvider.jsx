import { useState } from 'react'
import { StoreContext } from './storeContext.js'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/productRepository.js'

const CART_STORAGE_KEY = 'descanso-total.cart'

function getInitialCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)
  if (savedCart === null) return []

  try {
    const cart = JSON.parse(savedCart)
    if (!Array.isArray(cart)) return []
    return cart
  } catch {
    return []
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => getProducts())
  const [cart, setCart] = useState(() => getInitialCart())

  function refreshProducts() {
    setProducts(getProducts())
  }

  function addProduct(product) {
    createProduct(product)
    refreshProducts()
  }

  function editProduct(id, changes) {
    updateProduct(id, changes)
    refreshProducts()
  }

  function removeProduct(id) {
    setProducts(deleteProduct(id))
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)
      const nextCart = existingItem
        ? currentCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...currentCart, { ...product, quantity: 1 }]
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart))
      return nextCart
    })
  }

  function changeQuantity(productId, quantity) {
    setCart((currentCart) => {
      const nextCart =
        quantity < 1
          ? currentCart.filter((item) => item.id !== productId)
          : currentCart.map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            )
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart))
      return nextCart
    })
  }

  function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY)
    setCart([])
  }

  const value = {
    products,
    cart,
    addProduct,
    editProduct,
    removeProduct,
    addToCart,
    changeQuantity,
    clearCart,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

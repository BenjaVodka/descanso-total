import { initialProducts } from '../data/products.js'

const STORAGE_KEY = 'descanso-total.products'

export function getProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY)
  if (savedProducts === null) return initialProducts

  const products = JSON.parse(savedProducts)
  if (!Array.isArray(products)) {
    throw new Error('Los productos guardados tienen un formato inválido.')
  }
  return products
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function createProduct(product) {
  const products = getProducts()
  const newProduct = { ...product, id: crypto.randomUUID() }
  saveProducts([...products, newProduct])
  return newProduct
}

export function updateProduct(id, changes) {
  const products = getProducts()
  const productExists = products.some((product) => product.id === id)
  if (!productExists) throw new Error('No se encontró el producto que intentas actualizar.')

  const updatedProducts = products.map((product) =>
    product.id === id ? { ...product, ...changes, id } : product,
  )
  saveProducts(updatedProducts)
  return updatedProducts.find((product) => product.id === id)
}

export function deleteProduct(id) {
  const products = getProducts()
  const updatedProducts = products.filter((product) => product.id !== id)
  if (updatedProducts.length === products.length) {
    throw new Error('No se encontró el producto que intentas eliminar.')
  }
  saveProducts(updatedProducts)
  return updatedProducts
}

export function resetProductsForTests() {
  localStorage.removeItem(STORAGE_KEY)
}

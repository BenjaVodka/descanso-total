import { initialProducts } from '../data/products.js'

const STORAGE_KEY = 'descanso-total.products'

export function getProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY)
  if (savedProducts === null) return initialProducts

  try {
    const products = JSON.parse(savedProducts)
    if (!Array.isArray(products)) return initialProducts
    return products
  } catch {
    return initialProducts
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function createProduct(product) {
  const products = getProducts()
  const newProduct = {
    ...product,
    id: product.id || `HAB${Date.now().toString().slice(-3)}`,
    roomStatus: product.roomStatus || 'Disponible',
    capacity: product.capacity || '2 personas',
  }
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

export function updateRoomStatus(id, roomStatus) {
  return updateProduct(id, { roomStatus })
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

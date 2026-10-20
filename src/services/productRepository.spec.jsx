import {
  createProduct,
  deleteProduct,
  getProducts,
  resetProductsForTests,
  updateProduct,
} from './productRepository.js'
import { initialProducts } from '../data/products.js'

describe('productRepository', () => {
  beforeEach(() => {
    resetProductsForTests()
  })

  it('returns the sample catalog when there is no saved data', () => {
    expect(getProducts()).toEqual(initialProducts)
  })

  it('creates, reads, updates, and deletes products from localStorage', () => {
    const product = createProduct({
      name: 'Frazada de prueba',
      category: 'Ropa de cama',
      price: 25000,
      offerPrice: null,
      stock: 2,
      image: 'https://example.com/frazada.jpg',
      description: 'Producto de prueba',
    })

    expect(getProducts().some((item) => item.id === product.id)).toBeTrue()
    expect(updateProduct(product.id, { stock: 4 }).stock).toBe(4)
    expect(getProducts().find((item) => item.id === product.id).stock).toBe(4)
    expect(deleteProduct(product.id).some((item) => item.id === product.id)).toBeFalse()
  })

  it('reports attempts to update a product that does not exist', () => {
    expect(() => updateProduct('missing-product', { stock: 1 }))
      .toThrowError('No se encontró el producto que intentas actualizar.')
  })
})

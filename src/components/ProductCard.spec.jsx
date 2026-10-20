import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider } from '../context/StoreProvider.jsx'
import { ProductCard } from './ProductCard.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const product = {
  id: 'almohada-prueba',
  name: 'Almohada de prueba',
  category: 'Almohadas',
  price: 30000,
  offerPrice: 25000,
  stock: 3,
  description: 'Producto de prueba',
  image: 'https://example.com/almohada.jpg',
}

describe('ProductCard', () => {
  let container
  let root

  beforeEach(() => {
    localStorage.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('renders product properties and its offer price', () => {
    act(() => {
      root.render(<MemoryRouter><StoreProvider><ProductCard product={product} /></StoreProvider></MemoryRouter>)
    })

    expect(container.textContent).toContain('Almohada de prueba')
    expect(container.textContent).toContain('Oferta')
    expect(container.querySelector('img').getAttribute('alt')).toBe(product.name)
  })

  it('adds the selected product to the persistent cart when clicked', () => {
    act(() => {
      root.render(<MemoryRouter><StoreProvider><ProductCard product={product} /></StoreProvider></MemoryRouter>)
    })
    const button = container.querySelector('button')

    act(() => button.click())

    const savedCart = JSON.parse(localStorage.getItem('descanso-total.cart'))
    expect(savedCart).toEqual([{ ...product, quantity: 1 }])
  })

  it('disables the add button when the product is out of stock', () => {
    act(() => {
      root.render(<MemoryRouter><StoreProvider><ProductCard product={{ ...product, stock: 0 }} /></StoreProvider></MemoryRouter>)
    })

    expect(container.querySelector('button').disabled).toBeTrue()
    expect(container.querySelector('button').textContent).toBe('Sin stock')
  })
})

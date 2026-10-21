import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider } from '../context/StoreProvider.jsx'
import { ProductCard } from './ProductCard.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const sampleProduct = {
  id: 'HAB-TEST',
  name: 'Habitación Suite de Prueba',
  category: 'Suites',
  price: 150000,
  offerPrice: 120000,
  stock: 3,
  capacity: '2 personas',
  roomStatus: 'Disponible',
  description: 'Habitación para pruebas unitarias',
  image: 'https://example.com/suite.jpg',
}

describe('ProductCard Component', () => {
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

  it('renders product properties, capacity, and image alt attribute correctly', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <StoreProvider>
            <ProductCard product={sampleProduct} />
          </StoreProvider>
        </MemoryRouter>,
      )
    })

    expect(container.textContent).toContain('Habitación Suite de Prueba')
    expect(container.textContent).toContain('Suites')
    expect(container.textContent).toContain('2 personas')
    expect(container.querySelector('img').getAttribute('alt')).toBe(sampleProduct.name)
  })

  it('conditionally renders the sale badge when offerPrice is lower than normal price', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <StoreProvider>
            <ProductCard product={sampleProduct} />
          </StoreProvider>
        </MemoryRouter>,
      )
    })

    expect(container.querySelector('.sale-badge')).not.toBeNull()
    expect(container.querySelector('.sale-badge').textContent).toBe('Oferta')

    // Sin oferta
    act(() => {
      root.render(
        <MemoryRouter>
          <StoreProvider>
            <ProductCard product={{ ...sampleProduct, offerPrice: null }} />
          </StoreProvider>
        </MemoryRouter>,
      )
    })
    expect(container.querySelector('.sale-badge')).toBeNull()
  })

  it('disables the reservation button and shows "Sin stock" when stock is 0', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <StoreProvider>
            <ProductCard product={{ ...sampleProduct, stock: 0 }} />
          </StoreProvider>
        </MemoryRouter>,
      )
    })

    const button = container.querySelector('button')
    expect(button.disabled).toBeTrue()
    expect(button.textContent.trim()).toBe('Sin stock')
  })

  it('handles user click event and adds the item to the persistent cart', () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <StoreProvider>
            <ProductCard product={sampleProduct} />
          </StoreProvider>
        </MemoryRouter>,
      )
    })

    const button = container.querySelector('button')
    act(() => {
      button.click()
    })

    const savedCart = JSON.parse(localStorage.getItem('descanso-total.cart'))
    expect(savedCart).not.toBeNull()
    expect(savedCart.length).toBe(1)
    expect(savedCart[0].id).toBe(sampleProduct.id)
    expect(savedCart[0].quantity).toBe(1)
  })
})

import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard.jsx'
import { useStore } from '../context/useStore.js'
import { formatPrice } from '../utils/formatPrice.js'

const categories = ['Colchones', 'Almohadas', 'Ropa de cama', 'Camas']

function ProductGrid({ products, emptyMessage = 'No encontramos productos para mostrar.' }) {
  if (products.length === 0) return <p className="empty-state">{emptyMessage}</p>
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="section-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  )
}

export function HomePage() {
  const { products } = useStore()
  const [search, setSearch] = useState('')
  const visibleProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es')
    return products.filter((product) => product.name.toLocaleLowerCase('es').includes(term))
  }, [products, search])

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <span className="eyebrow">EL DESCANSO QUE TE HACE BIEN</span>
          <h1>Tu casa también<br />puede ser tu refugio.</h1>
          <p>Encuentra todo lo que necesitas para dormir mejor y despertar con energía.</p>
          <Link className="btn btn-light hero-button" to="/categorias">Explorar productos <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero-note">Diseñado para descansar<br />de verdad.</div>
      </section>

      <section className="container content-section">
        <div className="section-heading-row">
          <SectionTitle eyebrow="NUESTROS FAVORITOS" title="Un buen descanso empieza aquí" />
          <div className="search-box">
            <label className="visually-hidden" htmlFor="product-search">Buscar productos</label>
            <input
              id="product-search"
              className="form-control"
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <ProductGrid products={visibleProducts.slice(0, 4)} />
      </section>

      <section className="category-strip">
        <div className="container category-strip-inner">
          <div>
            <span className="eyebrow">ENCUENTRA TU FAVORITO</span>
            <h2>Todo para tu descanso</h2>
          </div>
          {categories.map((category) => (
            <Link className="category-pill" key={category} to={`/categorias/${encodeURIComponent(category)}`}>
              {category}<span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container content-section">
        <SectionTitle eyebrow="PRECIOS PARA DORMIR TRANQUILO" title="Ofertas para renovar tu espacio" />
        <ProductGrid products={products.filter((product) => product.offerPrice).slice(0, 4)} />
        <div className="center-action"><Link className="btn btn-dark" to="/ofertas">Ver todas las ofertas</Link></div>
      </section>
    </>
  )
}

export function CategoriesPage() {
  const { category } = useParams()
  const { products } = useStore()
  const [sortOrder, setSortOrder] = useState('featured')
  const currentCategory = category ? decodeURIComponent(category) : ''
  const filteredProducts = products.filter((product) => !currentCategory || product.category === currentCategory)
  const sortedProducts = [...filteredProducts].sort((first, second) => {
    if (sortOrder === 'price-asc') return effectivePrice(first) - effectivePrice(second)
    if (sortOrder === 'price-desc') return effectivePrice(second) - effectivePrice(first)
    return first.name.localeCompare(second.name, 'es')
  })

  return (
    <section className="container content-section">
      <SectionTitle
        eyebrow="DESCUBRE LA COLECCIÓN"
        title={currentCategory || 'Todas las categorías'}
        description="Productos pensados para acompañar tus mejores noches."
      />
      <div className="category-filter">
        <div className="filter-pills">
          <Link className={`filter-pill ${!currentCategory ? 'active' : ''}`} to="/categorias">Todos</Link>
          {categories.map((item) => (
            <Link className={`filter-pill ${currentCategory === item ? 'active' : ''}`} key={item} to={`/categorias/${encodeURIComponent(item)}`}>
              {item}
            </Link>
          ))}
        </div>
        <label className="sort-control">
          Ordenar por
          <select className="form-select" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="featured">Nombre</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </label>
      </div>
      <ProductGrid products={sortedProducts} />
    </section>
  )
}

export function OffersPage() {
  const { products } = useStore()
  return (
    <section className="container content-section">
      <SectionTitle eyebrow="OPORTUNIDADES PARA DESCANSAR MEJOR" title="Ofertas especiales" description="Precios especiales por tiempo limitado." />
      <ProductGrid products={products.filter((product) => product.offerPrice && product.offerPrice < product.price)} emptyMessage="Por ahora no hay ofertas disponibles." />
    </section>
  )
}

export function ProductDetailPage() {
  const { productId } = useParams()
  const { products, addToCart } = useStore()
  const product = products.find((item) => item.id === productId)
  if (!product) {
    return <section className="container content-section"><h1>Producto no encontrado</h1><Link to="/categorias">Volver a la tienda</Link></section>
  }

  const discounted = product.offerPrice && product.offerPrice < product.price
  return (
    <section className="container content-section">
      <nav className="breadcrumb-line" aria-label="breadcrumb">
        <Link to="/">Inicio</Link><span>/</span><Link to="/categorias">Tienda</Link><span>/</span><span>{product.name}</span>
      </nav>
      <div className="product-detail">
        <img src={product.image} alt={product.name} />
        <div className="product-detail-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="detail-price">
            <strong>{formatPrice(discounted ? product.offerPrice : product.price)}</strong>
            {discounted && <del>{formatPrice(product.price)}</del>}
          </div>
          <p className="stock-note">{product.stock > 0 ? `${product.stock} disponibles` : 'Producto sin stock'}</p>
          <button className="btn btn-dark btn-lg" type="button" onClick={() => addToCart(product)} disabled={product.stock < 1}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  )
}

export function CartPage() {
  const { cart, changeQuantity } = useStore()
  const subtotal = cart.reduce((total, item) => total + itemPrice(item) * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <section className="container content-section empty-cart">
        <span className="empty-icon" aria-hidden="true">♡</span>
        <h1>Tu carrito está esperando</h1>
        <p>Agrega productos que te ayuden a descansar mejor.</p>
        <Link className="btn btn-dark" to="/categorias">Ir a la tienda</Link>
      </section>
    )
  }

  return (
    <section className="container content-section">
      <SectionTitle eyebrow="TU SELECCIÓN" title="Carrito de compras" />
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div className="cart-item-info">
                <span className="product-category">{item.category}</span>
                <h2>{item.name}</h2>
                <strong>{formatPrice(itemPrice(item))}</strong>
              </div>
              <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
                <button type="button" aria-label={`Quitar una unidad de ${item.name}`} onClick={() => changeQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button type="button" aria-label={`Agregar una unidad de ${item.name}`} onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="remove-item" type="button" aria-label={`Eliminar ${item.name}`} onClick={() => changeQuantity(item.id, 0)}>Eliminar</button>
            </article>
          ))}
        </div>
        <aside className="summary-card">
          <h2>Resumen de compra</h2>
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row"><span>Envío</span><span>{subtotal >= 100000 ? 'Gratis' : 'Se calcula al continuar'}</span></div>
          <div className="summary-row summary-total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div>
          <Link className="btn btn-dark w-100" to="/checkout">Continuar compra</Link>
          <Link className="continue-shopping" to="/categorias">Seguir comprando</Link>
        </aside>
      </div>
    </section>
  )
}

export function CheckoutPage() {
  const { cart, clearCart } = useStore()
  const navigate = useNavigate()
  const subtotal = cart.reduce((total, item) => total + itemPrice(item) * item.quantity, 0)

  function submitOrder(event) {
    event.preventDefault()
    if (cart.length === 0) return
    const formData = new FormData(event.currentTarget)
    const order = {
      customer: formData.get('name'),
      email: formData.get('email'),
      address: formData.get('address'),
      items: cart,
      total: subtotal,
      number: `DT-${Date.now().toString().slice(-7)}`,
    }
    const successful = formData.get('payment-result') === 'success'
    if (successful) clearCart()
    navigate('/resultado-compra', { state: { successful, order } })
  }

  if (cart.length === 0) {
    return <section className="container content-section empty-cart"><h1>No hay productos en tu carrito</h1><Link className="btn btn-dark" to="/categorias">Volver a la tienda</Link></section>
  }

  return (
    <section className="container content-section">
      <SectionTitle eyebrow="CASI LISTO" title="Finalizar compra" description="Cuéntanos dónde enviamos tu pedido." />
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder}>
          <h2>Datos de contacto</h2>
          <div className="row g-3">
            <div className="col-12"><label className="form-label" htmlFor="name">Nombre completo</label><input className="form-control" id="name" name="name" required autoComplete="name" /></div>
            <div className="col-12"><label className="form-label" htmlFor="email">Correo electrónico</label><input className="form-control" id="email" name="email" type="email" required autoComplete="email" /></div>
            <div className="col-12"><label className="form-label" htmlFor="address">Dirección de envío</label><input className="form-control" id="address" name="address" required autoComplete="street-address" /></div>
            <div className="col-md-6"><label className="form-label" htmlFor="commune">Comuna</label><input className="form-control" id="commune" name="commune" required /></div>
          </div>
          <fieldset className="payment-options">
            <legend>Simulación de pago</legend>
            <p>Elige el resultado para probar ambos flujos de compra.</p>
            <label className="form-check"><input className="form-check-input" type="radio" name="payment-result" value="success" defaultChecked /><span className="form-check-label">Pago aprobado</span></label>
            <label className="form-check"><input className="form-check-input" type="radio" name="payment-result" value="failure" /><span className="form-check-label">Simular pago rechazado</span></label>
          </fieldset>
          <button className="btn btn-dark btn-lg" type="submit">Confirmar pedido</button>
        </form>
        <aside className="summary-card">
          <h2>Tu pedido</h2>
          {cart.map((item) => <div className="summary-row" key={item.id}><span>{item.name} × {item.quantity}</span><span>{formatPrice(itemPrice(item) * item.quantity)}</span></div>)}
          <div className="summary-row summary-total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div>
        </aside>
      </div>
    </section>
  )
}

export function OrderResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { successful, order } = location.state ?? {}
  if (!order) {
    return <section className="container content-section empty-cart"><h1>No hay una compra para mostrar</h1><Link className="btn btn-dark" to="/">Volver al inicio</Link></section>
  }

  return (
    <section className="container content-section order-result">
      <div className={`result-icon ${successful ? 'success' : 'failure'}`} aria-hidden="true">{successful ? '✓' : '!'}</div>
      <span className="eyebrow">{successful ? 'COMPRA CONFIRMADA' : 'NO SE PUDO PROCESAR'}</span>
      <h1>{successful ? '¡Gracias por tu compra!' : 'Tu pago fue rechazado'}</h1>
      <p>{successful ? `Preparamos tu pedido ${order.number} para ${order.customer}.` : 'No se realizó ningún cobro. Puedes volver al carrito e intentarlo otra vez.'}</p>
      {successful && <div className="order-receipt"><span>Número de pedido</span><strong>{order.number}</strong><span>Total</span><strong>{formatPrice(order.total)}</strong><span>Enviaremos la confirmación a</span><strong>{order.email}</strong></div>}
      <button className="btn btn-dark" type="button" onClick={() => navigate(successful ? '/' : '/carrito')}>
        {successful ? 'Volver a la tienda' : 'Volver al carrito'}
      </button>
    </section>
  )
}

function effectivePrice(product) {
  return product.offerPrice && product.offerPrice < product.price ? product.offerPrice : product.price
}

function itemPrice(item) {
  return item.offerPrice && item.offerPrice < item.price ? item.offerPrice : item.price
}

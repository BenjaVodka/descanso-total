import { Link, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../context/useStore.js'

export function SiteLayout() {
  const { cart } = useStore()
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <div className="announcement-bar">Tu descanso merece lo mejor · Envío gratis desde $100.000</div>
      <nav className="navbar navbar-expand-lg bg-white site-navbar">
        <div className="container">
          <Link className="navbar-brand brand" to="/">
            <span className="brand-mark">DT</span>
            <span>descanso<span className="brand-light">total</span></span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main-navigation"
            aria-controls="main-navigation"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="main-navigation">
            <div className="navbar-nav mx-auto">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
              <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
              <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
              <NavLink className="nav-link" to="/admin">Administración</NavLink>
            </div>
            <Link className="cart-link" to="/carrito" aria-label={`Carrito, ${cartCount} productos`}>
              <span aria-hidden="true">♧</span>
              <span>Carrito</span>
              <span className="cart-count">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">DT</span>
            <span>descanso<span className="brand-light">total</span></span>
          </Link>
          <p>Pequeños rituales, grandes descansos.</p>
          <span>© 2026 Descanso Total</span>
        </div>
      </footer>
    </>
  )
}

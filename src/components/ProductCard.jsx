import { Link } from 'react-router-dom'
import { useStore } from '../context/useStore.js'
import { formatPrice } from '../utils/formatPrice.js'

export function ProductCard({ product }) {
  const { addToCart } = useStore()
  const discounted = product.offerPrice && product.offerPrice < product.price

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/producto/${product.id}`}>
        <img className="product-image" src={product.image} alt={product.name} />
        {discounted && <span className="sale-badge">Oferta</span>}
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3>
        <div className="product-prices">
          <strong>{formatPrice(discounted ? product.offerPrice : product.price)}</strong>
          {discounted && <del>{formatPrice(product.price)}</del>}
        </div>
        <button
          className="btn btn-outline-dark add-button"
          type="button"
          onClick={() => addToCart(product)}
          disabled={product.stock < 1}
        >
          {product.stock < 1 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}

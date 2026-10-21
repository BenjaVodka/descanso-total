import { Link } from 'react-router-dom'
import { useStore } from '../context/useStore.js'
import { formatPrice } from '../utils/formatPrice.js'

export function ProductCard({ product }) {
  const { addToCart } = useStore()
  const discounted = Boolean(product.offerPrice && product.offerPrice < product.price)
  const isOutOfStock = product.stock < 1

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/producto/${product.id}`}>
        <img className="product-image" src={product.image} alt={product.name} />
        {discounted && <span className="sale-badge">Oferta</span>}
        {product.roomStatus && (
          <span
            className={`status-badge ${
              product.roomStatus === 'Disponible'
                ? 'status-available'
                : product.roomStatus === 'En limpieza'
                ? 'status-cleaning'
                : 'status-occupied'
            }`}
          >
            {product.roomStatus}
          </span>
        )}
      </Link>
      <div className="product-info">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          {product.capacity && <span className="capacity-badge">{product.capacity}</span>}
        </div>
        <h3 className="product-title">
          <Link to={`/producto/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-prices">
          <strong className="current-price">
            {formatPrice(discounted ? product.offerPrice : product.price)}
          </strong>
          {discounted && <del className="original-price">{formatPrice(product.price)}</del>}
        </div>
        <button
          className="btn btn-outline-dark add-button"
          type="button"
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Sin stock' : 'Agregar a la reserva'}
        </button>
      </div>
    </article>
  )
}

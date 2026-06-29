/* src/components/ProductCard.jsx — Individual product listing card */

import { useState } from 'react'
import Badge from './Badge'

const BADGE_VARIANT = { red: 'red', accent: 'accent', green: 'green' }

/**
 * ProductCard — card แสดงสินค้าเดี่ยวๆ ใน grid
 * @param {object}   product       ข้อมูลสินค้าจาก mockData
 * @param {Function} onAddToCart   callback เมื่อกด Add to Cart
 */
export default function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false)

  return (
    <article className="product-card" id={`product-${product.id}`} aria-label={product.name}>
      {/* Thumbnail */}
      <div className="product-card-image" style={{ background: product.bg }}>
        <span style={{ fontSize: '56px' }} role="img" aria-label={product.category}>
          {product.emoji}
        </span>

        {product.badge && (
          <div className="product-card-badge">
            <Badge variant={BADGE_VARIANT[product.badge.type]}>
              {product.badge.text}
            </Badge>
          </div>
        )}

        <button
          className="product-card-wishlist"
          onClick={e => { e.stopPropagation(); setWished(w => !w) }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wish-${product.id}`}
        >
          {wished ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Details */}
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-seller">
          <span aria-hidden="true">👤</span>
          {product.seller}
          <span style={{ marginLeft: 'auto', color: 'var(--amber)', fontSize: '12px' }}>
            ★ {product.rating}
          </span>
        </div>

        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="product-card-price-main">${product.price}</span>
            {product.originalPrice && (
              <span className="product-card-price-orig">${product.originalPrice}</span>
            )}
          </div>
          <button
            className="product-card-add"
            onClick={() => onAddToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            id={`add-cart-${product.id}`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
